import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Link, browserHistory } from 'react-router';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('shipPositions', function shipPositionsPublication() {
    return ShipPositions.find();
  });
}

Meteor.methods({

    'shipPositions.insert'(gameShips, opponentGameShips = null) {
        
        let ships = []
        let opponentShips = []

        // Make sure we are inserting strings
        gameShips.forEach( ({vesselType, location}) => {
            check(vesselType, String);
            location.forEach( (current) => {
                check(current, String);
            })
            ships.push({vesselType, location});
        })
        
        // Make sure the user is logged in before inserting a task
        /*if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }*/
        if (opponentGameShips !== null) { // if no oponent
            // Make sure we are inserting strings
            opponentGameShips.forEach( ({vesselType, location}) => {
                check(vesselType, String);
                location.forEach( (current) => {
                    check(current, String);
                })
                opponentShips.push({vesselType, location});
            });
            ShipPositions.insert({
                ships,
                opponentShips,
                createdAt: new Date(),
                createdBy: this.userId ? this.userId : '1234computer',
                username: Meteor.users.findOne(this.userId) ? Meteor.users.findOne(this.userId).username : 'computer',
                finished: false
            });
        } else { // if there is an opponent
            ShipPositions.insert({
                ships,
                opponentShips,
                createdAt: new Date(),
                createdBy: this.userId ? this.userId : '1234computer',
                username: Meteor.users.findOne(this.userId) ? Meteor.users.findOne(this.userId).username : 'computer',
                finished: false
            }, (error, result) => {
                if ( error ) {throw new Meteor.Error(error)}; //info about what went wrong
                if ( result ) { // if successful 
                    browserHistory.push('/game-staging');
                }
            });
        }
    }
});

export const ShipPositions = new Mongo.Collection('shipPositions');