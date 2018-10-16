'use strict'

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow');
const root = '/api';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {listEntries: []};
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
    }

    loadFromServer(pageSize) {
        follow(client, root, [
            {rel: 'listEntries', params: {size: pageSize}}
        ]).then(listEntries => {
            return client({
                method: 'GET',
                path: listEntries.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return listEntries;
            });
        }).done(listEntries => {
            this.setState({
                listEntries: listEntries.entity._embedded.listEntries,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: listEntries.entity._links});
        })
    }

    render() {
        return (
            <EntryList listEntries={this.state.listEntries}/>
        )
    }
}

class EntryList extends React.Component {
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

class ListEntry extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.listEntry.listItem}</td>
                <td>{this.props.listEntry.fulfilled.toString()}</td>
            </tr>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('react')
);
