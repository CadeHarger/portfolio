package actors

import akka.actor.Actor
import akka.actor.Props
import akka.actor.ActorRef

class LobbyActor(out: ActorRef, manager: ActorRef) extends Actor {
    manager ! LobbyManager.NewMember(self)

    import LobbyActor._
    def receive = {
        case s: String => manager ! LobbyManager.Move(s)
        case SendMove(dir) => out ! dir
        case m => println("What did u do in LobbyActor" + m)
    }
}

object LobbyActor {
    def props(out: ActorRef, manager: ActorRef) = Props(new LobbyActor(out, manager))

    case class SendMove(dir: String)

}