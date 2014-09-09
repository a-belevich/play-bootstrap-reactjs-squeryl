package models

import org.squeryl._
import org.squeryl.dsl._
import SquerylHelper._
import play.api.libs.json._
import play.api.libs.functional.syntax._

case class User(val id: Long, val email: String, val name: String, val password: String) extends BusinessObject with WithJson[User] {
  
  implicit val reads: Reads[User] = (
    (__ \ "id").read[Long] and
    (__ \ "email").read[String] and 
    (__ \ "name").read[String] and 
    (__ \ "password").read[String] 
  )(User.apply _)
  
  implicit val writes: Writes[User] = (
      (__ \ "id").write[Long] and
      (__ \ "email").write[String] and
      (__ \ "name").write[String] and
      (__ \ "password").write[String]
  )(unlift(User.unapply))
  
}


object Users {
  def authenticate(email: String, password: String): Boolean = {
    findOneByEmail(email).map(u => u.password == password).getOrElse(false)
  }

  def findOneByEmail(email: String): Option[User] =
    inTransaction {
      AppDB.users.where(u => u.email === email).headOption
    }
  
  def register(email: String, name: String, password: String) =
    inTransaction {
      AppDB.users.insert(User(0, email, name, password))
    }
}
