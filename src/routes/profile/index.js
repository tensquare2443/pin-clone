import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';
import {Redirect, Link, Switch, Route} from 'react-router-dom';
import TopNav from 'components/top-nav';
import Boards from 'routes/profile/boards';
import Pins from 'routes/profile/pins';
import Tries from 'routes/profile/tries';
import Topics from 'routes/profile/topics';

class Profile extends Component {
  render() {
    if (this.props.redirect && this.props.redirect.includes('profile')) {
      this.props.removeRedirect();
    } else if (this.props.redirect) {
      return <Redirect to={`/${this.props.redirect}`}/>
    }
    if (!this.props.user) {
      // if (window.localStorage.getItem('pclUser')) {
        this.props.createRedirect('log-in');
      // } else this.props.createRedirect('sign-up');
      return null;
    }
    const email = this.props.user.email;
    var buttonClass = (button) => {
      if (window.location.pathname.split('/')[3] === button) {
        return 'nav-button-active';
      } else {
        return 'nav-button';
      }
    };

    return(
      <div className="profile-content">

        <TopNav/>

        <div
          className="d-none d-sm-flex flex-row flex-wrap justify-content-between"
          style={{maxWidth: "800px", padding: "60px", margin: "auto"}}
        >
          <div className="d-flex flex-column">
            <div style={{fontSize: "44px", fontWeight: "bold", paddingBottom: "3px"}}>{this.props.user.email.split('@')[0]}</div>
            <div style={{paddingTop: "3px", fontSize: "13px", fontWeight: "bold"}}>0 followers &bull; 0 following</div>
          </div>
          <div>
            <img src={require('../../img/profile-unknown.png')} alt="" height="100px" width="100px"/>
          </div>
        </div>

        <div className="d-flex flex-row flex-wrap d-sm-none justify-content-center align-items-center" style={{margin: "auto", padding: "10px"}}>
          <div className="d-flex flex-column" style={{padding: "20px"}}>
            <div style={{fontSize: "36px", fontWeight: "bold", paddingBottom: "3px"}}>{this.props.user.email.split('@')[0]}</div>
            <div style={{paddingTop: "3px", fontSize: "12px", fontWeight: "bold"}}>0 followers</div>
            <div style={{paddingTop: "3px", fontSize: "12px", fontWeight: "bold"}}>0 following</div>
          </div>
          <div style={{padding: "20px"}}>
            <img src={require('../../img/profile-unknown.png')} alt="" height="70px" width="70px"/>
          </div>
        </div>

        <div className="d-none d-sm-flex flex-row align-items-center" style={{margin: "auto", padding: "30px"}}>
          <div style={{margin: "22px"}}>
            <Link to={`/profile/${email}/boards`} >
              <button className={buttonClass(`boards`)}>Boards</button>
            </Link>
            <Link to={`/profile/${email}/pins`} style={{textDecoration: "none"}}>
              <button className={buttonClass(`pins`)}>Pins</button>
            </Link>
            <Link to={`/profile/${email}/tries`} style={{textDecoration: "none"}}>
              <button className={buttonClass(`tries`)}>Tries</button>
            </Link>
            <Link to={`/profile/${email}/topics`} style={{textDecoration: "none"}}>
              <button className={buttonClass(`topics`)}>Topics</button>
            </Link>
          </div>
        </div>

        <div className="d-flex d-sm-none align-items-center justify-content-center" style={{margin: "auto", padding: "10px"}}>
          <div>
            <Link to={`/profile/${email}/boards`} >
              <button className={buttonClass(`boards`)}>Boards</button>
            </Link>
            <Link to={`/profile/${email}/pins`} style={{textDecoration: "none"}}>
              <button className={buttonClass(`pins`)}>Pins</button>
            </Link>
            <Link to={`/profile/${email}/tries`} style={{textDecoration: "none"}}>
              <button className={buttonClass(`tries`)}>Tries</button>
            </Link>
            <Link to={`/profile/${email}/topics`} style={{textDecoration: "none"}}>
              <button className={buttonClass(`topics`)}>Topics</button>
            </Link>
          </div>
        </div>


        <Switch>
          <Route path={`/profile/${email}/boards`} component={Boards}/>
          <Route path={`/profile/${email}/pins`} component={Pins}/>
          <Route path={`/profile/${email}/tries`} component={Tries}/>
          <Route path={`/profile/${email}/topics`} component={Topics}/>
        </Switch>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    redirect: state.redirect
  };
}

export default connect(mapStateToProps, actions)(Profile);
