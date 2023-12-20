package actors

import akka.actor.Actor
import akka.actor.ActorRef

class LobbyManager extends Actor {
    private var members = List.empty[ActorRef]

    import actors.LobbyManager._
    def receive = {
        case NewMember(member) => 
            members ::= member
        case Move(dir) => for (c <- members) c ! LobbyActor.SendMove(dir)
        case m =>
            println("What did u do in LobbyManager" + m)
    }
}

object LobbyManager {
    case class NewMember(member: ActorRef)
    case class Move(dir: String)
}