package controllers

import javax.inject._

import shared.SharedMessages
import play.api.mvc._
import models._

@Singleton
class Application @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def index = Action {
    Ok(views.html.index(SharedMessages.itWorks))
  }

  def getForm = Action {
    Ok(views.html.form())
  }

  def handleLogin = Action { request => 
    val postVals = request.body.asFormUrlEncoded
    postVals.map { args => 
      val username = args("username").head
      val password = args("password").head
      if (UserDataModel.validateLogin(username, password)) {
        Redirect(routes.Application.goHome)
      } else {
        Redirect(routes.Application.getForm);
      }   
    }.getOrElse(Ok("Something is very wrong."))
  }

  def createLogin = Action { request => 
    val postVals = request.body.asFormUrlEncoded
    postVals.map { args => 
      val username = args("username").head
      val password = args("password").head
      if (UserDataModel.createLogin(username, password)) {
        Redirect(routes.Application.goHome)
      } else {
        Ok(views.html.userAlreadyExists(username))
      }
    }.getOrElse(Ok("Something is very wrong."))
  }

  def newPost(content: String) = Action {
    UserDataModel.newPost(content)
    Redirect(routes.Application.goHome)
  }

  def logout = Action {
    UserDataModel.logout()
    Redirect(routes.Application.getForm)
  }

  def goHome = Action {
    UserDataModel.setOpenDms("")
    Ok(views.html.logged(UserDataModel.getActiveUser(), UserDataModel.getPosts()))
  }

  def viewMessages(view: String) = Action {
    if (UserDataModel.hasUser(view)) {
      UserDataModel.setOpenDms(view)
      Ok(views.html.messages(UserDataModel.getActiveUser(), view, UserDataModel.getDms(UserDataModel.getActiveUser(), view)))
    } else {
      Ok(views.html.userNotFound(view))
    }
  }

  def newMessage = Action { request => 
    val postVals = request.body.asFormUrlEncoded
    postVals.map { args => 
      val content = args("content").head
      UserDataModel.newMessage(content)
      Redirect(routes.Application.viewMessages(UserDataModel.getOpenDms()))
    }.getOrElse(Ok("Something is very wrong."))
  }
}
