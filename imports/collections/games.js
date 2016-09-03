import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('games', function gamePublication() {
    return Games.find();
  });
}

Meteor.methods({

    'games.insert'(userOneInfo, userTwoInfo) {
        // Make sure we are inserting strings
        userOneInfo.gameShips.forEach( ({vesselType, location}) => {
            check(vesselType, String);
            location.forEach( (current) => {
                check(current, String);
            })
        })
        userTwoInfo.gameShips.forEach( ({vesselType, location}) => {
            check(vesselType, String);
            location.forEach( (current) => {
                check(current, String);
            })
        })
        
        // Make sure the users are logged in before inserting a task
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Games.insert({
            userOneInfo,
            userTwoInfo,
            createdAt: new Date(),
            winner: ''
        });
    }
});

export const Games = new Mongo.Collection('games');