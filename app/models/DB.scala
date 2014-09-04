package models

//import org.squeryl.annotations.Column
import scala.language.implicitConversions
import org.squeryl._
import org.squeryl.dsl._
import adapters.H2Adapter
import org.joda.time.DateTime
import SquerylHelper._

class BusinessObject() extends KeyedEntity[Long] {
  val id: Long = 0 
}
abstract class ManyToManyObject() extends KeyedEntity[CompositeKey2[Long,Long]] {
}

case class User(val email: String, val name: String, val password: String) extends BusinessObject

//  @Column("AUTHOR_ID") var authorId: Long, // the default 'exact match' policy can be overriden   
 
object AppDB extends Schema {
   val users = table[User]("user")
}
   