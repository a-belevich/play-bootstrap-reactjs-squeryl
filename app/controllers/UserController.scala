package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import models._
import scala.util.Random

object UserController extends Controller with MenuBuilder with Secured {

  lazy val editUserForm = Form(
    tuple("email" -> text, "username" -> text) // mapping(
// verifying ("Invalid email or username", result => result match {
//      case (email, username) => Users.authenticate(email, password)
//      case _ => false
//    })
  )

  def user() = withUser { user => implicit request =>
//    val username = user.name
    val filledForm = editUserForm.fill(user.email, user.name)
    Ok(views.html.user(filledForm))
  }

  def edituser = withUser { user => implicit request =>
    editUserForm.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.user(formWithErrors)),
      userdata => {
         // save user from tuple userdata
         val saved = Random.nextBoolean
         Redirect(routes.UserController.user).withSession(Security.username -> userdata._1).flashing(saved match {
            case true => "success" -> s"User ${userdata._2 } has been updated"
            case _ => "failure" -> s"Could not update user ${userdata._2}"
          })

      }
    )
  }
  
  lazy val changePasswordForm = Form(
    tuple("old" -> text, "new" -> text, "confirm" -> text)
//   verifying ("Invalid email or username", result => result match {
//      case (email, username) => Users.authenticate(email, password)
//      case _ => false
//    })
  )

  def password() = withUser { user => implicit request =>
    Ok(views.html.password(changePasswordForm))
  }

  def changepassword = Action { implicit request =>
    changePasswordForm.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.password(formWithErrors)),
      userdata => {
         // save user from tuple userdata
         Redirect(routes.Application.index).withSession(Security.username -> userdata._2)
      }
    )
  }
}