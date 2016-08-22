import React from 'react';
import ReactDOM from 'react-dom';

import routes from './routes'

Meteor.startup( ()=> {
    ReactDOM.render(routes, document.querySelector('.render-target'));
});