package controllers

import scala.language.implicitConversions
import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.functional.syntax._
import models._
import org.squeryl._
import org.squeryl.dsl._
import SquerylHelper._

class RestTable[T <: BusinessObject/*, A <: RequestHeader, B >: Handler*/](val table: Table[T], val instance: WithJson[T]) 
  (implicit ked: KeyedEntityDef[T,Long], dsl: QueryDsl, toCanLookup: Long => CanLookup, idBindable: PathBindable[Long]) 
  extends Controller with ResourceRouter {
 
  def name = table.name
  setPrefix(name)
  
  implicit val reads = instance.reads
  implicit val writes = instance.writes
  val idBindableImpl = idBindable

  def tryResolve(rh: RequestHeader, method: String, pathSuffix: String): Option[RequestHeader => Handler] = {
    (method, pathSuffix) match {
      case ("GET", Id(id)) => Some[RequestHeader => Handler](rh => withId(id, this.get))
      case ("POST", MaybeSlash()) => Some[RequestHeader => Handler](rh => this.put)
      case ("DELETE", Id(id)) => Some[RequestHeader => Handler](rh => withId(id, this.destroy))
      case _ => None
    }
  }

  def get(id: Long) = Action { inTransaction {
        val obj = table.lookup(id)(ked, dsl, toCanLookup)
        obj match {
          case Some(obj) => Ok(Json.toJson(obj)) 
          case None => NotFound 
        }
    }}
  
  def put = Action(parse.json) { request =>
       request.body.validate[T].map{
         case obj => {
           val saved = inTransaction { 
             if (obj.isNew) table.insert(obj) else {
               table.update(obj)
               obj
             }
           }
           Ok(Json.toJson(saved))
//           Created
         }
       }.recoverTotal{
         e => BadRequest("Detected error:"+ JsError.toFlatJson(e))
       }
    }
  
  def destroy(id: Long) = Action { inTransaction {
      table.delete(id)(ked, dsl, toCanLookup)
      Ok
    }}
}

object RestTable {
  def apply[T <: BusinessObject/*, A <: RequestHeader, B >: Handler*/](table: Table[T], instance: WithJson[T])(implicit ked: KeyedEntityDef[T,Long], dsl: QueryDsl, toCanLookup: Long => CanLookup, idBindable: PathBindable[Long]) = 
    new RestTable[T](table, instance)(ked, dsl, toCanLookup, idBindable)
} 