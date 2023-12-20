import org.scalatestplus.play._
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import org.scalatestplus.play.OneBrowserPerSuite
import org.scalatestplus.play.HtmlUnitFactory

class ControllerSpec extends PlaySpec with GuiceOneServerPerSuite with OneBrowserPerSuite with HtmlUnitFactory {
    "Login page" must {
        "login and gain access" in {
            go to s"http://localhost:$port/getform"
            pageTitle mustBe "Login"
            find(cssSelector("h2")).isEmpty mustBe false
            find(cssSelector("h2")).toList.map(_.text) must contain ("Login:")//.forEach(e => e.text mustBe "Login:")
            click on "user-login"
            textField("user-login").value = "mlewis"
            click on "pass-login"
            pwdField(id("pass-login")).value = "prof"
            submit()
            eventually {
                pageTitle mustBe "Logged In"
                find(cssSelector("h2")).isEmpty mustBe false
                findAll(cssSelector("h2")).toList.map(_.text) must contain ("Posts:")
                findAll(cssSelector("li")).toList.map(_.text) must contain ("web : FREE BITCOIN CLICK HERE ->>>>")
            }
        }

        "send a new post" in {
            click on "new-post"
            textField("new-post").value = "money"
            submit()
            eventually {
                findAll(cssSelector("li")).toList.map(_.text) must contain ("mlewis : money")
            }
        }

        "view default messages" in {
            click on "view-messages"
            textField("view-messages").value = "web"
            submit()
            eventually {
                pageTitle mustBe "Messages"
                findAll(cssSelector("li")).toList.map(_.text) must contain ("mlewis : Just checked your task 47. You're failing lol")
            }
        }

        "send new message" in {
            click on "new-message"
            textField("new-message").value = "testing123"
            submit()
            eventually {
                findAll(cssSelector("li")).toList.map(_.text) must contain ("mlewis : testing123")
            }
        }

        "reject view messages of non-existent user" in {
            click on "go-back"
            eventually {
                pageTitle mustBe "Logged In"
                click on "view-messages"
                textField("view-messages").value = "golum"
                submit()
                eventually {
                    pageTitle mustBe "Not found"
                }
            }
        }

        "logout" in {
            click on "go-back"
            eventually {
                pageTitle mustBe "Logged In"
                click on "logout"
                eventually {
                    pageTitle mustBe "Login"
                }
            }
        }

        "view new posts with different user" in {
            click on "user-login"
            textField("user-login").value = "web"
            click on "pass-login"
            pwdField(id("pass-login")).value = "apps"
            submit()
            eventually {
                pageTitle mustBe "Logged In"
                find(cssSelector("h2")).isEmpty mustBe false
                findAll(cssSelector("h2")).toList.map(_.text) must contain ("Posts:")
                findAll(cssSelector("li")).toList.map(_.text) must contain ("mlewis : money")
            }
        }

        "view new messages with different user" in {
            click on "view-messages"
            textField("view-messages").value = "mlewis"
            submit()
            eventually {
                pageTitle mustBe "Messages"
                findAll(cssSelector("li")).toList.map(_.text) must contain ("mlewis : testing123")
            }
        }

        "logout 2" in {
            click on "go-back"
            eventually {
                pageTitle mustBe "Logged In"
                click on "logout"
                eventually {
                    pageTitle mustBe "Login"
                }
            }
        }

        "fail on creating existing user (with pass)" in {
            click on "user-create"
            textField("user-create").value = "mlewis"
            click on "pass-create"
            pwdField(id("pass-create")).value = "prof"
            submit()
            eventually {
                pageTitle mustBe "Already exists"
                click on "go-back"
                eventually {
                    pageTitle mustBe "Login"
                }
            }
        }

        "fail on creating existing user (w/o pass)" in {
            click on "user-create"
            textField("user-create").value = "mlewis"
            click on "pass-create"
            pwdField(id("pass-create")).value = "kdjflkadfjf"
            submit()
            eventually {
                pageTitle mustBe "Already exists"
                click on "go-back"
                eventually {
                    pageTitle mustBe "Login"
                }
            }
        }

        "create new user and view posts" in {
            click on "user-create"
            textField("user-create").value = "chad"
            click on "pass-create"
            pwdField(id("pass-create")).value = "giga"
            submit()
            eventually {
                pageTitle mustBe "Logged In"
            }
        }
    }
}