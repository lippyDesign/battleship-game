import React, { Component} from 'react';

class OponentGameboard extends Component {
    
    render() {
        return (
            <ul className="GameBoard">
                {this.props.gridMaker(10, 10, this.props.game)}
            </ul>
        )
    }
}

export default OponentGameboard;