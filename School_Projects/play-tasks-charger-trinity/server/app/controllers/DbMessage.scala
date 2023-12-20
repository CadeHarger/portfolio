package controllers

import javax.inject._

import shared.SharedMessages
import play.api.mvc._
import models._
import play.api.libs.json._

import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.ExecutionContext
import play.api.db.slick.HasDatabaseConfigProvider
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import scala.concurrent.Future

@Singleton
class DbMessage @Inject()(protected val dbConfigProvider: DatabaseConfigProvider, cc: ControllerComponents)(implicit ec: ExecutionContext) 
    extends AbstractController(cc) with HasDatabaseConfigProvider[JdbcProfile] {

    implicit val userDataReads = Json.reads[UserData]

    private val model = new UserDataDBModel(db)

    def withJsonBody[A](f: A => Future[Result])(implicit request: Request[AnyContent], reads: Reads[A]): Future[Result] = {
        request.body.asJson.map { body =>
            Json.fromJson[A](body) match {
                case JsSuccess(a, path) => f(a)
                case e @ JsError(_) => Future.successful(Redirect(routes.Rapp.load))
            }
        }.getOrElse(Future.successful(Redirect(routes.Rapp.load)))
    }

    def withSessionUsername(f: String => Future[Result])(implicit request: Request[AnyContent]): Future[Result] = {
        request.session.get("username").map(f).getOrElse(Future.successful(Ok(Json.toJson(Seq.empty[String]))))
    }

    def withSessionUsernameSync(f: String => Result)(implicit request: Request[AnyContent]): Result = {
        request.session.get("username").map(f).getOrElse(Ok(Json.toJson(Seq.empty[String])))
    }

    def withSessionUserid(f: Int => Future[Result])(implicit request: Request[AnyContent]): Future[Result] = {
        request.session.get("userid").map(userid => f(userid.toInt)).getOrElse(Future.successful(Ok(Json.toJson(Seq.empty[String]))))
    }

    def load = Action { implicit request => 
        Ok(views.html.dbversion())
    }

    def submitLogin = Action.async { implicit request =>    
        withJsonBody[UserData] { args => 
            model.validateLogin(args.username, args.password).map { userExists =>
                userExists match {
                    case Some(userid) => Ok(Json.toJson(true)).withSession(
                        "username" -> args.username, 
                        "userid" -> userid.toString, 
                        "csrfToken" -> play.filters.csrf.CSRF.getToken.map(_.value).getOrElse(""))
                    case None => Ok(Json.toJson(false))
                } 
            } 
        }
    }

    def newUser = Action.async { implicit request =>
        withJsonBody[UserData] { args => 
            model.createLogin(args.username, args.password).map { userCreated =>
                println(userCreated)
                userCreated match {
                    case Some(userid) => Ok(Json.toJson(true)).withSession(
                        "username" -> args.username, 
                        "userid" -> userid.toString,
                        "csrfToken" -> play.filters.csrf.CSRF.getToken.map(_.value).getOrElse(""))
                    case None => Ok(Json.toJson(false))
                }
            }
        }
    }

    def getPosts = Action.async { implicit request =>
        model.getPosts().map(posts => Ok(Json.toJson(posts)))
    }

    def getUser = Action { implicit request =>
        withSessionUsernameSync { username => 
            Ok(Json.toJson(username))
        }
    }

    def logout = Action { implicit request =>
        Ok(Json.toJson(true)).withSession(request.session - "username")
    }

    def newPost = Action.async { implicit request => 
        withSessionUserid { userid => 
            withJsonBody[String] { message => 
                model.newPost(userid, message).map(count => Ok(Json.toJson(count > 0)))
            }
        }
    }

    def openDms = Action.async { implicit request =>
        withSessionUsername { username => 
            withJsonBody[String] { view =>
                model.hasUser((view)).map { hadIt => 
                    if (hadIt) {
                        model.setOpenDms(view);
                        Ok(Json.toJson(true))
                    } else {
                        Ok(Json.toJson(false))
                    }
                }
            }
        }
    }

    def getConvo = Action { implicit request => 
        withSessionUsernameSync { username => 
            val view = model.getOpenDms()
            Ok(Json.toJson(List(username, view)))
        }
    }

    def viewDms = Action.async { implicit request => 
        withSessionUserid { userid => 
            val view = model.getOpenDms()
            model.getDms(userid, view).map { res =>
                Ok(Json.toJson(res))
            }
        }
    }

    def newMessage = Action.async { implicit request => 
        withSessionUserid { userid => 
            withJsonBody[String] { message => 
                model.newMessage(userid, message).map { success => 
                    Ok(Json.toJson(success))
                }
            }
        }
    }
}