const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {listEntries: []};
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/listEntries'}).done(response => {
            this.setState({listEntries: response.entity._embedded.listEntries});
    });
    }

    render() {
        return (
            <EntryList listEntries={this.state.listEntries}/>
    )
    }
}

class EntryList extends React.Component{
    render() {
        const listEntries = this.props.listEntries.map(listEntry =>
            <ListEntry key={listEntry._links.self.href} listEntry={listEntry}/>
        );
        return (
            <table>
                <tbody>
                <tr>
                    <th>What to do</th>
                    <th>is fulfilled</th>
                </tr>
                {listEntries}
                </tbody>
            </table>
        )
    }
}

class ListEntry extends React.Component{
    render() {
        console.log(this.props.listEntry.fulfilled);
        return (
            <tr>
                <td>{this.props.listEntry.listItem}</td>
                <td>{this.props.listEntry.fulfilled.toString()}</td>
            </tr>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
);
