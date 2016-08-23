import React from 'react';
import { Router, Route, IndexRoute, browserHistory, applyRouterMiddleware } from 'react-router';
import{ useScroll } from 'react-router-scroll';

import App from './pages/App';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import GameStaging from './pages/GameStaging';
import InGame from './pages/InGame';

export default routes = (
    <Router history={browserHistory} render={applyRouterMiddleware(useScroll())} >
        <Route path='/' component={App}>
            <IndexRoute component={HomePage}/>
            <Route path='/in-game' component={InGame}/>
            <Route path='/game-staging' component={GameStaging}/>
        </Route>
    </Router>
);