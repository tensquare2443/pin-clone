import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';
import {Redirect, Link} from 'react-router-dom';

class LogIn extends Component {
  componentWillUnmount() {
    this.props.logInFormReset();
  }
  demoLogin() {
    fetch('http://localhost:3001/user/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'jeff@gmail.com',
        password: 'ADSASD##D#'
      })
    }).then((res) => res.json()).then((json) => {
      this.props.logInFormReset();
      this.props.signIn(json.userDoc);
      this.props.createRedirect('home');
      window.localStorage.setItem('pclUser', JSON.stringify(json.userDoc));
      return;
    }).catch((e) => {
      alert(`demo error: ${e}`);
    });
  }
  logInSubmit(e) {
    e.preventDefault();
    var logInForm = JSON.parse(JSON.stringify(this.props.logInForm));
    //check database for credentials
    if (logInForm.email.value.length === 0) {
      logInForm.email.validity = '';
      logInForm.password.validity = '';
      this.props.logInFormChange(logInForm);
      return alert('Please enter an email');
    } else if (logInForm.password.value.length === 0) {
      logInForm.email.validity = '';
      logInForm.password.validity = '';
      this.props.logInFormChange(logInForm);
      return alert('Please enter a password');
    }
    fetch('http://localhost:3001/user/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.props.logInForm.email.value,
        password: this.props.logInForm.password.value
      })
    }).then((res) => res.json()).then((json) => {
      if (json.server_error) {
        alert(json.server_error);
        return;
      }
      if (json.email_error) {
        logInForm.email.validity = json.email_error;
        logInForm.password.validity = '';
        this.props.logInFormChange(logInForm);
        return;
      }
      if (json.password_error) {
        logInForm.email.validity = '';
        logInForm.password.validity = json.password_error;
        this.props.logInFormChange(logInForm);
        return;
      }

      this.props.logInFormReset();
      // window.localStorage.setItem('pclUser', json.userDoc);
      this.props.signIn(json.userDoc);
      this.props.createRedirect('home');
      return;
    }).catch((e) => {
      alert(`e: ${e}`);
    });
    //if success, change loginForm state back to blanks, change user, change localStorage,
  }
  render() {
    if (this.props.redirect === 'log-in') {
      this.props.removeRedirect();
    } else if (this.props.redirect) {
      return <Redirect to={`/${this.props.redirect}`}/>
    }

    const email = this.props.logInForm.email;
    const password = this.props.logInForm.password;
    if (email.validity === 'valid') {
      var emailClass = "form-input-valid sign-up-form-input";
    } else if (email.validity.length > 0) {
      emailClass = "form-input-invalid sign-up-form-input";
    } else {
      emailClass = "form-input sign-up-form-input";
    }
    if (password.validity === 'valid') {
      var passwordClass = "form-input-valid sign-up-form-input";
    } else if (password.validity.length > 0) {
      passwordClass = "form-input-invalid sign-up-form-input";
    } else {
      passwordClass = "form-input sign-up-form-input";
    }

    return(
      <div className="sign-up-cont p-reg">
        <div className="sign-up-item p-reg m-reg">
          <img className="p-reg m-reg" src={require("../img/pinterest-logo.png")} width="40px" height="40px" alt=""/>
        </div>
        <div className="sign-up-item p-reg m-reg f-bold" style={{flexDirection: "column"}}>
          <div className="p-reg m-reg" style={{fontSize: "26px"}}>Welcome back!</div>
          <div className="p-reg m-reg" style={{fontSize: "26px"}}>Log in now</div>
          <div className="p-reg m-reg" style={{fontSize: "14px"}}>Access Pinterest{"'"}s best ideas with a free account</div>
        </div>
        <form onSubmit={this.logInSubmit.bind(this)} className="sign-up-form">
          <div className="sign-up-form-item p-reg m-reg">
            <input onChange={(e) => {
              var logInForm = JSON.parse(JSON.stringify(this.props.logInForm));
              logInForm.email.value = e.currentTarget.value;
              this.props.logInFormChange(logInForm);
            }} value={this.props.logInForm.email.value} className={emailClass} type="text" placeholder="Email"/>
            {email.validity.length > 0 && email.validity !== 'valid' ?
              <div className="sign-up-form-validity">{email.validity}</div>
            : null}
          </div>
          <div className="sign-up-form-item p-reg m-reg">
            <input onChange={(e) => {
              var logInForm = JSON.parse(JSON.stringify(this.props.logInForm));
              logInForm.password.value = e.currentTarget.value;
              this.props.logInFormChange(logInForm);
            }} value={this.props.logInForm.password.value} className={passwordClass} type="password" placeholder="Password"/>
            {password.validity.length > 0 && password.validity !== 'valid' ?
              <div className="sign-up-form-validity">{password.validity}</div>
            : null}
          </div>
          <div className="sign-up-form-item p-reg m-reg">
            <button className="btn-main sign-up-form-btn" type="submit">Log in</button>
          </div>
          <div className="sign-up-form-item p-reg m-reg">
            <div className="sign-up-form-txt p-reg m-reg">
              <Link to="/sign-up">Not on Pinterest yet? Sign up</Link>
            </div>
          </div>
        </form>
        <div className="sign-up-form-item p-reg m-reg">
          <button onClick={this.demoLogin.bind(this)} className="btn-main sign-up-form-btn demo-log-in-btn" type="submit">Free Demo</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    logInForm: state.logInForm,
    redirect: state.redirect
  };
}

export default connect(mapStateToProps, actions)(LogIn);
