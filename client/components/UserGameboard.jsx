import React, { Component} from 'react';

class UserGameboard extends Component {
    // function bellow takes number of rows and number of columns
    // it returns the gaming table (digits for rows, letters for columns)
    
    render() {
        return (
            <ul className="GameBoard">
                {this.props.gridMaker(10, 10, this.props.staging, this.props.game)}
            </ul>
        )
    }
}

export default UserGameboard;