import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';

class Recommended extends Component {
  render() {
    const usersMappedLg = this.props.users.map((user, index) => {
      return (
        <div className="following-rec-item-cont" key={index}>
          <div className="d-flex flex-row justify-content-between">
            <img className="following-rec-item-img" src={require('../../img/profile-unknown.png')} width="85px" height="85px" alt=""/>
            <div className="following-rec-item-top-content">
              <div className="d-flex justify-content-end" style={{fontSize: '18px', fontWeight: 'bold'}}>{user.email.split('@')[0]}</div>
              <div className="d-flex justify-content-end" style={{fontSize: '14px'}}>0 Followers</div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="rec-follow-button">
              Follow
            </button>
          </div>
        </div>
      );
    });
    return(
      <div className="following-rec-cont d-none d-sm-flex flex-row flex-wrap">
        {usersMappedLg}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users
  };
}

export default connect(mapStateToProps, actions)(Recommended);
