import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Main from 'routes/main';
import Home from 'routes/home';
import SignUp from 'routes/sign-up';
import LogIn from 'routes/log-in';
import Following from 'routes/following/index.js';
import Profile from 'routes/profile/index.js';
import Pin from 'routes/pin';
import ChooseBoard from 'routes/choose-board';
import Board from 'routes/board';
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
        <Route path="/board/view" component={Board}/>
        <Route path="/pin/save/choose-board" component={ChooseBoard}/>
        <Route path="/pin" component={Pin}/>
        <Route path="*" render={() => <Redirect to="/home"/>}/>
      </Switch>
    );
  }
}

export default Router;
