import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from 'actions';
import TopNav from 'components/top-nav';

class Home extends Component {
  createPinRedirect(e) {
    const _id = e.currentTarget.dataset.id;
    var pinToSet;
    this.props.allPins.forEach((pin) => {
      if (pin._id === _id) {
        pinToSet = pin;
      }
    });

    this.props.createRedirect(`pin/${_id}`);
    this.props.setPin(pinToSet);
  }
  componentWillUnmount() {
    this.props.setPins();
  }
  componentDidMount() {

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

    const pinsMapped = (pins) => {
      return pins.map((pin, index) => {
        const imgs = {
          0: 'charger',
          1: 'house',
          2: 'tall-tree'
        };
        const img = imgs[Math.floor(Math.random()*3)];
        // const urlFormatted = (url) => {
        //   url = url.replace('http://', '');
        //   url = url.replace('https://', '');
        //   url = url.replace('www.', '');
        //   return url.split('/')[0];
        // }
        return (
          <div
            onClick={this.createPinRedirect.bind(this)}
            key={index}
            data-id={pin._id}
            className="home-item"
          >
            <div className="home-item-overlay">
              <div className="d-flex flex-row justify-content-end">
                <button className="home-item-save-button">Save</button>
              </div>
            </div>
            <img className="home-item-img" src={require(`../img/samples/${img}.jpg`)} width="100%" alt=""/>
            <div className="home-item-txt">

              Picked for you
            </div>
          </div>
        );
      });
    };
    //{"comments":[],"_id":"5b7ce77b0d7ead3284d9fa37","url":"dsfvdfvgd","description":"fvdsfvsf","__v":0}

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
    allPins: state.allPins
  };
}

export default connect(mapStateToProps, actions)(Home);
