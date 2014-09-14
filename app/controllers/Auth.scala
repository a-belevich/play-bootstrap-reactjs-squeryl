package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import models._
import play.api.data.validation.ValidationError
import play.api.data.validation.Constraint
import play.api.data.validation.Valid
import play.api.data.validation.Invalid

object Auth extends Controller with MenuBuilder {

  lazy val loginForm = Form(
    tuple(
      "email" -> text,
      "password" -> text,
      "nexturl" -> text
    ).verifying("Invalid email or password", result => result match {
      case (email, password, nexturl) => Users.authenticate(email, password)
      case _ => false
    })
  )  

  def login = Action { implicit request =>
    Ok(views.html.login(loginForm))
  }

  def authenticate = Action { implicit request =>
    loginForm.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.login(formWithErrors)),
      loggedIn => {
        val nextUrl = loggedIn._3
        if (nextUrl != "")
          Redirect(nextUrl).withSession(Security.username -> loggedIn._1)
        else
          Redirect(routes.Application.index).withSession(Security.username -> loggedIn._1)
      }
    )
  }

  def logout = Action {
    Redirect(routes.Auth.login).withNewSession.flashing("success" -> "You are now logged out.")
  }

  val allNumbers = """\d*""".r
  val allLetters = """[A-Za-z]*""".r

  def checkPasswordQuality(password: String): Seq[ValidationError] = password match {
    case "" => Seq(ValidationError("Password is empty"))
    case allNumbers() => Seq(ValidationError("Password is all numbers"))
    case allLetters() => Seq(ValidationError("Password is all letters"))
    case _ => Nil
  }

  def validationResult(errors: Seq[ValidationError]) = if (errors.isEmpty) Valid else Invalid(errors)
  
  def checkPasswordsAreEqual(password: String, passwordConfirm: String): Seq[ValidationError] = 
    if (password.equals(passwordConfirm)) Nil else Seq(ValidationError("Passwords are different"))

  val passwordCheckConstraint: Constraint[(String, String, String, String)] = Constraint("constraints.passwordcheck")(result => 
      validationResult(checkPasswordsAreEqual(result._3, result._4) ++ checkPasswordQuality(result._3))
  )

  def checkIsNotEmpty(field: String, message: String) = if (field.isEmpty()) Seq(ValidationError(message)) else Nil
  def checkIsAlreadyRegistered(email: String) = Users.findOneByEmail(email).map(_ => ValidationError("This email already was registered")).toList
  
  val checkEmail: Constraint[(String, String, String, String)] = Constraint("constraints.emailisnotregistered")(result => {
    val errors = checkIsNotEmpty(result._1, "E-mail is empty") ++ checkIsAlreadyRegistered(result._1)
    validationResult(errors)
  })

  val checkUsername: Constraint[(String, String, String, String)] = Constraint("constraints.emailisnotregistered")(result => 
    validationResult(checkIsNotEmpty(result._2, "Username is empty"))
  )

  lazy val registerUserForm = Form(
    tuple(
//      "email" -> nonEmptyText, 
//      "username" -> text.verifying("Enter your username", {!_.isEmpty}),
//      "password" -> text.verifying("Enter your password", {!_.isEmpty}),
//      "passwordconfirm" -> text.verifying("Confirm your password", {!_.isEmpty})
      "email" -> text, 
      "username" -> text,
      "password" -> text,
      "passwordconfirm" -> text
    ).verifying (checkEmail, checkUsername, passwordCheckConstraint)
  )

  def userregistration() = Action { implicit request =>
    Ok(views.html.register(registerUserForm))
  }

  def registeruser = Action { implicit request => registerUserForm.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.register(formWithErrors)),
      userdata => {
         Users.register(userdata._1, userdata._2, userdata._3)
         Redirect(routes.Application.index).withSession(Security.username -> userdata._1)
      }
    )
  }


}

