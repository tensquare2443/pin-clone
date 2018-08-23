import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as actions from 'actions';

class Boards extends Component {
  render() {
    if (!this.props.user.boardsFollowing || this.props.user.boardsFollowing.length === 0) {
      return(
        <div>
          <div className="following-people-cont-lg">
            <div className="d-none d-sm-flex flex-column">
              <p className="following-people-title-lg">You{"'"}re not following any boards!</p>
              <Link to="/following/recommended" style={{textDecoration: 'none'}}>
                <button className="following-people-button-lg">
                  Find people to follow
                </button>
              </Link>
            </div>
          </div>
          <div className="following-people-cont-sm">
            <div className="d-flex flex-column flex-wrap d-sm-none">
              <p className="following-people-title-sm">You{"'"}re not following any boards!</p>
              <Link to="/following/recommended" style={{textDecoration: 'none'}}>
                <button className="following-people-button-sm">
                  Find people to follow
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
    } else return null;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(Boards);
