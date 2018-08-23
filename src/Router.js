import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Main from 'routes/main';
import Home from 'routes/home';
import SignUp from 'routes/sign-up';
import LogIn from 'routes/log-in';
import Following from 'routes/following/index.js';
import Profile from 'routes/profile/index.js';

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
      </Switch>
    );
  }
}

export default Router;
