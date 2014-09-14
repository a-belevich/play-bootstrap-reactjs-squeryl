package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.functional.syntax._
import models._
import org.squeryl._
import SquerylHelper._
import play.core.Router

object RestApi extends Controller with ResourceRouter {

  def name = "api"
  setPrefix("/" + name)
  val idBindableImpl = PathBindable.bindableLong

  val usersCRUD = RestTable[User](AppDB.users, new User)

  var tables: List[ResourceRouter] = List(usersCRUD)
  
  def tryResolve(rh: RequestHeader, method: String, pathSuffix: String): Option[RequestHeader => Handler] = {
      val nextStep = "/([^/]+)(.+)".r
      pathSuffix match {
        case nextStep(table, params) => {
          val router = tables.find(_.name == table)
          val result = router.flatMap(_.tryResolve(rh, method, params))
          result
        } 
        case _ => throw new Exception("Pattern is broken: " + pathSuffix)//None
      }
  }
}
