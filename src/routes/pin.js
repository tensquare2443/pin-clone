import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from 'actions';

class Pin extends Component {
  backClick() {
    this.props.setPin();
    this.props.createRedirect('home');
  }
  render() {
    if (this.props.redirect && this.props.redirect.includes('pin/')) {
      this.props.removeRedirect();
    } else if (this.props.redirect) {
      return <Redirect to={`/${this.props.redirect}`}/>
    }
    if (!this.props.user) {
      if (window.localStorage.getItem('pclUser')) {
        this.props.createRedirect('log-in');
      } else this.props.createRedirect('sign-up');
      return null;
    }
    const imgs = {
      0: 'charger',
      1: 'house',
      2: 'tall-tree'
    }
    const randomImg = imgs[Math.floor(Math.random()*3)];
    const commentsMapped = (comments) => {
      return comments.map((comment) => {
        <div>comment text here!</div>
      });
    }
    const urlFormatted = (url) => {
      url = url.replace('https://', '');
      url = url.replace('http://', '');
      url = url.replace('www.', '');
      if (url.includes('/')) {
        return url.split('/')[0];
      } else return url;
    };
    return(
      <div className="pin-route-outer-cont">
        <div className="pin-route-back-cont d-flex flex-row align-items-center">
          <div onClick={this.backClick.bind(this)} style={{cursor: 'pointer'}}>
            <img src={require('../img/back-arrow.png')} width="48px" alt=""/>
          </div>
          <div onClick={this.backClick.bind(this)} className="pin-route-back-txt">Back</div>
        </div>
        <div className="pin-route-cont">
          <div className="pin-route-top-section d-flex flex-row justify-content-end">
            <button className="pin-route-save-button">Save</button>
          </div>
          <div className="pin-route-img-cont">
            <img
              src={require(`../img/samples/${randomImg}.jpg`)}
              width="100%"
              alt=""
              className="pin-route-img"
            />
          </div>
          <div className="pin-route-bottom-section">
            <div className="d-flex justify-content-end pin-route-url-cont">
              <a href={this.props.pin.url} target="_blank"><button className="pin-route-url-button">{urlFormatted(this.props.pin.url)}</button></a>
            </div>
            <div className="pin-route-bottom-section-row d-flex flex-row justify-content-between align-items-center">
              <h3>Comments</h3>
              <div><img src={require('../img/down-arrow.png')} width="36px" alt=""/></div>
            </div>
            <div>
              {this.props.pin.comments && this.props.pin.comments.length > 0 ?
                {commentsMapped}
              : <div style={{margin: '8px'}}>No comments yet</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    redirect: state.redirect,
    user: state.user,
    pin: state.pin
  };
}

export default connect(mapStateToProps, actions)(Pin);
