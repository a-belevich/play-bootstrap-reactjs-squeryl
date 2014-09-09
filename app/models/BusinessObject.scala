package models

//import org.squeryl.annotations.Column
import scala.language.implicitConversions
import org.squeryl._
import org.squeryl.dsl._
import adapters.H2Adapter
import org.joda.time.DateTime
import SquerylHelper._

abstract class BusinessObject extends KeyedEntity[Long] {
}
   
object BusinessObject {
}