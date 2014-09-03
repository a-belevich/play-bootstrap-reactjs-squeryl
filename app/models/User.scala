package models

import play.api.db.DB
import play.api.Play.current

case class User(email: String, name: String, password: String)

object Users /*extends Table[User]("USER") */ {
  def authenticate(email: String, password: String): Boolean = {
//    database withSession { implicit session =>
//      val q1 = for (u <- Users if u.email === email && u.password === password) yield u
//      println("^^^^^^^^" + Query(q1.length).first)
//      Query(q1.length).first
//    }
    (email == "admin@aaa.com" && password == "1234")  
  }
  
  def findOneByUsername(username: String): Option[User] = 
    if (username == "admin@aaa.com") Some(User("admin@aaa.com", "Administrator", "1234")) else None
}
