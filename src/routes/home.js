import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from 'actions';
import TopNav from 'components/top-nav';
import {
  urlDisplayFormatted,
  urlLinkFormatted,
  manualNavigationUserCheck,
  redirector,
  scrollTop
} from 'helper-functions';

//localStorage stuff

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false
    };
    this.manualNavigationUserCheck = manualNavigationUserCheck.bind(this);
    this.redirector = redirector.bind(this);
  }
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
    if (this.redirector('home', true) !== undefined) {
      return this.redirector('home');
    }

    const userPinIds = this.props.user.pins.map((pin) => pin._id);
    const pinsMapped = (pins, screenSize) => {
      return pins.map((pin, index) => {
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

    const pinContent = () => {
      if (this.state.loader) {
        return (
          <div className="home-loader-cont">
            <img
              src={require('../img/loader.gif')}
              className="home-loader"
              alt=""
              width="36px"
              height="36px"
            />
          </div>
        );
      } else if (this.props.allPins) {
        return(
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
              {pinsMapped(this.props.allPins, 'sm')}
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
              className="d-none d-lg-block d-xl-none"
              style={{
                columnCount: 4,
                columnGap: '10px',
                width: "960px",
                margin: "auto"
              }}
            >
              {pinsMapped(this.props.allPins)}
            </div>
            <div
              className="d-none d-xl-block d-xxl-none"
              style={{
                columnCount: 5,
                columnGap: '10px',
                width: "1200px",
                margin: "auto"
              }}
            >
              {pinsMapped(this.props.allPins)}
            </div>
            <div
              className="d-none d-xxl-block"
              style={{
                columnCount: 6,
                columnGap: '10px',
                width: "1440px",
                margin: "auto"
              }}
            >
              {pinsMapped(this.props.allPins)}
            </div>
          </div>
        );
      } else {
        return (
          <p className="no-pins-msg">No pins yet!</p>
        );
      }
    }

    return(
      <div>
        <TopNav/>
        <div className="home-content">
          {pinContent()}
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
