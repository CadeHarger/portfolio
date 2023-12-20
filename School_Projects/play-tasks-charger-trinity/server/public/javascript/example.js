const ce = React.createElement

class Hello extends React.Component {
    constructor(props) {
        super(props)
        this.state = {viewing: false}
    }

    render() {
        console.log('rerendered')
        if (this.state.viewing) {
            return ce(ViewComponent)
        } else {
            return ce(NormalComponent, {handleClick: () => {this.setState({...this.state, viewing: true}); console.log("clicked")}}, `Hello ${this.props.toWhat}`);
        }
        
    }
}

class ViewComponent extends React.Component {
    render() {
        return ce('div', null, 'Newer page')
    }
}

class NormalComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {handleClick: props.handleClick}
    }
    render() {
        return ce('div', {onClick: this.state.handleClick}, 'New page')
    }
}
  
ReactDOM.render(
    React.createElement(Hello, {}, null),
    document.getElementById('react-root')
);