package controllers

import play.api.mvc._
import play.core.Router
import scala.runtime.AbstractPartialFunction
import scala.reflect.ClassTag
import play.api.Play
import play.core.Router.JavascriptReverseRoute
import models._

trait ResourceRouter extends Router.Routes {
  self =>

  def name: String
  var path: String = ""
  implicit val idBindableImpl: PathBindable[Long]

  val MaybeSlash = "/?".r
  val Id = "/([^/]+)".r
  val Edit = "/([^/]+)/edit".r

  def withId(id: String, action: Long => EssentialAction) = idBindableImpl.bind("id", id).fold(badRequest, action)

  def tryResolve(rh: RequestHeader, method: String, pathSuffix: String): Option[RequestHeader => Handler]

  def resolve[A <: RequestHeader, B >: Handler](rh: A, default: A => B): (A => B) = {
    if (!rh.path.startsWith(path)) default else {
      val resolved = tryResolve(rh, rh.method, rh.path.drop(path.length))
      resolved.getOrElse(default)
    }
  }

  def routes = new AbstractPartialFunction[RequestHeader, Handler] {

    override def applyOrElse[A <: RequestHeader, B >: Handler](rh: A, default: A => B) = resolve(rh, default)(rh)

    def isDefinedAt(rh: RequestHeader) = resolve(rh, null) != null
  }

  def setPrefix(prefix: String) {
    path = prefix
  }

  def prefix = path

  def documentation = Seq(
    ("GET", path + "/$id<[^/]+>", name + ".get(id: Long)"),
    ("POST", path, name + ".put"),
    ("DELETE", path + "/$id<[^/]+>", name + ".destroy(id: Long)"))
}

