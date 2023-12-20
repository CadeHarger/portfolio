package controllers

import actors.PaintActor
import akka.actor.Props
import actors.PaintManager
import javax.inject._
import akka.actor.Actor
import play.api.libs.streams.ActorFlow
import akka.actor.ActorSystem
import akka.stream.Materializer
import play.api.mvc._
import play.api.i18n._
import play.api.libs.json._
import models._

@Singleton
class Paint @Inject() (cc: ControllerComponents) (implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {
    val manager = system.actorOf(Props[PaintManager], "PaintManager")

    def load = Action { implicit request =>
        Ok(views.html.finaltaskholycow())
    }

    def socket = WebSocket.accept[String, String] { request =>
        println("Getting socket")
        ActorFlow.actorRef { out =>
            PaintActor.props(out, manager)
        }
    }
}