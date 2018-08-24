import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Main from 'routes/main';
import Home from 'routes/home';
import SignUp from 'routes/sign-up';
import LogIn from 'routes/log-in';
import Following from 'routes/following/index.js';
import Profile from 'routes/profile/index.js';
import Pin from 'routes/pin';
import CreatePin from 'routes/create-pin';
import CreateBoard from 'routes/create-board';

class Router extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Main}/>
        <Route path="/home" component={Home}/>
        <Route path="/following" component={Following}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/sign-up" component={SignUp}/>
        <Route path="/log-in" component={LogIn}/>
        <Route path="/board/new" component={CreateBoard}/>
        <Route path="/pin/new" component={CreatePin}/>
        <Route path="/pin" component={Pin}/>
      </Switch>
    );
  }
}

export default Router;
