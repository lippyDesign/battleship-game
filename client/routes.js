import React from 'react';
import { Router, Route, IndexRoute, browserHistory, applyRouterMiddleware } from 'react-router';
import{ useScroll } from 'react-router-scroll';

import App from './pages/App';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import GameStaging from './pages/GameStaging';
import GameContainer from './components/GameContainer';

export default routes = (
    <Router history={browserHistory} render={applyRouterMiddleware(useScroll())} >
        <Route path='/' component={App}>
            <IndexRoute component={HomePage}/>
            <Route path='/create-game/:opponent' component={GameContainer}/>
            <Route path='/create-game/:opponent' component={GameContainer}/>
            <Route path='/game-staging' component={GameStaging}/>
        </Route>
    </Router>
);