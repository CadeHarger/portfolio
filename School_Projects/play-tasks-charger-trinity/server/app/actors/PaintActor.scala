package actors

import akka.actor.Actor
import akka.actor.Props
import akka.actor.ActorRef
import play.api.libs.json._

class PaintActor(out: ActorRef, manager: ActorRef) extends Actor {
    manager ! PaintManager.NewMember(self)
    
    import PaintActor._

    var drawingData: Set[List[(String, Int, Int)]] = Set.empty

    def receive: Receive = {
        case Line(color, x, y) => println("Works")
        case jsonData: String => 
            val receivedData = Json.parse(jsonData).as[List[(String, Int, Int)]]
            drawingData = drawingData + (receivedData)
            manager ! PaintManager.DrawingData(drawingData.toList)
        case rawData: Set[Seq[(String, Int, Int)]] => 
            val jsonData = Json.toJson(rawData).toString()
            out ! jsonData
        case m => println("ERROR: " + m.toString)
    }
}

object PaintActor {
    def props(out: ActorRef, manager: ActorRef) = Props(new PaintActor(out, manager))

    case class Line(color: String, x: Int, y: Int)
}