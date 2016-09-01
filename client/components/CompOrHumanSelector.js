import React from 'react';
import { browserHistory } from 'react-router';

data = [
    {
        icon: 'fa fa-desktop fa-3x',
        bigText: 'Play Against Computer',
        smallText: 'See if you can beat this super mega powerful battleship computer',
        url: '/create-game/computer'
    },
    {
        icon: 'fa fa-user fa-3x',
        bigText: 'Play Against a Friend',
        smallText: 'Create a game and wait until someone joins it, then beat them',
        url: '/create-game/friend'
    },
    {
        icon: 'fa fa-random fa-3x',
        bigText: 'Play a Random Game',
        smallText: 'Join a random game created by a human being just like yourself',
        url: '/create-game/random-human'
    }
]

function getData() {
    return data.map( ({icon, bigText, smallText, url}) => {
        return (
            <section key={`${icon}${bigText}`} onClick={()=> browserHistory.push(url)}>
                <h1><i className={icon}></i></h1>
                <h1>{bigText}</h1>
                <h2>{smallText}</h2>
            </section>
        )
    });
}

export default () => {
    return (
        <div className="compOrHumanSelector">
            {getData()}
        </div>
    )
}