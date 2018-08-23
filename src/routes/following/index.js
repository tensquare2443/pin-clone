import React, {Component} from 'react';
import {
  Redirect,
  Link,
  Route,
  Switch
} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from 'actions';
import TopNav from 'components/top-nav';
import Boards from 'routes/following/boards';
import People from 'routes/following/people';
import Recommended from 'routes/following/recommended';

class Following extends Component {
  componentWillUnmount() {
    this.props.setUsers();
  }
  getUsers() {
    fetch('http://localhost:3001/users/all', {
      method: "GET",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json()).then((json) => {
      this.props.setUsers(json.userDocs);
    }).catch((e) => alert(`e: ${e}`));
  }
  render() {
    if (this.props.redirect === 'following') {
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

    var buttonClass = (button) => {
      if (window.location.pathname.split('/')[2] === button) {
        return 'nav-button-active';
      } else {
        return 'nav-button';
      }
    };

    return(
      <div>
        <TopNav/>
        {this.props.users ?
          <div className="following-content">
            <div className="d-none d-sm-block">
              <Link onClick={() => {
                this.props.setUsers();
              }} to="/following">
                <button className="following-back-button-lg">
                  {'<'} Back to feed
                </button>
              </Link>
            </div>

            <div className="d-block d-sm-none">
              <Link onClick={() => {
                this.props.setUsers();
              }} to="/following">
                <button className="following-back-button-sm">
                  {'<'} Back to feed
                </button>
              </Link>
            </div>

            <div
              className="d-none d-sm-flex flex-row flex-wrap justify-content-between"
              style={{maxWidth: "800px", padding: "60px", paddingTop: "0px", margin: "auto"}}
            >
              <div className="d-flex flex-column">
                <div style={{fontSize: "44px", fontWeight: "bold", paddingBottom: "3px"}}>Following</div>
              </div>
              <div>
                <img src={require('../../img/profile-unknown.png')} alt="" height="70px" width="70px"/>
              </div>
            </div>
            <div className="d-flex flex-row flex-wrap d-sm-none justify-content-center align-items-center" style={{margin: "auto", padding: "10px", paddingTop: "0px"}}>
              <div className="d-flex flex-column" style={{padding: "20px", paddingTop: "0px"}}>
                <div style={{fontSize: "36px", fontWeight: "bold", paddingBottom: "3px"}}>Following</div>
              </div>
              <div style={{padding: "20px"}}>
                <img src={require('../../img/profile-unknown.png')} alt="" height="70px" width="70px"/>
              </div>
            </div>
            <div className="d-none d-sm-flex flex-row align-items-center" style={{margin: "auto", padding: "30px"}}>
              <div style={{margin: "22px"}}>
                <Link to={`/following/people`} >
                  <button className={buttonClass(`people`)}>People</button>
                </Link>
                <Link to={`/following/boards`} style={{textDecoration: "none"}}>
                  <button className={buttonClass(`boards`)}>Boards</button>
                </Link>
                <Link to={`/following/recommended`} style={{textDecoration: "none"}}>
                  <button className={buttonClass(`recommended`)}>Recommended</button>
                </Link>
              </div>
            </div>
            <div className="d-flex d-sm-none align-items-center justify-content-center" style={{margin: "auto", padding: "10px"}}>
              <div>
              <Link to={`/following/people`} >
                <button className={buttonClass(`people`)}>People</button>
              </Link>
              <Link to={`/following/boards`} style={{textDecoration: "none"}}>
                <button className={buttonClass(`boards`)}>Boards</button>
              </Link>
              <Link to={`/following/recommended`} style={{textDecoration: "none"}}>
                <button className={buttonClass(`recommended`)}>Recommended</button>
              </Link>
              </div>
            </div>
            <Switch>
              <Route path={`/following/people`} component={People}/>
              <Route path={`/following/boards`} component={Boards}/>
              <Route path={`/following/recommended`} component={Recommended}/>
            </Switch>
          </div>

          :

          <div>
            <div className="d-none d-sm-block" style={{width: '550px', margin: 'auto'}}>
              <h1>
                Follow like-minded people to see what new & original ideas they discover
              </h1>
              <Link to="/following/recommended" onClick={this.getUsers.bind(this)}>
                <button className="follow-button">
                  See who to follow
                </button>
              </Link>
            </div>
            <div className="d-block d-sm-none" style={{width: '80%', maxWidth: '300px', margin: 'auto'}}>
              <h1 style={{fontSize: '18px'}}>
                Follow like-minded people to see what new & original ideas they discover
              </h1>
              <Link to="/following/recommended" onClick={this.getUsers.bind(this)}>
                <button className="follow-button">
                  See who to follow
                </button>
              </Link>
            </div>
          </div>
        }
      </div>
    );

  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    redirect: state.redirect,
    users: state.users
  };
}

export default connect(mapStateToProps, actions)(Following);
