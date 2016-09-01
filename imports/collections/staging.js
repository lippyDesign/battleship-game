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
        
        let ships = []

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

        Staging.insert({
            ships,
            createdAt: new Date(),
            createdBy: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    }
});

export const Staging = new Mongo.Collection('staging');