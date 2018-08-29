import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as actions from 'actions';
import {
  redirector,
  manualNavigationUserCheck
} from 'helper-functions';

class People extends Component {
  constructor(props) {
    super(props);
    this.manualNavigationUserCheck = manualNavigationUserCheck.bind(this);
    this.redirector = redirector.bind(this);
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
  componentDidMount() {
    if (
      this.props.user.usersFollowing &&
      this.props.user.usersFollowing.length > 0
    ) {
      fetch('http://localhost:3001/users/following', {
        method: "POST",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usersFollowing: this.props.user.usersFollowing
        })
      }).then((res) => res.json()).then((json) => {
        this.props.setUsersFollowing(json.userDocs);
      }).catch((e) => alert(`e: ${e}`));
    }
  }
  componentWillUnmount() {
    this.props.setUsersFollowing();
  }
  render() {
    if (this.redirector('following/people') !== undefined) {
      return this.redirector('following/people');
    }
    if (this.props.usersFollowing) {
      const followers = (length) => {
        if (length === 1) {
          return `${length} Follower`;
        } else return `${length} Followers`;
      }
      var profileImg = (user) => {
        if (user.photo) {
            return user.photo;
        } else {
          return require('../../img/profile-unknown.png');
        }
      }
      const usersMappedLg = this.props.usersFollowing.map((user, index) => {
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
      });

      const usersMappedSm = this.props.usersFollowing.map((user, index) => {
        return(
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
      });

      return (
        <div>
          <div className="following-rec-cont-sm d-block d-sm-none">
            {usersMappedSm}
          </div>
          <div className="following-rec-cont-lg d-none d-sm-flex flex-row flex-wrap">
            {usersMappedLg}
          </div>
        </div>
      )



    } else if (!this.props.user.following || this.props.user.following.length === 0) {
      return(
        <div>
          <div className="following-people-cont-lg">
            <div className="d-none d-sm-flex flex-column">
              <p className="following-people-title-lg">You{"'"}re not following any users!</p>
              <Link to="/following/recommended" style={{textDecoration: 'none'}}>
                <button className="following-people-button-lg">
                  Find people to follow
                </button>
              </Link>
            </div>
          </div>
          <div className="following-people-cont-sm">
            <div className="d-flex flex-column flex-wrap d-sm-none">
              <p className="following-people-title-sm">You{"'"}re not following any users!</p>
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
    user: state.user,
    usersFollowing: state.usersFollowing
  };
}

export default connect(mapStateToProps, actions)(People);
