package models

import collection.mutable

object UserDataModel {

// username -> password
  def initialUsers():mutable.Map[String, String] = {
    val defs = mutable.Map("web" -> "apps")
    defs += ("mlewis" -> "prof")
    return defs
  }

// (sender, reciever) -> [(message, timestamp)]
  def initialDms():mutable.Map[(String, String), List[(String, Int)]] = {
    return mutable.Map(("mlewis", "web") -> List(("Just checked your task 47. You're failing lol", 0)))
  }
  
// [(sender, message)]
  def initialPosts():List[(String, String)] = {
    return List(("web", "FREE BITCOIN CLICK HERE ->>>>"))
  }
  
  // username -> password
  private var users = initialUsers()

  //(sender, reciever) -> [(message, timestamp)]
  private var dms = initialDms()

  // [(sender, message)]
  private var posts:List[(String, String)] = initialPosts()

  private var currentUser: String = ""

  private var openDms: String = ""

  def validateLogin(username: String, password: String): Boolean = {
    val logged = users.get(username).map(_ == password).getOrElse(false)
    if (logged) {
      currentUser = username
    }
    return logged
  }

  def createLogin(username: String, password: String):Boolean = {
    if (!this.hasUser(username)) {
      users(username) = password
      currentUser = username
      return true
    }
    return false
  }

  // Getters ----------------------------------------------------------------------------------------------------------------

  def getActiveUser():String = {
    return currentUser
  }

  def getOpenDms():String = {
    return openDms
  }

  def getPosts():List[(String, String)] = {
    return posts
  }

// [(sender, message)]
  def getDms(user: String, reciever: String):List[(String, String)] = {
    val from:List[(String, Int)] = dms.get((user, reciever)).getOrElse(List.empty)
    val too :List[(String, Int)] = dms.get((reciever, user)).getOrElse(List.empty)
    var res: List[(String, String)] = List.empty
    var f = 0
    var t = 0
    if (from.length == f && too.length == t) {
      return res
    }
    for (_ <- 0 to from.length + too.length - 1) {
      if (from.length == f) {
        for (i <- t to too.length - 1) {
          res = res :+ (reciever, too(i)._1)
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
          res = res :+ (reciever, too(t)._1)
          t += 1
        }
      }
    }
    return res
  }

  def hasUser(view: String):Boolean = {
    return users.keys.toList.contains(view)
  }

  def getUsers():List[String] = {
    return users.keys.toList
  }

  // Setters ----------------------------------------------------------------------------------------------------------------

  def newPost(content: String):Unit = {
    posts = posts :+ (currentUser, content)
  }

  def logout():Unit = {
    currentUser = ""
    openDms = ""
  }

  def setOpenDms(view: String):Unit = {
    openDms = view
  }

  //(sender, reciever) -> [(message, timestamp)]
  def newMessage(content: String):Unit = {
    val time: Int = System.currentTimeMillis().toInt
    dms((currentUser, openDms)) = dms.getOrElse((currentUser, openDms), List.empty[(String, Int)]) :+ (content, time)
  }
}
 