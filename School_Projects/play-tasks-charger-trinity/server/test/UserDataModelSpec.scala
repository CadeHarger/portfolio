import org.scalatestplus.play._
import models._

class UserDataModelSpec extends PlaySpec {
    "UserDataModel" should {
        // validateLogin
        "do valid login for default user" in {
            UserDataModel.validateLogin("mlewis", "prof") mustBe true
        }
        "do invalid login for default user (1/2)" in {
            UserDataModel.validateLogin("mlewis", "apps") mustBe false
        }
        "do invalid login for default user (2/2)" in {
            UserDataModel.validateLogin("kasdlfjasdlk", "not a real user") mustBe false
        }
        // createLogin
        "create valid login" in {
            UserDataModel.createLogin("cade", "harger") mustBe true
        }
        "create invalid login" in {
            UserDataModel.createLogin("mlewis", "teacher") mustBe false
        }
        // logout and getActiveUser
        "logout makes no Active User" in {
            UserDataModel.logout()
            UserDataModel.getActiveUser() mustBe ""
            UserDataModel.validateLogin("mlewis", "prof")
            UserDataModel.getActiveUser() mustBe "mlewis"
        }
        // getOpenDms and setOpenDms()
        "open and close dms" in {
            UserDataModel.getOpenDms() mustBe ""
            UserDataModel.setOpenDms("web")
            UserDataModel.getOpenDms() mustBe "web"
            UserDataModel.setOpenDms("")
        }
        // getPosts and newPost
        "default posts" in {
            UserDataModel.getPosts() mustBe List(("web", "FREE BITCOIN CLICK HERE ->>>>"))
        }
        "new post" in {
            UserDataModel.newPost("hello")
            UserDataModel.getPosts() mustBe List(("web", "FREE BITCOIN CLICK HERE ->>>>"), ("mlewis", "hello"))
        }
        // getDms and newMessage
        "default dms" in {
            UserDataModel.getDms("mlewis", "web") mustBe List(("mlewis", "Just checked your task 47. You're failing lol"))
        }
        "new dm" in {
            UserDataModel.setOpenDms("web")
            UserDataModel.newMessage("hiya") 
            UserDataModel.getDms("mlewis", "web")(1)._2 mustBe "hiya"
        }
        // hasUser and getUsers
        "does have existing user" in {
            UserDataModel.hasUser("mlewis") mustBe true
        }
        "doesn't have fake user" in {
            UserDataModel.hasUser("jeffbezos") mustBe false
        }
        "get users" in {
            UserDataModel.getUsers() must contain ("mlewis")
            UserDataModel.getUsers() must contain ("web")
            UserDataModel.getUsers() must contain ("cade")
            UserDataModel.getUsers().length mustBe 3
        }
    }
}