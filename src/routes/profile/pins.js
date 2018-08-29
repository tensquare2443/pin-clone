import React, {Component} from 'react';
import {connect} from 'react-redux';
import Create from 'components/create';
import * as actions from 'actions';
import {encode} from 'base64-arraybuffer';
import {
  urlDisplayFormatted,
  urlLinkFormatted,
  manualNavigationUserCheck,
  redirector
} from 'helper-functions';

class Pins extends Component {
  constructor(props) {
    super(props);
    this.manualNavigationUserCheck = manualNavigationUserCheck.bind(this);
    this.redirector = redirector.bind(this);
  }
  createPinRedirect(e) {
    if (e.target.dataset.id === 'outboundLinkButton') {
      return;
    }
    const _id = e.currentTarget.dataset.id;
    var pinToSet;

    this.props.user.pins.forEach((pin) => {
      if (pin._id === _id) {
        pinToSet = pin;
      }
    });

    this.props.createRedirect(`pin/${_id}`);
    this.props.setPin(pinToSet);
    this.props.setPrev(`profile/${this.props.user.email}/pins`);
  }
  render() {
    // if (this.redirector(`profile/${this.props.user.email}/pins`) !== undefined) {
    //   return this.redirector(`profile/${this.props.user.email}/pins`);
    // }
    const pinsMapped = this.props.user.pins.map((pin, index) => {
      return (
        <div
          key={index}
          onClick={this.createPinRedirect.bind(this)}
          data-id={pin._id}
          style={{
            textDecoration: 'none',
            alignContent: "flex-start",
            margin: '10px'
          }}
          className="create-cont pin-item d-flex flex-column"
        >
          <div className="content create-cont-content d-flex justify-content-center align-items-center">
            <img style={{borderRadius: '8px'}} src={pin.image} className="pins-content-pin-img" width="100%" height="100%" alt=""/>
          </div>

          <div className="home-item-link-btn-cont">
            <a data-id="outboundLink" href={urlLinkFormatted(pin.url)} target="_blank">
              <button
                data-id="outboundLinkButton"
                className="home-item-link-btn"
              >
                {urlDisplayFormatted(pin.url)}
              </button>
            </a>
          </div>

        </div>
      );
    });
    if (this.props.user.pins && this.props.user.pins.length > 0) {
      return(
        <div className="pins-content">
          <div className="boards-mapped-cont d-flex flex-row flex-wrap justify-content-center">
            <Create subtitle="Create Pin" style={{margin: '10px'}}/>
            {pinsMapped}
          </div>
        </div>
      );
    } else {
      return(
        <div className="pins-content">
          <div style={{marginLeft: '50px'}} className="boards-mapped-cont d-none d-sm-flex flex-row flex-wrap justify-content-start">
            <Create subtitle="Create Pin" style={{margin: '10px'}}/>
          </div>
          <div className="boards-mapped-cont d-flex d-sm-none flex-row flex-wrap justify-content-start">
            <Create subtitle="Create Pin" style={{margin: '10px'}}/>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal,
    user: state.user,
    prev: state.prev
  };
}

export default connect(mapStateToProps, actions)(Pins);
