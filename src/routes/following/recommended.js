import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';

class Recommended extends Component {
  unfollowUser(e) {
    var userEmailToUnfollow = e.currentTarget.dataset.id;
    var user = JSON.parse(JSON.stringify(this.props.user));

    if (user.usersFollowing.includes(userEmailToUnfollow)) {
      user.usersFollowing.splice(user.usersFollowing.indexOf(userEmailToUnfollow), 1);
    }

    fetch('http://localhost:3001/user/unfollow', {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userEmailToUnfollow,
        newUserDoc: user
      })
    }).then((res) => res.json()).then((json) => {
      this.props.setUser(json.userDoc);
    }).catch((e) => alert(`e: ${e}`));
  }
  followUser(e) {
    var userEmail = e.currentTarget.dataset.id;
    var user = JSON.parse(JSON.stringify(this.props.user));
    if (user.usersFollowing) {
      user.usersFollowing.push(userEmail);
    } else {
      user.usersFollowing = [userEmail];
    }


    fetch('http://localhost:3001/user/follow', {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToFollow: userEmail,
        newUserDoc: user
      })
    }).then((res) => res.json()).then((json) => {
      this.props.setUser(json.userDoc);
    }).catch((e) => alert(`e: ${e}`));
  }
  render() {
    const usersMappedLg = this.props.users.map((user, index) => {
      var profileImg = () => {
        if (user.photo) {
            return user.photo;
        } else {
          return require('../../img/profile-unknown.png');
        }
      }
      if (user.email !== this.props.user.email) {
        return (
          <div className="following-rec-item-cont" key={index}>
            <div className="d-flex flex-row justify-content-between">
              <img
                className="following-rec-item-img"
                src={profileImg()}
                width="85px"
                height="85px"
                alt=""
              />
              <div className="following-rec-item-top-content">
                <div className="d-flex justify-content-end" style={{fontSize: '18px', fontWeight: 'bold'}}>{user.email.split('@')[0]}</div>
                <div className="d-flex justify-content-end" style={{fontSize: '14px'}}>0 Followers</div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              {this.props.user.usersFollowing && this.props.user.usersFollowing.includes(user.email) ?
                <button
                  className="rec-follow-button"
                  onClick={this.unfollowUser.bind(this)}
                  data-id={user.email}
                >
                  Unfollow
                </button>
              :
                <button
                  className="rec-follow-button"
                  onClick={this.followUser.bind(this)}
                  data-id={user.email}
                >
                  Follow
                </button>
              }
            </div>
          </div>
        );
      } else return null;

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
    users: state.users,
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(Recommended);
