import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import UserGameboard from './UserGameboard';
import OponentGameboard from './OponentGameboard';

import { ShipPositions } from '../../imports/collections/shipPositions';

class GameContainer extends Component {
    constructor() {
        super();
        this.state = {
            ships: [
                {vesselType: 'aircraft carrier', squares: 5, positioned: false, location: [], message: 'please position your aircraft carrier (5 squares)'},
                {vesselType: 'battleship', squares: 4, positioned: false, location: [], message: 'please position your battleship (4 squares)'},
                {vesselType: 'cruiser', squares: 3, positioned: false, location: [], message: 'please position your cruiser (3 squares)'},
                {vesselType: 'destroyer', squares: 2, positioned: false, location: [], message: 'please position your destroyer (2 squares)'},
                {vesselType: 'destroyer', squares: 2, positioned: false, location: [], message: 'please position your second destroyer (2 squares)'},
                {vesselType: 'submarine', squares: 1, positioned: false, location: [], message: 'please position your submarine (1 square)'},
                {vesselType: 'submarine', squares: 1, positioned: false, location: [], message: 'please position your second submarine (1 square)'},
            ],
            gameCells: [],
            cellsAlreadyTaken: [],
            possiblePositionOptions: {},
            positioning: false,

            //////// computer ////////////
            compShips: [
                {vesselType: 'aircraft carrier', squares: 5, positioned: false, location: [], message: 'please position your aircraft carrier (5 squares)'},
                {vesselType: 'battleship', squares: 4, positioned: false, location: [], message: 'please position your battleship (4 squares)'},
                {vesselType: 'cruiser', squares: 3, positioned: false, location: [], message: 'please position your cruiser (3 squares)'},
                {vesselType: 'destroyer', squares: 2, positioned: false, location: [], message: 'please position your destroyer (2 squares)'},
                {vesselType: 'destroyer', squares: 2, positioned: false, location: [], message: 'please position your second destroyer (2 squares)'},
                {vesselType: 'submarine', squares: 1, positioned: false, location: [], message: 'please position your submarine (1 square)'},
                {vesselType: 'submarine', squares: 1, positioned: false, location: [], message: 'please position your second submarine (1 square)'},
            ],
            compCellsAlreadyTaken: [],

            //////// in game ////////////
            turn: '',
            inGame: false,
            usersShots: [],
            computersShots: [],
            nextCompTargets: [],
            shipPositionNotPossible: [],
            locationsOfHitShips: [],
            cellsToShootAt: []
        }
    }
    componentWillMount() {
        const alphabet = [...Array(26)].reduce(a=>a+String.fromCharCode(i++),'',i=97); // create alphabet
        const letters = alphabet.substr(0, 10).toUpperCase().split(""); // get the needed amount of alphabet characters for columns
        let cells = [] // initiate array for cells
        // create cells and push them onto cells array
        for (let i = 0; i < 10; i++) {
            letters.map((letter) => {
                return cells.push(`${letter}${i + 1}`) // for every row number we push all letters with that row number into cells array
            });
        }
        this.setState({ gameCells: this.state.gameCells.concat(cells) }) // push the cells array into state so we could use it later
    }
    componentDidMount() {
        this.compPosition(this.state.compCellsAlreadyTaken); // computer selects ships
        // determine who goes first
        let turn = (Math.floor(Math.random() * 2) + 1) === 1 ? 'usersTurn' : 'computersTurn';
        this.setState({turn});
    }
    positionShip(cell, ship) {
        if (this.state.cellsAlreadyTaken.indexOf(cell) > -1) {
            return;
        }
        switch (ship.squares) {
            case 1: // if ship takes up one square
                let newData = this.state.ships.slice(); //copy array
                const shipIndex = this.state.ships.indexOf(ship); // get index of current ship in the ships array
                let temp = newData.splice(shipIndex, 1); //remove element
                temp[0].positioned = true; // set positioned of removed element to true
                temp[0].location.push(cell); // location where the element was positioned
                newData.splice(shipIndex, 0, temp[0]); // insert the removed and modified element back into array
                let cellsAlreadyTaken = [...temp[0].location];
                const index = this.state.gameCells.indexOf(cell);
                if (this.state.gameCells[index].charAt(0) === 'J') {
                    if (this.state.gameCells[index - 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 1])
                        }
                    }
                    if (this.state.gameCells[index + 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 9])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                    if (this.state.gameCells[index - 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 11])
                        }
                    }
                } else if (this.state.gameCells[index].charAt(0) === 'A') {
                    if (this.state.gameCells[index + 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 1])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index + 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 11])
                        }
                    }
                    if (this.state.gameCells[index - 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 9])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                } else {
                    if (this.state.gameCells[index + 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 1])
                        }
                    }
                    if (this.state.gameCells[index - 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 1])
                        }
                    }
                    if (this.state.gameCells[index + 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 9])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index + 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 11])
                        }
                    }
                    if (this.state.gameCells[index - 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 9])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                    if (this.state.gameCells[index - 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 11])
                        }
                    }
                }
                this.setState({ships: newData, cellsAlreadyTaken: this.state.cellsAlreadyTaken.concat(cellsAlreadyTaken)}); //update state
                break;
            default:
                this.setState({positioning: true});
                this.adjustPosition(cell, ship.squares);
                break;
        }
    }
    adjustPosition(cell, numSquares) {
        let squaresNeeded = numSquares - 1
        let yPlusPositions = []
        let yMinusPositions = []
        let xPlusPositions = []
        let xMinusPositions = []
        let index = this.state.gameCells.indexOf(cell);
        let xPlus = this.state.gameCells[index + (squaresNeeded)];
        let xMinus = this.state.gameCells[index - (squaresNeeded)];
        let yPlus = this.state.gameCells[index - (squaresNeeded * 10)];
        let yMinus = this.state.gameCells[index + (squaresNeeded * 10)];

        if (xPlus && xPlus.charAt(1) === cell.charAt(1)) { // find out if ship will fit in x+ direction
            for (let i = 1; i < numSquares; i++) {
                // if any of the cells are already taken do nothing
                if (this.state.cellsAlreadyTaken.indexOf(this.state.gameCells[index + i]) === -1) {
                    xPlusPositions.push(this.state.gameCells[index + i])
                }
            }
        }
        if (xMinus && xMinus.charAt(1) === cell.charAt(1)) { // find out if ship will fit in x- direction
            for (let i = 1; i < numSquares; i++) {
                // if any of the cells are already taken do nothing
                if (this.state.cellsAlreadyTaken.indexOf(this.state.gameCells[index - i]) === -1) {
                    xMinusPositions.push(this.state.gameCells[index - i])
                }
            }
        }
        if (yPlus && yPlus.charAt(0) === cell.charAt(0)) { // find out if ship will fit in y+ direction
            for (let i = 1; i < numSquares; i++) {
                // if any of the cells are already taken do nothing
                if (this.state.cellsAlreadyTaken.indexOf(this.state.gameCells[index - (i*10)]) === -1) {
                    yPlusPositions.push(this.state.gameCells[index - (i*10)])
                }
            }
        }
        if (yMinus && yMinus.charAt(0) === cell.charAt(0)) { // find out if ship will fit in y- direction
            for (let i = 1; i < numSquares; i++) {
                // if any of the cells are already taken do nothing
                if (this.state.cellsAlreadyTaken.indexOf(this.state.gameCells[index + (i*10)]) === -1) {
                    yMinusPositions.push(this.state.gameCells[index + (i*10)])
                }
            }
        }
        // only add to possible positions if all squares fit in a particular direction
        if (xPlusPositions.length !== numSquares - 1) {
            xPlusPositions = []
        }
        if (xMinusPositions.length !== numSquares - 1) {
            xMinusPositions = []
        }
        if (yPlusPositions.length !== numSquares - 1) {
            yPlusPositions = []
        }
        if (yMinusPositions.length !== numSquares - 1) {
            yMinusPositions = []
        }
        if (xPlusPositions.length === 0 && xMinusPositions.length === 0 && yPlusPositions.length === 0 && yMinusPositions.length === 0) {
            this.setState({positioning: false})
            return 
        }
        let possiblePositionOptions = {
            xP: [...xPlusPositions],
            xM: [...xMinusPositions],
            yP: [...yPlusPositions],
            yM: [...yMinusPositions],
            allPossible: [cell, ...xPlusPositions, ...xMinusPositions, ...yPlusPositions, ...yMinusPositions]
        }
        this.setState({ possiblePositionOptions });
    }
    // get the first ship that has not been positioned yet
    getShipInHand() {
        return this.state.ships.find( ship => !ship.positioned) ? this.state.ships.find( ship => !ship.positioned) : '';
    }
    setShip(cell, ship) {
        // cell is what user pressed when confirming position
        // the initial cell that user taped is always saved as the first element of all possible options array
        let initial = this.state.possiblePositionOptions.allPossible[0];
        if (this.state.possiblePositionOptions.xP.indexOf(cell) > -1) {
            let newData = this.state.ships.slice(); //copy array
            const index = this.state.ships.indexOf(ship); // get index of current ship in the ships array
            let temp = newData.splice(index, 1); //remove element
            temp[0].positioned = true; // set positioned of removed element to true
            temp[0].location = [initial, ...this.state.possiblePositionOptions.xP]; // location where the element was positioned
            newData.splice(index, 0, temp[0]); // insert the removed and modified element back into array
            let cellsAlreadyTaken = [...temp[0].location]; // create taken cells array and insert cells taken by the ship
            // the following block of code will insert all surounding cells into the taken cells array if the cells exist and are not in the array yet
            temp[0].location.forEach( (current) => {
                const index = this.state.gameCells.indexOf(current);
                if (this.state.gameCells[index].charAt(0) === 'J') {
                    if (this.state.gameCells[index - 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 1])
                        }
                    }
                    if (this.state.gameCells[index + 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 9])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                    if (this.state.gameCells[index - 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 11])
                        }
                    }
                } else if (this.state.gameCells[index].charAt(0) === 'A') {
                    if (this.state.gameCells[index + 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 1])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index + 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 11])
                        }
                    }
                    if (this.state.gameCells[index - 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 9])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                } else {
                    if (this.state.gameCells[index + 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 1])
                        }
                    }
                    if (this.state.gameCells[index - 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 1])
                        }
                    }
                    if (this.state.gameCells[index + 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 9])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index + 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 11])
                        }
                    }
                    if (this.state.gameCells[index - 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 9])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                    if (this.state.gameCells[index - 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 11])
                        }
                    }
                }
            })
            this.setState({ //update state
                ships: newData,
                positioning: false,
                possiblePositionOptions: {},
                cellsAlreadyTaken: this.state.cellsAlreadyTaken.concat(cellsAlreadyTaken)
            });
            return
        }
        if (this.state.possiblePositionOptions.xM.indexOf(cell) > -1) {
            let newData = this.state.ships.slice(); //copy array
            const index = this.state.ships.indexOf(ship); // get index of current ship in the ships array
            let temp = newData.splice(index, 1); //remove element
            temp[0].positioned = true; // set positioned of removed element to true
            temp[0].location = [initial, ...this.state.possiblePositionOptions.xM]; // location where the element was positioned
            newData.splice(index, 0, temp[0]); // insert the removed and modified element back into array
            let cellsAlreadyTaken = [...temp[0].location]; // create taken cells array and insert cells taken by the ship
            // the following block of code will insert all surounding cells into the taken cells array if the cells exist and are not in the array yet
            temp[0].location.forEach( (current) => {
                const index = this.state.gameCells.indexOf(current);
                if (this.state.gameCells[index].charAt(0) === 'J') {
                    if (this.state.gameCells[index - 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 1])
                        }
                    }
                    if (this.state.gameCells[index + 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 9])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                    if (this.state.gameCells[index - 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 11])
                        }
                    }
                } else if (this.state.gameCells[index].charAt(0) === 'A') {
                    if (this.state.gameCells[index + 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 1])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index + 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 11])
                        }
                    }
                    if (this.state.gameCells[index - 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 9])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                } else {
                    if (this.state.gameCells[index + 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 1])
                        }
                    }
                    if (this.state.gameCells[index - 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 1])
                        }
                    }
                    if (this.state.gameCells[index + 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 9])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index + 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 11])
                        }
                    }
                    if (this.state.gameCells[index - 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 9])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                    if (this.state.gameCells[index - 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 11])
                        }
                    }     
                }
            })
            this.setState({ //update state
                ships: newData,
                positioning: false,
                possiblePositionOptions: {},
                cellsAlreadyTaken: this.state.cellsAlreadyTaken.concat(cellsAlreadyTaken)
            });
            return
        }
        if (this.state.possiblePositionOptions.yP.indexOf(cell) > -1) {
            let newData = this.state.ships.slice(); //copy array
            const index = this.state.ships.indexOf(ship); // get index of current ship in the ships array
            let temp = newData.splice(index, 1); //remove element
            temp[0].positioned = true; // set positioned of removed element to true
            temp[0].location = [initial, ...this.state.possiblePositionOptions.yP]; // location where the element was positioned
            newData.splice(index, 0, temp[0]); // insert the removed and modified element back into array
            let cellsAlreadyTaken = [...temp[0].location]; // create taken cells array and insert cells taken by the ship
            // the following block of code will insert all surounding cells into the taken cells array if the cells exist and are not in the array yet
            temp[0].location.forEach( (current) => {
                const index = this.state.gameCells.indexOf(current);
                if (this.state.gameCells[index].charAt(0) === 'J') {
                    if (this.state.gameCells[index - 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 1])
                        }
                    }
                    if (this.state.gameCells[index + 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 9])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                    if (this.state.gameCells[index - 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 11])
                        }
                    }
                } else if (this.state.gameCells[index].charAt(0) === 'A') {
                    if (this.state.gameCells[index + 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 1])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index + 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 11])
                        }
                    }
                    if (this.state.gameCells[index - 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 9])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                } else {
                    if (this.state.gameCells[index + 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 1])
                        }
                    }
                    if (this.state.gameCells[index - 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 1])
                        }
                    }
                    if (this.state.gameCells[index + 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 9])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index + 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 11])
                        }
                    }
                    if (this.state.gameCells[index - 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 9])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                    if (this.state.gameCells[index - 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 11])
                        }
                    }
                }
            })
            this.setState({ //update state
                ships: newData,
                positioning: false,
                possiblePositionOptions: {},
                cellsAlreadyTaken: this.state.cellsAlreadyTaken.concat(cellsAlreadyTaken)
            });
            return
        }
        if (this.state.possiblePositionOptions.yM.indexOf(cell) > -1) {
            let newData = this.state.ships.slice(); //copy array
            const index = this.state.ships.indexOf(ship); // get index of current ship in the ships array
            let temp = newData.splice(index, 1); //remove element
            temp[0].positioned = true; // set positioned of removed element to true
            temp[0].location = [initial, ...this.state.possiblePositionOptions.yM]; // location where the element was positioned
            newData.splice(index, 0, temp[0]); // insert the removed and modified element back into array
            let cellsAlreadyTaken = [...temp[0].location]; // create taken cells array and insert cells taken by the ship
            // the following block of code will insert all surounding cells into the taken cells array if the cells exist and are not in the array yet
            temp[0].location.forEach( (current) => {
                const index = this.state.gameCells.indexOf(current);
                if (this.state.gameCells[index].charAt(0) === 'J') {
                    if (this.state.gameCells[index - 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 1])
                        }
                    }
                    if (this.state.gameCells[index + 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 9])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                    if (this.state.gameCells[index - 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 11])
                        }
                    }
                } else if (this.state.gameCells[index].charAt(0) === 'A') {
                    if (this.state.gameCells[index + 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 1])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index + 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 11])
                        }
                    }
                    if (this.state.gameCells[index - 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 9])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                } else {
                    if (this.state.gameCells[index + 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 1])
                        }
                    }
                    if (this.state.gameCells[index - 1]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 1]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 1])
                        }
                    }
                    if (this.state.gameCells[index + 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 9])
                        }
                    }
                    if (this.state.gameCells[index + 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 10])
                        }
                    }
                    if (this.state.gameCells[index + 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index + 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index + 11])
                        }
                    }
                    if (this.state.gameCells[index - 9]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 9]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 9])
                        }
                    }
                    if (this.state.gameCells[index - 10]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 10]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 10])
                        }
                    }
                    if (this.state.gameCells[index - 11]) {
                        if (cellsAlreadyTaken.indexOf(this.state.gameCells[index - 11]) === -1) {
                            cellsAlreadyTaken.push(this.state.gameCells[index - 11])
                        }
                    }
                }
            })
            this.setState({ //update state
                ships: newData,
                positioning: false,
                possiblePositionOptions: {},
                cellsAlreadyTaken: this.state.cellsAlreadyTaken.concat(cellsAlreadyTaken)
            });
            return
        }
    }
    
    gridMaker(numColumns, numRows) {
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
        let shipPositions = this.state.ships.map( ship => ship.location); // get positions of ships from ships state
        let shipsArray = [].concat.apply([], shipPositions); // flatten arrays of positions into one array
        // map over the cells array and create li elements for every cell
        return cells.map( (cell) => {
            let theShip = this.getShipInHand();
            let positionId = '';
            if (this.state.possiblePositionOptions.allPossible) { // if possiblePositionOptions from state is not an empty object
                positionId = this.state.possiblePositionOptions.allPossible.indexOf(cell) > -1 ? 'possibleOption' : '';
            }
            let positionClass = '';
            if (!this.state.inGame) {
                positionClass = this.state.cellsAlreadyTaken.indexOf(cell) > -1 ? 'alreadyTakenOption' : '';
            } else {
                positionClass = '';
            }

            let blackShip = shipsArray.indexOf(cell) > -1 ? 'ship' : ''
            let cursor = this.getShipInHand() ? 'pointer' : '';
            let shotOrNot = cell;
            let shotCell = ''
            if (this.state.computersShots.indexOf(cell) !== -1) {
                shotOrNot = <i className="fa fa-times-circle-o text-danger" aria-hidden="true"></i>;
                shotCell = 'missed';
            }
            if (shipsArray.indexOf(cell) !== -1 && this.state.computersShots.indexOf(cell) !== -1) { // if ship was hit
                shotOrNot = <i className="fa fa-fire text-danger" aria-hidden="true"></i>;
            }
            
            return (
                <li 
                    className={`cell cellNum${cell} ${positionClass} ${cursor} ${shotCell}`}
                    id={positionId}
                    key={cell}
                    onClick={this.getShipInHand() ? (this.state.positioning ? ()=> this.setShip(cell, theShip) : ()=> this.positionShip(cell, theShip)) : ''}
                >
                        <small id={blackShip}>{shotOrNot}</small>
                </li>
            )
        });
    }
    compPosition(cellsUsed) {
        // recusrsively select and position all computer's ships
        let shipInHand = this.state.compShips.find( ship => !ship.positioned);
        if (shipInHand) {
            return this.compAdjust(shipInHand, cellsUsed);
        }
        this.setState({compCellsAlreadyTaken: cellsUsed})
        return
    }
    compAdjust(shipInHand, cellsUsed) {
        // select a random cell as the initial cell to position a ship
        let randomCell = this.state.gameCells[Math.floor(Math.random() * this.state.gameCells.length)];
        // determine all possible directions to position a ship
        let possibleXp = [randomCell];
        let possibleXm = [randomCell];
        let possibleYp = [randomCell];
        let possibleYm = [randomCell];
        for (let i = 1; i < shipInHand.squares; i++) { // push the needed amount of cells into their respective arrays
            possibleXp.push(this.state.gameCells[this.state.gameCells.indexOf(randomCell) + i]);
            possibleXm.push(this.state.gameCells[this.state.gameCells.indexOf(randomCell) - i]);
            possibleYp.push(this.state.gameCells[this.state.gameCells.indexOf(randomCell) - (10 * i)]);
            possibleYm.push(this.state.gameCells[this.state.gameCells.indexOf(randomCell) + (10 * i)]);
        }
        // determine if some of those cells are undefined (not in possible game cells) or already taken
        // or not on the same row (for x in plus and minus directions)
        let Xpp = possibleXp.every( element => (element !== undefined) && (cellsUsed.indexOf(element) === -1 ));
        let Xmm = possibleXm.every( element => (element !== undefined) && (cellsUsed.indexOf(element) === -1 ));
        let Xp = (Xpp === true) ? possibleXp.every( element => (element.charAt(1) === randomCell.charAt(1))) : false;
        let Xm = (Xmm === true) ? possibleXm.every( element => (element.charAt(1) === randomCell.charAt(1))) : false;
        let Yp = possibleYp.every( element => (element !== undefined) && (cellsUsed.indexOf(element) === -1 ));
        let Ym = possibleYm.every( element => (element !== undefined) && (cellsUsed.indexOf(element) === -1 ));
        // if all directions are false (meaning we have nowhere to go) than start over
        if (Xp === false && Xm === false && Yp === false && Ym === false) {
            return this.compAdjust(shipInHand, cellsUsed);
        }
        // push all possible directions into one array
        let arrayToChooseDirection = [];
        if (Xp) { arrayToChooseDirection.push(possibleXp) }
        if (Xm) { arrayToChooseDirection.push(possibleXm) }
        if (Yp) { arrayToChooseDirection.push(possibleYp) }
        if (Ym) { arrayToChooseDirection.push(possibleYm) }
        // select a random direction from the possible directions array
        let randomDirection = arrayToChooseDirection[Math.floor(Math.random() * arrayToChooseDirection.length)];
        let newData = this.state.compShips.slice(); //copy array
        const index = this.state.compShips.indexOf(shipInHand); // get index of current ship in the ships array
        let temp = newData.splice(index, 1); //remove element
        temp[0].positioned = true; // set positioned of removed element to true
        temp[0].location = [...randomDirection]; // location where the element was positioned
        newData.splice(index, 0, temp[0]); // insert the removed and modified element back into array
        let cellsTakenByComp = [...randomDirection]; // cells already taken by ship
        // add the used cells into the cells used array
        let newCellsUsed = cellsUsed.concat(randomDirection); // add the cells taken up by ship to the cells used array
        randomDirection.forEach( (cell) => { // for each cell push the surounding cells into the used array, unless those cells don't exist or there already
            let possibilitiesArray = [1, 10, 9, 11, -1, -10, -9, -11]; // surrounding cells
            if (cell.charAt(0) === 'A') { // 'A' has less surounding cells as it is first of the row
                possibilitiesArray = [1, 10, 11, -10, -9];
            } else if (cell.charAt(0) === 'J') { // 'J' has less surounding cells as it is last of the row
                possibilitiesArray = [10, 9, -1, -10, -11];
            }
            possibilitiesArray.forEach( (arrayItem) => {
                if (this.state.gameCells[this.state.gameCells.indexOf(cell) + arrayItem] && (newCellsUsed.indexOf(this.state.gameCells[this.state.gameCells.indexOf(cell) + arrayItem]) === -1)) {
                    newCellsUsed.push(this.state.gameCells[this.state.gameCells.indexOf(cell) + arrayItem]);
                }
            });
        });
        return this.compPosition(newCellsUsed); // recursive call of the function above
    }
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
            let cursor = this.state.inGame ? 'pointer' : '';
            let shotOrNot = cell;
            let shotCell = '';
            if (this.state.usersShots.indexOf(cell) !== -1) { // if missed
                shotOrNot = <i className="fa fa-times-circle-o text-danger" aria-hidden="true"></i>;
                shotCell = 'missed';
                white = 'white'
            }
            if (shipsArray.indexOf(cell) !== -1 && this.state.usersShots.indexOf(cell) !== -1) { // if ship was hit
                shotOrNot = <i className="fa fa-fire text-info" id='white' aria-hidden="true"></i>;
                shotCell = 'killed';
            }
            return (
                <li 
                    className={`cell cellNum${cell} ${cursor} ${shotCell}`}
                    key={cell}
                    onClick={this.state.inGame && (this.state.turn === 'usersTurn') ? () => this.userPlay(cell) : '' }
                >
                        <small>{shotOrNot}</small>
                </li>
            )
        });
    }
    userPlay(cell) {
        let x = this.state.compShips.map( ship => ship.location); // comp ship position arrays
        let flatX = [].concat.apply([], x); // all cells where comp positioned ships
        let whoGoesNext = 'computersTurn'; // comp will go next, unless user hits a ship
        // user shoots into the tapped cell
        if (this.state.usersShots.indexOf(cell) === -1 && this.state.gameCells.indexOf(cell) !== -1) { // only do something if user did not shoot there yet
            if (flatX.indexOf(cell) !== -1) {
                whoGoesNext = 'usersTurn';
            }
            this.setState({usersShots: this.state.usersShots.concat(cell), turn: whoGoesNext});
            //this.computerPlay();
        }
    }
    computerPlay() {
        let possTargets = this.state.nextCompTargets.slice();
        let impossTargets = this.state.shipPositionNotPossible.slice();
        let alreadyShot = this.state.computersShots.slice();
        let hitsArray = this.state.locationsOfHitShips;
        let whoGoesNext = 'usersTurn'; // user will go next, unless comp hits a ship
        let aliveShips = [];
        let cellsToShoot = [];
        this.state.ships.forEach(ship => {
            if (ship.location.some(cell => alreadyShot.indexOf(cell) === -1)) {
                aliveShips.push(ship);
            }
        })
        let cellsNotToHit = [...alreadyShot, ...impossTargets];
        this.state.gameCells.forEach( cell => {
            if (cellsNotToHit.indexOf(cell) === -1) {
                cellsToShoot.push(cell)
            }
        });
        let randomCell;   
        // if there are cells in the possible Targets array we'll select a shot from there, else random shot
        if (possTargets.length !== 0) {
            randomCell = possTargets[Math.floor(Math.random() * possTargets.length)];
            possTargets.splice(possTargets.indexOf(randomCell), 1); // remove cell from possible targets list
        } else {
            // find the number of squares of the biggest available ship
            biggestShipSquares = aliveShips[0].squares;
            // get random cell from the available cells
            randomCell = cellsToShoot[Math.floor(Math.random() * cellsToShoot.length)];
            // check if the biggest ship will fit in at least one direction
            let possibleOptionsXp = [];
            let possibleOptionsXm = [];
            let possibleOptionsYp = [];
            let possibleOptionsYm = [];
            for (let i = 1; i < biggestShipSquares; i++) {
                let index = this.state.gameCells.indexOf(randomCell);
                if (this.state.gameCells[index + i]) {
                        possibleOptionsXp.push(this.state.gameCells[index + i])
                }
                if (this.state.gameCells[index - i]) {
                    possibleOptionsXm.push(this.state.gameCells[index - i])
                }
                if (this.state.gameCells[index + (10 * i)]) {
                    possibleOptionsYm.push(this.state.gameCells[index + (10 * i)])
                }
                if (this.state.gameCells[index - (10 * i)]) {
                    possibleOptionsYp.push(this.state.gameCells[index - (10 * i)])
                }
            }
            // if biggest ship doen't fit, we'll make the direction = z1 which will evealuate false later
            if (possibleOptionsXp.length < biggestShipSquares - 1) {
                possibleOptionsYp = ['Z1'];
            }
            if (possibleOptionsXm.length < biggestShipSquares - 1) {
                possibleOptionsXm = ['Z1'];
            }
            if (possibleOptionsYp.length < biggestShipSquares - 1) {
                possibleOptionsYp = ['Z1'];
            }
            if (possibleOptionsYm.length < biggestShipSquares - 1) {
                possibleOptionsYm = ['Z1'];
            }
            if (possibleOptionsXp.some(char => char.charAt(1) !== randomCell.charAt(1))) {
                possibleOptionsXp = ['Z1'];
            }
            if (possibleOptionsXm.some(char => char.charAt(1) !== randomCell.charAt(1))) {
                possibleOptionsXm = ['Z1'];
            }
            
            // if biggest available ship will not fit in at least one dircetion, we'll redo
            if (!possibleOptionsXp.every(cell => cellsToShoot.indexOf(cell) !== -1) && !possibleOptionsXm.every(cell => cellsToShoot.indexOf(cell) !== -1) && !possibleOptionsYm.every(cell => cellsToShoot.indexOf(cell) !== -1) && !possibleOptionsYp.every(cell => cellsToShoot.indexOf(cell) !== -1)) {
                return this.computerPlay();
            }
        }
        // if computer already shot there, or shot is in the impossible array then redo
        if (alreadyShot.indexOf(randomCell) !== -1 || impossTargets.indexOf(randomCell) !== -1) {
            return this.computerPlay();
        }
        alreadyShot.push(randomCell); // add random cell to the already shot cells
        let x = this.state.ships.map( ship => ship.location); // user ship position arrays
        let flatX = [].concat.apply([], x); // all cells where user positioned ships
        let possibleTargets = [1, 10, -1, -10]; // possible ways a ship could be positioned
        let positionsImpossible = [9, 11, -9, -11]; // user's ship can't be positioned here as the ships cannot touch
        if (randomCell.charAt(0) === 'A') { // if ship hit on the left side of the grid
            possibleTargets = [1, 10, -10];
            positionsImpossible = [11, -9];
        } else if (randomCell.charAt(0) === 'J') { // if ship hit on the right side of the grid
            possibleTargets = [10, -1, -10];
            positionsImpossible = [9, -11];
        }
        if (flatX.indexOf(randomCell) !== -1) { // if ship was hit by the shot
            hitsArray.push(randomCell); // add the hit to the hits array
            whoGoesNext = 'computersTurn'; // comp hit a ship therefore it also has next turn
            index = this.state.gameCells.indexOf(randomCell)
            possibleTargets.forEach( (possibleTarget) => {
                // push possible next targets if they exist on the grid and are not already in the array
                if (this.state.gameCells[index + possibleTarget] && possTargets.indexOf(this.state.gameCells[index + possibleTarget]) === -1) {
                    possTargets.push(this.state.gameCells[index + possibleTarget]);
                }
            });
            positionsImpossible.forEach( (impossiblePosition) => {
                // push impossible positions if they exist on the grid and are not already in the array
                if (this.state.gameCells[index + impossiblePosition] && impossTargets.indexOf(this.state.gameCells[index + impossiblePosition]) === -1) {
                    impossTargets.push(this.state.gameCells[index + impossiblePosition]);
                }
            })
        }
        // if all cells of the biggest available ship are hit, add all surounding cells to the impossible array if they are not already there
        if (aliveShips[0].location.every(cell => hitsArray.indexOf(cell) !== -1)) {
            let positionsImpossible = [1, 9, 10, 11, -1, -9, -10, -11]; // user's ship can't be positioned here as the ships cannot touch
            if (randomCell.charAt(0) === 'A') { // if ship hit on the left side of the grid
                positionsImpossible = [1, 10, 11, -9];
            } else if (randomCell.charAt(0) === 'J') { // if ship hit on the right side of the grid
                positionsImpossible = [9, -10, -1, -11];
            }
            positionsImpossible.forEach( (impossiblePosition) => {
                // push impossible positions if they exist on the grid and are not already in the array
                if (this.state.gameCells[index + impossiblePosition] && impossTargets.indexOf(this.state.gameCells[index + impossiblePosition]) === -1) {
                    impossTargets.push(this.state.gameCells[index + impossiblePosition]);
                }
            });
        }
        
        // remove all possible targets if they are in the impossible target array
        impossTargets.forEach((impossTarget) => {
            if (possTargets.indexOf(impossTarget) !== -1) {
                possTargets.splice(possTargets.indexOf(impossTarget), 1);
            }
        });
        // remove all possible targets if they are in the already shot array
        alreadyShot.forEach( (compShot) => {
            if (possTargets.indexOf(compShot) !== -1) {
                possTargets.splice(possTargets.indexOf(compShot), 1);
            }
        });
        this.setState({
            computersShots: alreadyShot,
            nextCompTargets: possTargets,
            shipPositionNotPossible: impossTargets,
            turn: whoGoesNext,
            locationsOfHitShips: hitsArray
        });
    }
    render() {
        let allCompShipsKilled;
        let allUserShipsKilled;
        if (this.state.inGame) { // if comp ships were killed
            let x = this.state.compShips.map( ship => ship.location);
            let flatX = [].concat.apply([], x);
            allCompShipsKilled = flatX.every(element => this.state.usersShots.indexOf(element) !== -1);
        }
        if (this.state.inGame) { // if user ships were killed
            let x = this.state.ships.map( ship => ship.location);
            let flatX = [].concat.apply([], x);
            allUserShipsKilled = flatX.every(element => this.state.computersShots.indexOf(element) !== -1);
        }
        let message = '';
        if (!this.state.inGame) {
            message = this.getShipInHand() ? this.getShipInHand().message : 'All ships are positioned';
        } else {
            message = (this.state.turn === 'usersTurn') ? 'your turn' : "computer's turn";
        }
        (this.state.turn === 'computersTurn' && this.state.inGame === true && !allCompShipsKilled && !allUserShipsKilled) ? this.computerPlay() : ''
        message = allCompShipsKilled ? 'game over, User won' : message; // if user won
        message = allUserShipsKilled ? 'game over, Computer won' : message; // if computer won
        // If all ships are positioned than we save them into the database
        const readyButton = (message === 'All ships are positioned') ? <button className="btn btn-success" onClick={() => this.setState({inGame: true})}>I'm ready!</button> : '';
        if (allCompShipsKilled || allUserShipsKilled) {
            return (
                <h2>{message}</h2>
            )
        }
        return (
            <div className='GameContainer'>
                <div className="gameLeftSection">
                    <h2>{message} {readyButton}</h2>
                    <h1>User</h1>
                    <UserGameboard
                        gridMaker={this.gridMaker.bind(this)}
                    />
                </div>
                <div className="gameRightSection">
                    <h1>Opponent</h1>
                    <OponentGameboard gridMaker={this.autoGridMaker.bind(this)}/>
                </div>
            </div>
        )
    }
}

export default createContainer( () => {
    Meteor.subscribe('shipPositions');
    return {
        shipPositions: ShipPositions.find({}).fetch(),
    };
}, GameContainer);