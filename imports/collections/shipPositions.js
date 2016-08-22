import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('shipPositions', function shipPositionsPublication() {
    return ShipPositions.find();
  });
}

Meteor.methods({

    'shipPositions.insert'(gameShips, opponentGameShips) {
        
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
        // Make sure we are inserting strings
        opponentGameShips.forEach( ({vesselType, location}) => {
            check(vesselType, String);
            location.forEach( (current) => {
                check(current, String);
            })
            opponentShips.push({vesselType, location});
        })

        // Make sure the user is logged in before inserting a task
        /*if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }*/
        ShipPositions.insert({
            ships,
            opponentShips,
            createdAt: new Date(),
            owner: this.userId ? this.userId : '1234computer',
            username: Meteor.users.findOne(this.userId) ? Meteor.users.findOne(this.userId).username : 'computer',
        });
    }
});

export const ShipPositions = new Mongo.Collection('shipPositions');