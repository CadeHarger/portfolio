const ce = React.createElement

const csrfToken = document.getElementById("csrfToken").value;
const newMessage = document.getElementById("newMessage").value;
const viewDms = document.getElementById("viewDms").value;
const getConvo = document.getElementById("getConvo").value;

class MessagesPage extends React.Component {
    constructor(props) {
        super(props)
        this.relocate = props.relocate;
        this.state = {username: "", reciever: "", messages: [], messageContent: ""};
        fetch(viewDms).then(res => res.json()).then(data => {
            console.log(data);
            this.setState((s) => {return {...s, messages: data}});
        })
        fetch(getConvo).then(res => res.json()).then(data => {
            this.setState((s) => {return {...s, username: data[0], reciever: data[1]}});
        })
    }

    handleMessageContentChange(e) {
        const val = e.target.value;
        this.setState((s) => {return {...s, messageContent: val}});
    }

    handleGoBack(e) {
        this.relocate("posts")
    }

    handleMessageSubmit() {
        fetch(newMessage, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Csrf-Token': csrfToken},
            body: JSON.stringify(this.state.messageContent)
        }).then(res => res.json()).then(data => {
            if (data === 1) {
                fetch(viewDms).then(res => res.json()).then(dataaa => {
                    console.log(dataaa)
                    this.setState((s) => {return {...s, messages: dataaa}})
                })
            }
        })
    }

    render() {
        return ce('div', null, 
            ce('h2', null, "Messages with ", ce("em", null, this.state.username), " and ", ce("em", null, this.state.reciever)),
            ce('hr', null, null),
            ce('ul', null, this.state.messages.map((item, index) => {
                return ce('li', {key: index}, "" + item[0] + ": " +  item[1])
            })),
            ce('hr', null, null),
            ce('div', {className: 'labeled_field'}, 
                'New Message: ',
                ce('input', {type: 'text', value: this.state.messageContent, onChange: (e) => this.handleMessageContentChange(e)}),
                ce('button', {onClick: (e) => this.handleMessageSubmit(e)}, "Submit"),
            ),
            ce('button', {onClick: (e) => this.handleGoBack(e)}, "Go Back"),
            
        )
    }
}


export default MessagesPage;