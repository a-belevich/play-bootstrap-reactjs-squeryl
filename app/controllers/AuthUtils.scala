package controllers

import play.api.mvc._
import models._

object AuthUtils {
  def username(request: RequestHeader) = request.session.get(Security.username)
  
  def currentUser(request: RequestHeader) = username(request).flatMap(Users.findOneByUsername)
  
  def withUser[T](request: RequestHeader, t: T) = currentUser(request).map(_ => t)
}

trait Secured {
  self: Controller =>

  def onUnauthorized(request: RequestHeader) = Results.Redirect(routes.Auth.login)
  
  def withAuth(f: => String => Request[AnyContent] => Result) = {
    Security.Authenticated(AuthUtils.username, onUnauthorized) { user => Action(request => f(user)(request)) }
  }

  /**
   * This method shows how you could wrap the withAuth method to also fetch your user
   * You will need to implement UserDAO.findOneByUsername
   */
  def withUser(f: User => Request[AnyContent] => Result) = withAuth { username => implicit request =>
    Users.findOneByUsername(username).map { user => f(user)(request) }.getOrElse(onUnauthorized(request))
  }
}

