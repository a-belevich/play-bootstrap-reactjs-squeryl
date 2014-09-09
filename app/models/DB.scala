package models

//import org.squeryl.annotations.Column
import scala.language.implicitConversions
import org.squeryl._
import org.squeryl.dsl._
import adapters.H2Adapter
import org.joda.time.DateTime
import SquerylHelper._

abstract class ManyToManyObject() extends KeyedEntity[CompositeKey2[Long,Long]] {
}

//  @Column("AUTHOR_ID") var authorId: Long, // the default 'exact match' policy can be overriden   
 
object AppDB extends Schema {
  def register[T <: BusinessObject](tableName: String)(implicit manifestT: Manifest[T]): Table[T] = {
    this.table[T](tableName)
  }

  val users = table[User]("user")
}
   