'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow');
const root = '/api';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {listEntries: [], attributes: [], pageSize: 5, links: {}};
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        // this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
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
                links: listEntries.entity._links
            });
        })
    }

    onCreate(newListEntry) {
        follow(client, root, ['listEntry']).then(listEntries => {
            return client({
                method: 'POST',
                path: listEntries.entity._links.self.href,
                entity: newListEntry,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(response => {
            return follow(client, root, [
                {rel: 'listEntry', params: {'size': this.state.pageSize}}
            ]);
        }).done(response => {
            if (typeof response.entity._links.last !== "undefined") {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        })
    }

    onNavigate(navUri) {
        client({method: 'GET', path: navUri}).done(listEntries => {
            this.setState({
                listEntries: listEntries.entity._embedded.listEntries,
                attributes: this.state.attributes,
                pageSize: this.state.pageSize,
                links: listEntries.entity._links
            })
        })
    }

    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize);
        }
    }

    render() {
        return (
            <div>
                <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
                <EntryList listEntries={this.state.listEntries}
                           links={this.state.links}
                           pageSize={this.state.pageSize}
                           onNavigate={this.onNavigate}
                           updatePageSize={this.updatePageSize}/>
            </div>
        )
    }
}

class EntryList extends React.Component {

    constructor(props){
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        e.preventDefault();
        const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        if (/^[0-9]+$/.test(pageSize)) {
            this.props.updatePageSize(pageSize);
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value =
                pageSize.substring(0, pageSize.length - 1);
        }
    }

    onDelete(listEntry) {
        client({method: 'DELETE', path: listEntry._links.self.href}).done(response => {
            this.loadFromServer(this.state.pageSize);
        })
    }

    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }

    render() {
        const listEntries = this.props.listEntries.map(listEntry =>
            <ListEntry key={listEntry._links.self.href} listEntry={listEntry} onDelete={this.props.onDelete}/>
        );
        const navLinks = [];
        //  console.log(this.props);
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
        }
        return (
            <div>
                <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
                <table>
                    <tbody>
                    <tr>
                        <th>What to do</th>
                        <th>is fulfilled</th>
                    </tr>
                    {listEntries}
                    </tbody>
                </table>
                <div>
                    {navLinks}
                </div>
            </div>
        )
    }
}

class ListEntry extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.listEntry)
    }

    render() {
        return (
            <tr>
                <td>{this.props.listEntry.listItem}</td>
                <td>{this.props.listEntry.fulfilled.toString()}</td>
                <td>
                    <button onClick={this.handleDelete}>Delete</button>
                </td>
            </tr>
        )
    }
}

class CreateDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const newListEntry = {};
        this.props.attributes.forEach(attribute => {
            newListEntry[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onCreate(newListEntry);

        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = ''
        });

        window.location = "#";
    }

    onCreate(newListEntry) {
        follow(client, root, ['listEntry']).then(listEntries => {
            return client({
                method: 'POST',
                path: listEntries.entity._links.self.href,
                entity: newListEntry,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(response => {
            return follow(client, root, [
                {rel: 'listEntries', params: {'size': this.state.pageSize}}
            ]);
        }).done(response => {
            if (typeof response.entity._links.last !== "undefined") {
                this.onNavigation(response.entity._links.last.href);
            } else {
                this.onNavigation(response.entity._links.self.href);
            }
        })
    }

    onNavigation(navUri) {
        client({method: 'GET', path: navUri}).done(listEntries => {
            this.setState({
                listEntries: listEntries.entity._embedded.listEntries,
                attributes: this.state.attributes,
                pageSize: this.state.pageSize,
                links: listEntries.entity._links
            });
        });
    }

    handleNavFirst(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }

    render() {
        const inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input type="text" placeholder={attribute} ref={attribute} className="field"/>
            </p>
        );

        return <div>
            <a href="#createListEntry">Create</a>

            <div id="createListEntry" className="modalDialog">
                <div>
                    <a href="#" title="Close" className="close">X</a>
                    <h2>Create new list entry</h2>

                    <form>
                        {inputs}
                        <button onClick={this.handleSubmit}>Create</button>
                    </form>
                </div>
            </div>
        </div>
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('react')
);
