import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';
import {
  redirector,
  manualNavigationUserCheck
} from 'helper-functions';

class Recommended extends Component {
  constructor(props) {
    super(props);
    this.redirector = redirector.bind(this);
    this.manualNavigationUserCheck = manualNavigationUserCheck.bind(this);
  }
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

      fetch('http://localhost:3001/users/all', {
        method: "GET",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json()).then((json) => {
        this.props.setUsers(json.userDocs);
      }).catch((e) => alert(`e: ${e}`));
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

      //get users
      fetch('http://localhost:3001/users/all', {
        method: "GET",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json()).then((json) => {
        this.props.setUsers(json.userDocs);
      }).catch((e) => alert(`e: ${e}`));

    }).catch((e) => alert(`e: ${e}`));
  }
  render() {
    if (this.redirector('following/recommended') !== undefined) {
      return this.redirector('following/recommended');
    }
    var followers = (length) => {
      if (length === 1) {
        return `${length} Follower`;
      } else return `${length} Followers`;
    };
    var profileImg = (user) => {
      if (user.photo) {
          return user.photo;
      } else {
        return require('../../img/profile-unknown.png');
      }
    };
    const usersMappedLg = this.props.users.map((user, index) => {
      if (user.email !== this.props.user.email) {
        return (
          <div className="following-rec-item-cont" key={index}>
            <div className="d-flex flex-row justify-content-between">
              <img
                className="following-rec-item-img"
                src={profileImg(user)}
                width="85px"
                height="85px"
                alt=""
              />
              <div className="following-rec-item-top-content">
                <div className="d-flex justify-content-end" style={{fontSize: '18px', fontWeight: 'bold'}}>{user.email.split('@')[0]}</div>
                <div className="d-flex justify-content-end" style={{fontSize: '14px'}}>{followers(user.followedBy.length)}</div>
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

    const usersMappedSm = this.props.users.map((user, index) => {
      if (user.email !== this.props.user.email) {
        return (
          <div className="following-rec-item-cont" key={index}>
            <div className="d-flex flex-row justify-content-between">
              <img
                className="following-rec-item-img"
                src={profileImg(user)}
                width="60px"
                height="60px"
                alt=""
              />
              <div className="following-rec-item-top-content">
                <div className="d-flex justify-content-end" style={{fontSize: '18px', fontWeight: 'bold'}}>{user.email.split('@')[0]}</div>
                <div className="d-flex justify-content-end" style={{fontSize: '14px'}}>{followers(user.followedBy.length)}</div>
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
      <div>
        <div className="following-rec-cont-sm d-block d-sm-none">
          {usersMappedSm}
        </div>
        <div className="following-rec-cont-lg d-none d-sm-flex flex-row flex-wrap">
          {usersMappedLg}
        </div>
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
