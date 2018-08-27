import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from 'actions';
import TopNav from 'components/top-nav';

//DONE search bar functioning
//DONE url button in board/pins
//url button in pins/pins
//follower counts in profile, and followers cards
//get rid of blank space on pins/pins
//icons in many buttons
//loading screen swirler on pin page after upload
//profile/pins start content on left side of screen
//DONE image formatting stuff
//DONE board screen
//reorganize topics by followed/unfollowed
//following/followers auto-updates on profile page
//public user profile pages
//DONE profile photos
//DONE when saving pin, from anywhere, must be added to a board
//localStorage stuff

class Home extends Component {
  createPinRedirect(e) {
    if (e.target.dataset.id === 'outboundLinkButton') {
      return;
    }
    if (e.target.innerText === 'Save') {
      var chooseBoard = true;
    }
    const _id = e.currentTarget.dataset.id;
    var pinToSet;
    this.props.allPins.forEach((pin) => {
      if (pin._id === _id) {
        pinToSet = pin;
      }
    });

    if (chooseBoard) {
      this.props.createRedirect('pin/save/choose-board');
    } else {
      this.props.createRedirect(`pin/${_id}`);
    }
    this.props.setPin(pinToSet);
    this.props.setPrev('home');
  }
  componentWillUnmount() {
    this.props.setPins();
  }
  componentDidMount() {
    if (!this.props.allPins) {
      this.getAllPins();
    }
  }

  getAllPins() {
    fetch('http://localhost:3001/pins/get', {
      method: "GET",
      mode: "cors",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json()).then((json) => {
      this.props.setPins(json.pinDocs);
    }).catch((e) => alert(`e: ${e}`));
  }

  render() {
    if (this.props.redirect === 'home') {
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

    const userPinIds = this.props.user.pins.map((pin) => pin._id);

    const pinsMapped = (pins) => {
      return pins.map((pin, index) => {
        var urlLinkFormatted = (url) => {
          if (url.substr(0,7) !== 'http://' && url.substr(0,8) !== 'https://') {
            return `http://${url}`;
          } else return url;
        };
        var urlDisplayFormatted = (url) => {
          url = url.replace('https://', '');
          url = url.replace('http://', '');
          if (url.includes('/')) {
            return url.split('/')[0];
          } else return url;
        };
        return (
          <div
            onClick={this.createPinRedirect.bind(this)}
            key={index}
            data-id={pin._id}
            className="home-item"
          >
            <div className="home-item-overlay">
              <div className="d-flex flex-row justify-content-end">

                {userPinIds.includes(pin._id) ?
                  <button disabled style={{cursor: 'default'}} className="home-item-save-button">Saved</button>
                :
                  <button
                    data-id={pin._id}
                    onClick={this.createPinRedirect.bind(this)}
                    className="home-item-save-button"
                  >
                    Save
                  </button>
                }
              </div>
            </div>
            <img className="home-item-img" src={pin.image} width="100%" alt=""/>
            <div className="home-item-link-btn-cont">
              <a
                href={urlLinkFormatted(pin.url)}
                target="_blank"
              >
                <button
                  data-id="outboundLinkButton"
                  className="home-item-link-btn"
                >
                  {urlDisplayFormatted(pin.url)}
                </button>
              </a>
            </div>
            <div className="home-item-txt">Picked for you</div>
          </div>
        );
      });
    };

    return(
      <div>
        <TopNav/>
        <div className="home-content">
          {this.props.allPins ?
            <div style={{margin: '10px 5px 10px 5px'}}>
              <div
                className="d-block d-sm-none"
                style={{
                  columnCount: 1,
                  columnGap: '10px',
                  width: "240px",
                  maxWidth: "100%",
                  margin: "auto"
                }}
              >
                {pinsMapped(this.props.allPins)}
              </div>
              <div
                className="d-none d-sm-block d-md-none"
                style={{
                  columnCount: 2,
                  columnGap: '10px',
                  width: "480px",
                  margin: "auto"
                }}
              >
                {pinsMapped(this.props.allPins)}
              </div>
              <div
                className="d-none d-md-block d-lg-none"
                style={{
                  columnCount: 3,
                  columnGap: '10px',
                  width: "720px",
                  margin: "auto"
                }}
              >
                {pinsMapped(this.props.allPins)}
              </div>
              <div
                className="d-none d-lg-block"
                style={{
                  columnCount: 4,
                  columnGap: '10px',
                  width: "960px",
                  margin: "auto"
                }}
              >
                {pinsMapped(this.props.allPins)}
              </div>
            </div>
          : <p className="no-pins-msg">No pins yet!</p>}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    redirect: state.redirect,
    user: state.user,
    allPins: state.allPins,
    prev: state.prev
  };
}

export default connect(mapStateToProps, actions)(Home);
