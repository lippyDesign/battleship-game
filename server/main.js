import { Meteor } from 'meteor/meteor';

import { Staging } from '../imports/collections/staging';

//Allow users to remove their own profiles
Meteor.users.allow({remove: function () { return true; }});

Meteor.startup(() => {
  // code to run on server at startup
});
