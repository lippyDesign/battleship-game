import React, {Component} from 'react';

import AccountsUI from '../accountsUI';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">Battleship</a>
                    </div>
                    <ul className="nav navbar-nav loginButtons">
                        <li><AccountsUI/></li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Navbar;