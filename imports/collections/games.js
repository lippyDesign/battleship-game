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
        // decide whose turn it is to go first
        let turn = (Math.floor(Math.random() * 2) + 1) === 1 ? userOneInfo.createdBy : userTwoInfo.createdBy;

        Games.insert({
            userOneInfo,
            userTwoInfo,
            turn,
            createdAt: new Date(),
            winner: '',
            shots: []
        });
    },
    'games.addShot'(game, user, cell) {
        let thisGame = Games.find(g => g._id === game);
        console.log(thisGame);
        check(cell, String);
        Games.update(game, { $push: {shots: {shotBy: user, shot: cell} } } );
    }
});

export const Games = new Mongo.Collection('games');