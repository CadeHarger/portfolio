package actors

import akka.actor.Actor
import akka.actor.ActorRef

class PaintManager extends Actor {
    private var members = List.empty[ActorRef]

    private var lines: Set[List[(String, Int, Int)]] = Set.empty;

    import actors.PaintManager._
    def receive = {
        case NewMember(member) => members ::= member
        case DrawingData(data) =>
            for (line <- data) {
                lines += line
            }
            members.foreach(_ ! lines)
        case m => println("ERROR: " + m.toString)
    }
}

object PaintManager {
    case class NewMember(member: ActorRef)
    case class DrawingData(data: List[List[(String, Int, Int)]])
}