import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from 'actions';
import {
  scrollTop,
  greyBg,
  whiteBg,
  urlLinkFormatted,
  manualNavigationUserCheck
} from 'helper-functions';

class Pin extends Component {
  constructor(props) {
    super(props);
    this.manualNavigationUserCheck = manualNavigationUserCheck.bind(this);
  }
  componentDidMount() {
    scrollTop();
    greyBg();
  }
  componentWillUnmount() {
    whiteBg();
    if (this.props.onBoard) {
      this.props.setOnBoard();
    }
  }
  removePin() {
    var user = JSON.parse(JSON.stringify(this.props.user));

    if (this.props.onBoard) {
      var board = JSON.parse(JSON.stringify(this.props.board));
      for (var l = 0; l < board.pins.length; l++) {
        if (board.pins[l]._id === this.props.pin._id) {
          board.pins.splice(l, 1);
          break;
        }
      }
      for (var m = 0; m < user.boards.length; m++) {
        if (user.boards[m]._id === board._id) {
          user.boards.splice(m, 1, board);
          break;
        }
      }
      var pinExistsInOtherBoards = false;
      for (var n = 0; n < user.boards.length; n++) {
        for (var o = 0; o < user.boards[n].pins.length; o++) {
          if (user.boards[n].pins[o]._id === this.props.pin._id) {
            pinExistsInOtherBoards = true;
            break;
          }
        }
      }
      if (!pinExistsInOtherBoards) {
        //remove pin from user/pins
        for (var p = 0; p < user.pins.length; p++) {
          if (user.pins[p]._id === this.props.pin._id) {
            user.pins.splice(p, 1);
            break;
          }
        }
        //find pin in pins, remove if user.email is only follower, remove self from followers if >1 follower
        //update user in db
      }
      fetch('http://localhost:3001/pin/remove/from-board', {
        method: "POST",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user,
          pin: this.props.pin,
          pinExistsInOtherBoards
        })
      }).then((res) => res.json()).then((json) => {
        this.props.setUser(json.userDoc);
        this.props.createRedirect(`profile/${this.props.user.email}/boards`);
      }).catch((e) => alert(`e: ${e}`));
      //update user in db

    } else {

      for (var i = 0; i < user.pins.length; i++) {
        if (user.pins[i]._id === this.props.pin._id) {
          user.pins.splice(i, 1);
          break;
        }
      }
      //user.pins is good now

      for (var j = 0; j < user.boards.length; j++) {
        for (var k = 0; k < user.boards[j].pins.length; k++) {
          if (user.boards[j].pins[k]._id === this.props.pin._id) {
            user.boards[j].pins.splice(k, 1);
            break;
          }
        }
      }
      //all user.boards.pins are good now

      fetch('http://localhost:3001/pin/remove/general', {
        method: "POST",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({user, pin: this.props.pin})
      }).then((res) => res.json()).then((json) => {
        this.props.setUser(json.userDoc);
        this.props.createRedirect(`profile/${this.props.user.email}/pins`);
      }).catch((e) => alert(`e: ${e}`));

    }
  }
  chooseBoard() {
    this.props.setPrev('pin');
    this.props.createRedirect('pin/save/choose-board');
  }
  backClick() {
    this.props.setPin();
    if (this.props.prev === 'pin') {
      this.props.createRedirect('home');
    } else {
      if (!this.props.prev) {
        this.props.createRedirect(`profile/${this.props.user.email}/boards`);
      } else {
        this.props.createRedirect(this.props.prev);
      }
    }
  }
  render() {
    if (
      this.props.redirect &&
      this.props.redirect.includes('pin/') &&
      this.props.redirect.split('/').length === 2
    ) {
      this.props.removeRedirect();
    } else if (this.props.redirect) {
      return <Redirect to={`/${this.props.redirect}`}/>
    }
    if (!this.props.user) {
      if (window.localStorage.getItem('pclUser')) {
        var email = JSON.parse(window.localStorage.pclUser).email;
        var password = JSON.parse(window.localStorage.pclUser).password;
        var path = window.location.pathname;
        var pinId = path.split('/')[path.split('/').length - 1];

        this.manualNavigationUserCheck(email, password, null, null, pinId);
        this.props.setPrev('home');

        // this.props.createRedirect('log-in');
      } else this.props.createRedirect('sign-up');
      return null;
    }
    if (!this.props.pin) {return null;}
    const commentsMapped = (comments) => {
      return comments.map((comment) => {
        return <div>comment text here!</div>
      });
    }
    const urlDisplayFormatted = (url) => {
      url = url.replace('https://', '');
      url = url.replace('http://', '');
      url = url.replace('www.', '');
      if (url.includes('/')) {
        return url.split('/')[0];
      } else return url;
    };
    const userPinIds = this.props.user.pins.map((pin) => pin._id);
    const removeButton = () => {
      if (this.props.onBoard) {
        return (
          <button onClick={this.removePin.bind(this)} className="pin-route-save-button">Remove From Board</button>
        );
      } else {
        return (
          <button onClick={this.removePin.bind(this)} className="pin-route-save-button">Remove</button>
        );
      }
    }
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
            {userPinIds.includes(this.props.pin._id) ?
              removeButton()
            :
              <button onClick={this.chooseBoard.bind(this)} className="pin-route-save-button">Save</button>
            }
          </div>
          <div className="pin-route-img-cont">
            <a href={this.props.pin.image} target="_blank">
              <img
                src={this.props.pin.image}
                width="100%"
                alt=""
                className="pin-route-img"
              />
            </a>
          </div>
          <div className="pin-route-bottom-section">
            <div className="d-flex justify-content-end pin-route-url-cont">
              <a href={urlLinkFormatted(this.props.pin.url)} target="_blank">
                <button className="pin-route-url-button">
                  {urlDisplayFormatted(this.props.pin.url)}
                </button>
              </a>
            </div>
            {this.props.pin.description ?
              <div className="pin-page-pin-desc">
                {this.props.pin.description}
              </div>
            : null}
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
    pin: state.pin,
    prev: state.prev,
    onBoard: state.onBoard,
    board: state.board
  };
}

export default connect(mapStateToProps, actions)(Pin);
