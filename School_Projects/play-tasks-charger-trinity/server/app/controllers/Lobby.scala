package controllers

import javax.inject._

import shared.SharedMessages
import play.api.mvc._
import models._
import play.api.i18n._
import play.api.libs.json._
import akka.actor.Actor
import akka.actor.ActorSystem
import play.api.libs.streams.ActorFlow
import akka.stream.Materializer
import actors.LobbyActor
import akka.actor.Props
import actors.LobbyManager


@Singleton
class Lobby @Inject()(cc: ControllerComponents)(implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {
    val manager = system.actorOf(Props[LobbyManager], "Manager")

    def index = Action { implicit request => 
        Ok(views.html.lobby())
    }

    def socket = WebSocket.accept[String, String] { request =>
        println("Getting socket")
        ActorFlow.actorRef { out =>
            LobbyActor.props(out, manager)
        }
    }
}