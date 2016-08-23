import React, { Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Navbar from '../components/Navbar'
import UserGameboard from '../components/UserGameboard'
import OponentGameboard from '../components/OponentGameboard'

import { ShipPositions } from '../../imports/collections/shipPositions';

class InGame extends Component {
    
    autoGridMaker(numColumns, numRows) {
        const alphabet = [...Array(26)].reduce(a=>a+String.fromCharCode(i++),'',i=97); // create alphabet
        const letters = alphabet.substr(0, numColumns).toUpperCase().split(""); // get the needed amount of alphabet characters for columns
        let cells = ['-', ...letters] // initiate array for cells and insert column labels into it
        // create cells and push them onto cells array
        for (let i = 0; i < numRows; i++) {
            cells.push(`${i + 1}`); // for beginning of every row we push row number as the first cell in that row
            letters.map((letter) => {
                return cells.push(`${letter}${i + 1}`) // for every row number we push all letters with that row number into cells array
            });
        }
        let shipPositions = this.state.compShips.map( ship => ship.location); // get positions of ships from ships state
        let shipsArray = [].concat.apply([], shipPositions); // flatten arrays of positions into one array
        // map over the cells array and create li elements for every cell
        return cells.map( (cell) => {
            let blackShip = (shipsArray.indexOf(cell) === -1) ? '' : 'ship';
            return (
                <li 
                    className={`cell cellNum${cell} `}
                    key={cell}
                    //onClick={this.getShipInHand() ? (this.state.positioning ? ()=> this.setShip(cell, theShip) : ()=> this.positionShip(cell, theShip)) : ''}
                >
                        <small id={blackShip}>{cell}</small>
                </li>
            )
        });
    }
    render() {
        console.log(this.props.shipPositions)
        return (
            <div>
                <Navbar/>

            </div>
        )
    }
}

export default createContainer( () => {
    Meteor.subscribe('shipPositions');
    return {
        shipPositions: ShipPositions.find({}).fetch(),
    };
}, InGame);