
const ce = React.createElement

const csrfToken = document.getElementById("csrfToken").value;
const submitLogin = document.getElementById("submitLogin").value;
const newUser = document.getElementById("newUser").value;

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.relocate = props.relocate;
        this.login = (params) => {
            fetch(submitLogin, {
                method: "POST",
                headers: {'Content-Type': 'application/json', 'Csrf-Token': csrfToken},
                body: JSON.stringify(params)
            }).then(res => res.json()).then(data => {
                if (data) {
                    this.relocate("home");
                }
            })
        }
        this.newUser = (params) => {
            fetch(newUser, {
                method: "POST",
                headers: {'Content-Type': 'application/json', 'Csrf-Token': csrfToken},
                body: JSON.stringify(params)
            }).then(res => res.json()).then(data => {
                if (data) {
                    this.relocate("home");
                } else {
                    this.relocate("usernametaken")
                }
            })
        }
    }

    render() {
        return ce('div', null, 
            ce('h2', null, "Login: "),
            ce(LoginField, {submit: this.login}, null),
            ce('hr', null, null),
            ce('h2', null, "New User? Create an Account:"),
            ce(LoginField, {submit: this.newUser}, null),
        )
    }
}

class LoginField extends React.Component {
    constructor(props) {
        super(props)
        this.submit = props.submit
        this.state = {username: "", password: ""}
    }

    handleUsernameChange(e) {
        const val = e.target.value;
        this.setState((s) => {return {...s, username: val}});
    }
    handlePasswordChange(e) {
        const val = e.target.value;
        this.setState((s) => {return {...s, password: val}});
    }
    handleSubmit(e) {
        this.submit({...this.state});
    }

    render() {
        return ce('div', null, 
            ce('div', {className: 'labeled_field'}, 
                'Username: ',
                ce('input', {type: 'text', value: this.state.username, onChange: (e) => this.handleUsernameChange(e)}),
            ),
            ce('div', {className: 'labeled_field'}, 
                'Password: ',
                ce('input', {type: 'password', value: this.state.password, onChange: (e) => this.handlePasswordChange(e)}),
            ),
            ce('button', {onClick: (e) => this.handleSubmit(e)}, "Submit"),
        )
    }
}

export default LoginPage

//ReactDOM.render(
  //  React.createElement(LoginPage, {}, null),
    //document.getElementById('react-root')
//);