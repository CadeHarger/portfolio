package example

import org.scalajs.dom
import org.scalajs.dom.document
import scalajs.js
import scala.scalajs.js.annotation.JSExportTopLevel
import org.scalajs.dom.html
import scala.scalajs.js.timers.SetIntervalHandle
import org.scalajs.dom.window

//import slinky.web.ReactDOM
//import slinky.web.html._

import scala.util.Random

class Mop(var id: Int, var move: Int, var x: Int, var y: Int) {
//
}

object DodgeMop extends IDK with App {
  var direction = 0
  var x = 0
  var y = 0
  var score = 0
  var width = 0
  var height = 0
  var size = 120
  var speed = 120
  var mopSpeed = 5
  var mops: List[Mop] = List.empty
  var idCtr = 0
  var initialRate = 1500
  var didLoad = false
  val random = new Random()

  def getDir(key: String): Int = {
    key match {
      case "ArrowUp" => 1
      case "ArrowDown" => 2
      case "ArrowLeft" => 3
      case "ArrowRight" => 4
      case "w" => 1
      case "s" => 2
      case "a" => 3
      case "d" => 4
      case _ => 0
    }
  }

  def handleRender(c: dom.CanvasRenderingContext2D, bucketImg: html.Image, mop: html.Image): Unit = {
    c.clearRect(0, 0, width, height)
    c.drawImage(bucketImg, x, y, size, size)
    for (m <- mops) {
      c.drawImage(mop, m.x, m.y, size, size)
    }
  }

  def spawnMop(): Unit = {
    var side = random.nextInt(4) // Assign random side
    if (side < 1) {
      mops = mops :+ new Mop(idCtr, 1, random.nextInt(width), height)
    } else if (side < 2) {
      mops = mops :+ new Mop(idCtr, 2, random.nextInt(width), 0)
    } else if (side < 3) {
      mops = mops :+ new Mop(idCtr, 3, width, random.nextInt(height))
    } else {
      mops = mops :+ new Mop(idCtr, 4, 0, random.nextInt(height))
    }
    idCtr += 1
    dom.window.setTimeout(() => spawnMop(), initialRate - score)
    //setTimeout(spawnMop, initialRate - score)
  }

  def moveMops(c: dom.CanvasRenderingContext2D, mop: html.Image, bucketImg: html.Image): Unit = {
    for (m <- mops) {
        var overlapX = (m.x > x && m.x < x + size) || (m.x + size > x && m.x + size < x + size)
        var overlapY = (m.y > y && m.y < y + size) || (m.y + size > y && m.y + size < y + size)
        if (overlapX && overlapY) {
            dom.window.location.reload()
        }
    }
    var toRm: List[Int] = List.empty
    for (m <- mops) {
        if (m.move == 1) {
            if (m.y < -1 * size) {
                toRm = toRm :+ m.id
            } else {
                m.y -= mopSpeed
            }
        } else if (m.move == 2) {
            if (m.y > height) {
                toRm = toRm :+ m.id
            } else {
                m.y += mopSpeed
            }
        } else if (m.move == 3) {
            if (m.x < 0) {
                toRm = toRm :+ m.id
            } else {
                m.x -= mopSpeed
            }
        } else {
            if (m.x > width) {
                toRm = toRm :+ m.id
            } else {
                m.x += mopSpeed
            }
        } 
    }
    mops = mops.filter((m) => !toRm.contains(m.id))
    handleRender(c, bucketImg, mop)
    dom.window.setTimeout(() => moveMops(c, mop, bucketImg), 20)
  }

  def movePlayer(direction: Int): Unit = {
    if (direction == 1 && y > 0) {
        y -= speed
    } else if (direction == 2 && y < height - size) {
        y += speed
    } else if (direction == 3 && x > 0) {
        x -= speed
    } else if (direction == 4 && x < width - size) {
        x += speed
    } 
  }

  def adjustScore(scoreDiv: html.Div): Unit = {
    scoreDiv.innerHTML = score.toString // flooring issues?
    score += ((initialRate - score) / initialRate) + 1
    dom.window.setTimeout(() => adjustScore(scoreDiv), 100)
  }

  def forceRender(): Unit = {
    if (!didLoad) {
      dom.window.location.reload()
    } 
  }

  document.addEventListener("DOMContentLoaded", (ev: dom.Event) => {
    var canvas = document.getElementById("hi").asInstanceOf[html.Canvas]
    var c = canvas.getContext("2d").asInstanceOf[dom.CanvasRenderingContext2D]
    var mop = document.getElementById("mop").asInstanceOf[html.Image]
    var bucketImg = document.getElementById("bucket").asInstanceOf[html.Image]
    var scoreDiv = document.getElementById("score").asInstanceOf[html.Div]
    if (bucketImg.complete) {
        didLoad = true
        canvas.width = size * 9
        canvas.height = 700
        width = canvas.width
        height = canvas.height
        handleRender(c, bucketImg, mop)
        document.addEventListener("keydown", (e: dom.KeyboardEvent) => {
            direction = getDir(e.key)
            movePlayer(direction)
            handleRender(c, bucketImg, mop)
        })
        spawnMop()
        adjustScore(scoreDiv)
        moveMops(c, mop, bucketImg)
        //var scoreInterval: SetIntervalHandle = js.timers.setInterval(100)(() => adjustScore(scoreDiv))
        //dom.window.setTimeout(() => moveMops(c, mop, bucketImg), 100)
        //var moveInterval: SetIntervalHandle = js.timers.setInterval(5)(() => moveMops(c, mop, bucketImg))
    } else {
        bucketImg.onload = (e: dom.Event) => {
        didLoad = true
        canvas.width = size * 9
        canvas.height = 700
        width = canvas.width
        height = canvas.height
        handleRender(c, bucketImg, mop)
        document.addEventListener("keydown", (e: dom.KeyboardEvent) => {
            direction = getDir(e.key)
            movePlayer(direction)
            handleRender(c, bucketImg, mop)
        })
        spawnMop()
        adjustScore(scoreDiv)
        moveMops(c, mop, bucketImg)
        //val scoreInterval = js.timers.setInterval(100)(() => adjustScore(scoreDiv))
        
        //val moveInterval = js.timers.setInterval(5)(() => moveMops(c, mop, bucketImg))
      }
    }
  })
}

trait IDK {
  lazy val what: String = "Not sure why I need this lol"
}
