
const ce = React.createElement

class ErrorPage extends React.Component {
    constructor(props) {
        super(props)
        this.backTo = props.backTo
        this.message = props.message
        this.relocate = props.relocate;
    }

    render() {
        return ce('div', null, 
            ce('h2', null, this.message),
            ce('button', {onClick: (e) => this.relocate(this.backTo)}, "Go back"),
        )
    }
}

export default ErrorPage