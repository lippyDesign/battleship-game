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

    'staging.insert'(gameShips) {

        // Make sure we are inserting strings
        gameShips.forEach( ({vesselType, location}) => {
            check(vesselType, String);
            location.forEach( (current) => {
                check(current, String);
            })
        })
        
        // Make sure the user is logged in before inserting a task
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Staging.insert({
            gameShips,
            createdBy: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    },
    'staging.remove'(stagingId) {
        check(stagingId, String);
        Staging.remove(stagingId);
    }
});

export const Staging = new Mongo.Collection('staging');