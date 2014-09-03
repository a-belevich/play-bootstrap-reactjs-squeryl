package controllers

import play.api.mvc._
import play.api.i18n._
import util._
import models._

case class Header(menu: Seq[MainMenuItem]/*, user: Option[String]*/)

trait MenuBuilder {
 
  def menuLoggedIn = Seq(
    SubMenuAction("/user", "Edit user", false),
    SubMenuDivider(),
    SubMenuAction("/logout", "Logout", false)
  )

  def menuNotLoggedIn = Seq(
    SubMenuAction("/login", "Log in", false),
    SubMenuDivider(),
    SubMenuAction("/register", Messages("menu.register"), false)
  )
  
  def menuUser[A](implicit request: Request[A]): MainMenuDropdown = {
    AuthUtils.currentUser(request) match {
      case Some(user) => MainMenuDropdown(user.name, false, Align.Right, menuLoggedIn)
      case None => MainMenuDropdown("User", false, Align.Right, menuNotLoggedIn)
    }
  }
  
  implicit def header[A](implicit request: Request[A]) : Header = {
    val menu: Seq[MainMenuItem] = Seq(
      MainMenuAction("/", "Home", false, Align.Left),
      MainMenuAction("/about", "About", true, Align.Left),
      MainMenuAction("/contact", "Contact", false, Align.Right),
      menuUser
//      MainMenuDropdown("Logged In", false, Align.Right, menuLoggedIn),
//      MainMenuDropdown("Not Logged In", false, Align.Right, menuNotLoggedIn)
    )
    //AuthUtils.withUser(request, MainMenuAction("/contact", "Contact", false, Align.Right))
//    val user = request.session.get("user")
    Header(menu/*, user*/)
  }
}