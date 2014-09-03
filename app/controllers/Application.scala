package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import models._


object Application extends Controller with MenuBuilder with Secured {

  def index = Action { implicit request => Ok(views.html.index("Main page.")) }

  def day(i: Int) = Action { implicit request => Ok(views.html.day("It's a day page." + i)) }

  def about() = withUser { user => implicit request => Ok(views.html.about(header)) }
  
  def contact = Action { implicit request => Ok(views.html.contact(header)) }
}