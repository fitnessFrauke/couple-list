const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {listEntry: []};
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/listEntries'}).done(response => {
            this.setState({listEntry: response.entity._embedded.listEntry});
    });
    }

    render() {
        return (
            <ListEntries listEntry={this.state.listEntry}/>
    )
    }
}

class ListEntries extends React.Component{
    render() {
        console.log(this.props);
        const listEntry = this.props.listEntry.map(listEntry =>
            <listEntry key={listEntry._links.self.href} employee={listEntry}/>
        );
        return (
            <table>
                <tbody>
                <tr>
                    <th>What to do</th>
                    <th>is fulfilled</th>
                </tr>
                {listEntry}
                </tbody>
            </table>
        )
    }
}

class ListEntry extends React.Component{
    render() {
        return (
            <tr>
                <td>{this.props.listEntry.listItem}</td>
                <td>{this.props.listEntry.isFulfilled}</td>
            </tr>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
);
