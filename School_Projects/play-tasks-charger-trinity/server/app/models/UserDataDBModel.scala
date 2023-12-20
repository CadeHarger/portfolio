package models

import collection.mutable
import slick.jdbc.PostgresProfile.api._
import scala.concurrent.ExecutionContext
import org.mindrot.jbcrypt.BCrypt
import scala.concurrent.Future

import models.Tables._

class UserDataDBModel(db: Database)(implicit ec: ExecutionContext) {

  private var openDms: String = ""

  def validateLogin(username: String, password: String): Future[Option[Int]] = {
    val matches = db.run(Users.filter(userRow => userRow.username === username).result)
    matches.map(userRows => userRows.headOption.flatMap {
        userRow => if (BCrypt.checkpw(password, userRow.password)) Some(userRow.id) else None
    })
  }

  def createLogin(username: String, password: String): Future[Option[Int]] = {
    val matches = db.run(Users.filter(userRow => userRow.username === username).result)
    matches.flatMap { userRows =>
        if (userRows.isEmpty) {
            db.run(Users += UsersRow(-1, username, BCrypt.hashpw(password, BCrypt.gensalt())))
                .flatMap { addCount => 
                    if (addCount > 0) db.run(Users.filter(userRow => userRow.username === username).result)
                        .map(_.headOption.map(_.id))
                    else Future.successful(None)
                }
        } else Future.successful(None)
    }
  }

  // Getters ----------------------------------------------------------------------------------------------------------------

  def getOpenDms(): String = {
    return openDms
  }

  def getPosts(): Future[Seq[(String, String)]] = {
    db.run(
      (for {
        (u, i) <- Users join Items on (_.id === _.userId)
      } yield {
        (u.username, i.text)
      }).result
    ) 
  }

  // returns [(sender (either userid or receiver), message)]
  def getDms(userid: Int, receiver: String): Future[Option[List[(String, String)]]] = {
    val matches = db.run(Users.filter(userRow => userRow.username === receiver).result)
    matches.flatMap { userRows =>
      userRows.headOption.map { receiverRow =>
        val query = for {
          ((msg, sender), rec) <- Directmessages
          .join(Users).on(_.senderId === _.id)
          .join(Users).on(_._1.receiverId === _.id)
          .filter { case ((msg, sender), rec) =>
            (msg.senderId === userid && rec.username === receiver) || (msg.senderId === receiverRow.id && msg.receiverId === userid)
          }
        } yield (sender.username, msg.text)

        db.run(query.result).map(msgs => Some(msgs.toList))
      }.getOrElse(Future.successful(None))
    }
  }
  
  /*
  def sortDms(from: List[(String, Int)], too: List[(String, Int)]): List[(String, Int)] = {
    //val from:List[(String, Int)] = dms.get((user, receiver)).getOrElse(List.empty)
    //val too :List[(String, Int)] = dms.get((receiver, user)).getOrElse(List.empty)
    var res: List[(String, String)] = List.empty
    var f = 0
    var t = 0
    if (from.length == f && too.length == t) {
      return res
    }
    for (_ <- 0 to from.length + too.length - 1) {
      if (from.length == f) {
        for (i <- t to too.length - 1) {
          res = res :+ (receiver, too(i)._1)
        }
        return res
      } else if (too.length == t) {
        for (i <- f to from.length - 1) {
          res = res :+ (user, from(i)._1)
        }
        return res
      } else {
        if (from(f)._2 < too(t)._2) {
          res = res :+ (user, from(f)._1)
          f += 1
        } else {
          res = res :+ (receiver, too(t)._1)
          t += 1
        }
      }
    }
    return res
  }*/

  def hasUser(view: String): Future[Boolean] = {
    return db.run(Users.filter(userRow => userRow.username === view).result).map(_.nonEmpty)
  }

  def getUsers(): Future[Seq[String]] = {
    return db.run(Users.map(userRow => userRow.username).result)
  }

  // Setters ----------------------------------------------------------------------------------------------------------------

  def newPost(userid: Int, content: String): Future[Int] = {
    db.run(Items += ItemsRow(-1, userid, content))
  }

  def setOpenDms(view: String): Unit = {
    openDms = view
  }

  //(sender, receiver) -> [(message, timestamp)]
  def newMessage(userid: Int, content: String): Future[Int] = {
    db.run(Users.filter(userRow => userRow.username === openDms).result.headOption).flatMap { receiverRow =>
      val receiver = receiverRow.getOrElse(UsersRow(-1, "NOT FOUND", "NOT FOUND"))
      db.run(Directmessages += DirectmessagesRow(-1, userid, receiver.id, System.currentTimeMillis().toInt.toString, content))
    }
  }
}
 