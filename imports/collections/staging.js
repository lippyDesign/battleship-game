import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Link, browserHistory } from 'react-router';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('staging', function stagingPublication() {
    return Staging.find();
  });
}

Meteor.methods({

    'staging.insert'(gameShips, opponentGameShips = null) {
        
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
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        if (opponentGameShips !== null) { // if no oponent
            // Make sure we are inserting strings
            opponentGameShips.forEach( ({vesselType, location}) => {
                check(vesselType, String);
                location.forEach( (current) => {
                    check(current, String);
                })
                opponentShips.push({vesselType, location});
            });
            Staging.insert({
                ships,
                opponentShips,
                createdAt: new Date(),
                createdBy: this.userId,
                username: Meteor.users.findOne(this.userId).username,
                finished: false
            });
        } else { // if there is an opponent
            Staging.insert({
                ships,
                opponentShips,
                createdAt: new Date(),
                createdBy: this.userId,
                username: Meteor.users.findOne(this.userId).username,
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

export const Staging = new Mongo.Collection('staging');