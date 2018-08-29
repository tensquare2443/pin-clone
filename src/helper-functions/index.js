import React from 'react';
import {Redirect} from 'react-router-dom';

export const tdNone = {textDecoration: 'none'};

export const scrollTop = () => {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
};
export const greyBg = () => {
  document.getElementsByTagName('body')[0].style.backgroundColor = '#ECECEC';
};
export const whiteBg = () => {
  document.getElementsByTagName('body')[0].style.backgroundColor = '#fff';
};

export const urlDisplayFormatted = (url) => {
  url = url.replace('https://', '');
  url = url.replace('http://', '');
  url = url.replace('www.', '');
  if (url.includes('/')) {
    url = url.split('/')[0];
  }
  if (url.length > 20) {
    url = `${url.substr(0, 20)}...`;
  }
  return url;
}

export const urlLinkFormatted = (url) => {
  if (url.substr(0,7) !== 'http://' && url.substr(0,8) !== 'https://') {
    return `http://${url}`;
  } else return url;
};

const getPin = (pinId) => {
  var promise = new Promise((resolve, reject) => {
    return fetch('http://localhost:3001/pins/get', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({pinId})
    }).then((res) => res.json()).then((json) => {
      return resolve(json.pinDoc);
    }).catch((e) => alert(`e: ${e}`));
  });
  return promise;
};

export function manualNavigationUserCheck(email, password, loaderExists, boardId, pinId) {
  if (loaderExists) {
    if (!this.state.loader) {this.setState({loader: true});}
  }

  fetch('http://localhost:3001/user/get', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  }).then((res) => res.json()).then((json) => {
    if (loaderExists) {
      this.setState({loader: false});
    }

    if (json.error === '400') {
      //user does not exist
      return this.props.createRedirect('log-in');
    }
    this.props.setUser(json.userDoc);

    if (boardId) {
      for (var i = 0; i < json.userDoc.boards.length; i++) {
        if (json.userDoc.boards[i]._id === boardId) {
          var board = JSON.parse(JSON.stringify(json.userDoc.boards[i]));
          this.props.setBoard(board);
          break;
        }
      }
    }
    if (pinId) {
      getPin(pinId).then((pinDoc) => {
        this.props.setPin(pinDoc);
      });
    }
  }).catch((e) => {
    if (loaderExists) {
      this.setState({loader: false});
    }
    alert(`e: ${e}`);
  });
}

export function redirector(redirectPage, loaderExists, includes) {

  if (includes) {
    if (this.props.redirect && this.props.redirect.includes(redirectPage)) {
      this.props.removeRedirect();
    } else if (this.props.redirect) {
      return <Redirect to={`/${this.props.redirect}`}/>
    }
  } else {
    if (this.props.redirect === redirectPage) {
      this.props.removeRedirect();
    } else if (this.props.redirect) {
      return <Redirect to={`/${this.props.redirect}`}/>
    }
  }

  // if (this.props.redirect === redirectPage) {
  //   this.props.removeRedirect();
  // } else if (this.props.redirect) {
  //   return <Redirect to={`/${this.props.redirect}`}/>
  // }

  if (!this.props.user) {
    if (window.localStorage.pclUser) {
      if (
        JSON.parse(window.localStorage.pclUser).email &&
        JSON.parse(window.localStorage.pclUser).password
      ) {
        var email = JSON.parse(window.localStorage.pclUser).email;
        var password = JSON.parse(window.localStorage.pclUser).password;

        if (loaderExists) {
          this.manualNavigationUserCheck(email, password, loaderExists);
        } else {
          this.manualNavigationUserCheck(email, password);
        }

        return null;
      } else {
        this.props.createRedirect('log-in');
        return null;
      }
    } else {
      this.props.createRedirect('log-in');
      return null;
    }
  }
}
