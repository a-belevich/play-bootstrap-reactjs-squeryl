package models

import scala.language.implicitConversions
import org.squeryl._
import org.squeryl.dsl._
import org.joda.time._
import java.sql.Timestamp
import java.sql.ResultSet

object SquerylHelper extends PrimitiveTypeMode {
// optionally define keyed entities :  
//  implicit object courseKED extends KeyedEntityDef[Course,Int] {
//    def getId(a:Course) = a.id
//    def isPersisted(a:Course) = a.id > 0
//    def idPropertyName = "id"
//    override def optimisticCounterPropertyName = Some("occVersionNumber")
//  }

  // optionally define custom types :
  implicit val jodaTimeTEF = new NonPrimitiveJdbcMapper[Timestamp, DateTime, TTimestamp](timestampTEF, this) {
    //convert to and from the native JDBC type
    def convertFromJdbc(t: Timestamp) = new DateTime(t)
    def convertToJdbc(t: DateTime) = new Timestamp(t.getMillis())
  }

  /**
   * We define this one here to allow working with Option of our new type, this also
   * allows the 'nvl' function to work  
   */
  implicit val optionJodaTimeTEF = 
    new TypedExpressionFactory[Option[DateTime], TOptionTimestamp] 
      with DeOptionizer[Timestamp, DateTime, TTimestamp, Option[DateTime], TOptionTimestamp] {

    val deOptionizer = jodaTimeTEF
  }
  
  /**
   * the following are necessary for the AST lifting  
   */
  implicit def jodaTimeToTE(s: DateTime) = jodaTimeTEF.create(s)  

  implicit def optionJodaTimeToTE(s: Option[DateTime]) = optionJodaTimeTEF.create(s)  
}
