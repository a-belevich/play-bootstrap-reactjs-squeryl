package models

import org.squeryl._
import org.squeryl.dsl._
import SquerylHelper._

//case class User(email: String, name: String, password: String)

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
      AppDB.users.insert(User(email, name, password))
    }
}
