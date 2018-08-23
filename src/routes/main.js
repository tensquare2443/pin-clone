import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from 'actions';

class Main extends Component {
  render() {
    return <Redirect to="/home"/>
  }
}

function mapStateToProps(state) {
  return {
    redirect: state.redirect
  };
}

export default connect(mapStateToProps, actions)(Main);
