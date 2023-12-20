import LoginPage from "./messageLogin.js";
import HomePage from "./messageHome.js";
import MessagesPage from "./messageDms.js";
import ErrorPage from "./messageError.js";

const ce = React.createElement

class MessageRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loc: "login"}
    }

    relocate = (loc) => {
        console.log(loc)
        this.setState({loc})
    }

    render() {
        console.log('rerendered')
        if (this.state.loc === "login") {
            return ce(LoginPage, {relocate: this.relocate}, null)
        } else if (this.state.loc === "messages") {
            return ce(MessagesPage, {relocate: this.relocate}, null)
        } else if (this.state.loc === "usernotfound") {
            return ce(ErrorPage, {relocate: this.relocate, backTo: "posts", message: "User not found."}, null)
        } else if (this.state.loc === "usernametaken") {
            return ce(ErrorPage, {relocate: this.relocate, backTo: "login", message: "Username already taken."}, null)
        } else {
            return ce(HomePage, {relocate: this.relocate}, null)
        }
        
    }
}

ReactDOM.render(
    React.createElement(MessageRoot, {}, null),
    document.getElementById('react-root')
);