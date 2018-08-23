import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from 'actions';
import TopNav from 'components/top-nav';

class Home extends Component {
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
        return (
          <div key={index.toString()} style={{backgroundColor: "green", width: '200px'}}>
            <div>{pin.url}</div>
            <div>{pin.description}</div>
          </div>
        );
      });
    };
    //{"comments":[],"_id":"5b7ce77b0d7ead3284d9fa37","url":"dsfvdfvgd","description":"fvdsfvsf","__v":0}

    return(
      <div>
        <TopNav/>
        {this.props.allPins ?
          <div className="d-flex flex-row flex-wrap">
            {pinsMapped(this.props.allPins)}
          </div>
        : <p className="no-pins-msg">No pins yet!</p>}
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
