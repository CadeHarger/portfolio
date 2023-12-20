const ce = React.createElement

const csrfToken = document.getElementById("csrfToken").value;
const getUser = document.getElementById("getUser").value;
const getPosts = document.getElementById("getPosts").value;
const logout = document.getElementById("logout").value;
const newPost = document.getElementById("newPost").value;
const openDms = document.getElementById("openDms").value;


class HomePage extends React.Component {
    constructor(props) {
        super(props)
        this.relocate = props.relocate;
        this.state = {username: "", posts: [], postContent: "", viewMessages: ""};
        fetch(getUser).then(res => res.json()).then(data => {
            console.log(data)
            this.setState((s) => {return {...s, username: data}})
        })
        fetch(getPosts).then(res => res.json()).then(data => {
            console.log(data)
            this.setState((s) => {return {...s, posts: data}})
        })
    }

    handlePostContentChange(e) {
        const val = e.target.value;
        this.setState((s) => {return {...s, postContent: val}});
    }

    handleViewMessagesChange(e) {
        const val = e.target.value;
        this.setState((s) => {return {...s, viewMessages: val}});
    }

    handleLogout(e) {
        fetch(logout).then(res => {
            if (res.ok) {
                this.relocate("login");
            }
        })
    }

    handlePostSubmit() {
        fetch(newPost, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Csrf-Token': csrfToken},
            body: JSON.stringify(this.state.postContent)
        }).then(res => {
            if (res.ok) {
                fetch(getPosts).then(res => res.json()).then(data => {
                    console.log(data)
                    this.setState((s) => {return {...s, posts: data, postContent: ""}})
                })
            }
        })
    }

    handleViewSubmit() {
        fetch(openDms, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Csrf-Token': csrfToken},
            body: JSON.stringify(this.state.viewMessages)
        }).then(res => res.json()).then(res => {
            if (res) {
                this.relocate("messages");
            } else {
                this.relocate("usernotfound");
            }
        })
    }

    render() {
        return ce('div', null, 
            ce('h2', null, ce("em", null, "Welcome, " + this.state.username)),
            ce('h4', null, "This website is a certified Cade Harger Creation©."),
            ce('hr', null, null),
            ce('h2', null, "Posts: "),
            ce('ul', null, this.state.posts.map((item, index) => {
                return ce('li', {key: index}, "" + item[0] + ": " +  item[1])
            })),
            ce('div', {className: 'labeled_field'}, 
                'New Post: ',
                ce('input', {type: 'text', value: this.state.postContent, onChange: (e) => this.handlePostContentChange(e)}),
                ce('button', {onClick: (e) => this.handlePostSubmit(e)}, "Submit"),
            ),
            ce('hr', null, null),
            ce('div', {className: 'labeled_field'},
                'View Messages With: ',
                ce('input', {type: 'text', value: this.state.viewMessages, onChange: (e) => this.handleViewMessagesChange(e)}),
                ce('button', {onClick: (e) => this.handleViewSubmit(e)}, "Submit"),
            ),
            ce('hr', null, null),
            ce('button', {onClick: (e) => this.handleLogout(e)}, "Logout"),
            
        )
    }
}


export default HomePage;