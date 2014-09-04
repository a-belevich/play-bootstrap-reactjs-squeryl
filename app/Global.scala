import models._
import org.squeryl._
import adapters.H2Adapter
import play.api.db.DB
import play.api.Play.current
import play.api.mvc._
import SquerylHelper._

object Global extends play.api.GlobalSettings {

  val dbAdapter = new H2Adapter()
  
  override def onStart(app: play.api.Application) {
    Class.forName("org.h2.Driver")
    SessionFactory.concreteFactory = Some(() => org.squeryl.Session.create(DB.getDataSource().getConnection(), dbAdapter));    
    
    inTransaction {
      AppDB.drop
      AppDB.create
      
      val userId = AppDB.users.insert(User("admin@site.com", "Administrator", "1234")).id 
    }
  }

  override def onRouteRequest(req: RequestHeader): Option[Handler] = {
//  if (req.host == "foo.example.com") {
//    foo.Routes.routes.lift(req)
//  } else if (req.host == "bar.example.com") {
//    bar.Routes.routes.lift(req)
//  } else {
    super.onRouteRequest(req)
//  }
}
}