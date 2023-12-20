package playscala

import org.scalajs.dom
import org.scalajs.dom.document
import scalajs.js
import org.scalajs.dom.html
import org.scalajs.dom.raw.MouseEvent
import scala.scalajs.js.annotation.JSExportTopLevel
import scala.scalajs.js.JSON
import play.api.libs.json._
import scala.scalajs.js.Dynamic.{literal => json}
import org.scalajs.dom.ext.Ajax
import scala.scalajs.concurrent.JSExecutionContext.Implicits.queue
import scala.util.Random

object Task11 { 
    val width = 1000;
    val height = 700;
    val canvas = dom.document.getElementById("hi").asInstanceOf[html.Canvas]
    val ctx = canvas.getContext("2d").asInstanceOf[dom.CanvasRenderingContext2D]
    val webSocket = new dom.WebSocket("ws" + dom.document.getElementById("ws-route").asInstanceOf[html.Input].value.drop(4))
    val colors = List("black", "red", "orange", "yellow", "green", "blue", "purple", "rainbow")
    var userColor = "black"

    def main(args: Array[String]): Unit = {
        canvas.width = width
        canvas.height = height
        canvas.style.border = "1px solid black"
        ctx.lineWidth = 5

        var clicking = false
        var drawingData = List.empty[(Int, Int)]
        
        webSocket.onopen = (_: dom.Event) => {
            println("Connected")
            sendDrawing(drawingData)    
        }
        webSocket.onmessage = {e: dom.MessageEvent =>
            render(e.data.toString)    
        }
        canvas.onmouseup = (e: MouseEvent) => {
            if (clicking) {
                clicking = false
                sendDrawing(drawingData)
                drawingData = List.empty[(Int, Int)]
            }
        }
        canvas.onmousedown = (e: MouseEvent) => {
            clicking = true
            drawingData :+= ((e.clientX - canvas.offsetLeft).toInt, (e.clientY - canvas.offsetTop).toInt)
            ctx.beginPath()
            ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
        }
        canvas.onmousemove = (e: MouseEvent) => {
            if (clicking) {
                ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
                ctx.stroke()
                drawingData :+= ((e.clientX - canvas.offsetLeft).toInt, (e.clientY - canvas.offsetTop).toInt)
            }
        }
        webSocket.onerror = (err: dom.Event) => {
            println("ERROR [WebSocket]: " + err.asInstanceOf[dom.ErrorEvent].message)    
        }
        for (color <- colors) {
            val c = dom.document.getElementById(color).asInstanceOf[html.Div]
            c.onclick = (e: MouseEvent) => {
                userColor = color
                dom.window.scrollTo(0,0)
            }
        }
    }

    def sendDrawing(data: List[(Int, Int)]): Unit = {
        val withColors = data.map {
            case (x, y) => {
                if (userColor == "rainbow") (colors(Random.nextInt(colors.length)), x, y)
                else (userColor, x, y)
            }
        }
        webSocket.send(Json.toJson(withColors).toString())
    }

    def render(endpts: String): Unit = {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (line <- Json.parse(endpts).as[List[List[(String, Int, Int)]]]) { // Not a set bc dupes have already been removed here
            ctx.beginPath()
            line match {
                case (start :: finish) =>
                    ctx.moveTo(start._2, start._3)
                    for (node <- finish) {
                        ctx.strokeStyle = node._1
                        ctx.lineTo(node._2, node._3)
                    }
                    ctx.stroke()
                case _ =>
            }
        }
    }
}