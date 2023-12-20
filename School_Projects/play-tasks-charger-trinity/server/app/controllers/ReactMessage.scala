package controllers

import javax.inject._

import shared.SharedMessages
import play.api.mvc._
import models._
import play.api.libs.json._

@Singleton
class Rapp @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

    implicit val userDataReads = Json.reads[UserData]

    def withJsonBody[A](f: A => Result)(implicit request: Request[AnyContent], reads: Reads[A]) = {
        request.body.asJson.map { body =>
            Json.fromJson[A](body) match {
                case JsSuccess(a, path) => f(a)
                case e @ JsError(_) => Redirect(routes.Rapp.load)
            }
        }.getOrElse(Redirect(routes.Rapp.load))
    }

    def withSessionUsername(f: String => Result)(implicit request: Request[AnyContent]) = {
        request.session.get("username").map(f).getOrElse(Ok(Json.toJson(Seq.empty[String])))
    }

    def load = Action { implicit request => 
        Ok(views.html.r_messageLogin())
    }

    def submitLogin = Action { implicit request =>
        withJsonBody[UserData] { args => 
            if (UserDataModel.validateLogin(args.username, args.password)) {
                Ok(Json.toJson(true)).withSession("username" -> args.username, "csrfToken" -> play.filters.csrf.CSRF.getToken.map(_.value).getOrElse(""))
            } else {
                Ok(Json.toJson(false))
            }   
        }
    }

    def newUser = Action { implicit request =>
        withJsonBody[UserData] { args => 
            if (UserDataModel.createLogin(args.username, args.password)) {
                Ok(Json.toJson(true)).withSession("username" -> args.username, "csrfToken" -> play.filters.csrf.CSRF.getToken.map(_.value).getOrElse(""))
            } else {
                Ok(Json.toJson(false))
            }   
        }
    }

    def getPosts = Action { implicit request =>
        Ok(Json.toJson(UserDataModel.getPosts()))
    }

    def getUser = Action { implicit request =>
        Ok(Json.toJson(UserDataModel.getActiveUser()))
    }

    def logout = Action { implicit request =>
        UserDataModel.logout()
        Ok(Json.toJson(true)).withSession(request.session - "username")
    }

    def newPost = Action { implicit request => 
        withSessionUsername { username => 
            withJsonBody[String] { message => 
                UserDataModel.newPost(message)
                Ok(Json.toJson(true))
            }
        }
    }

    def openDms = Action { implicit request =>
        withSessionUsername { username => 
            withJsonBody[String] { view =>
                if (UserDataModel.hasUser(view)) {
                    UserDataModel.setOpenDms(view);
                    Ok(Json.toJson(true))
                } else {
                    Ok(Json.toJson(false))
                }
            }
        }
    }

    def getConvo = Action { implicit request => 
        withSessionUsername { username => 
            val view = UserDataModel.getOpenDms()
            Ok(Json.toJson(List(username, view)))
        }
    }

    def viewDms = Action { implicit request => 
        withSessionUsername { username => 
            val view = UserDataModel.getOpenDms()
            Ok(Json.toJson(UserDataModel.getDms(username, view)))
        }
    }

    def newMessage = Action { implicit request => 
        withSessionUsername { username => 
            withJsonBody[String] { message => 
                UserDataModel.newMessage(message)
                Ok(Json.toJson(true))
            }
        }
    }
}