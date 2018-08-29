import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';
import {Redirect, Link} from 'react-router-dom';

class SignUp extends Component {
  componentWillUnmount() {
    this.props.signUpReset();
  }
  signUpSubmit(e) {
    e.preventDefault();

    fetch('http://localhost:3001/user/new', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: this.props.signUpForm.email.value,
        password: this.props.signUpForm.password.value,
        age: this.props.signUpForm.age.value
      })
    }).then((res) => res.json()).then((json) => {
      if (json.doc) {
        this.props.signUpValidate();
        setTimeout(() => {
          this.props.signUpReset();
          this.props.signIn(json.doc);
          window.localStorage.setItem('pclUser', json.doc);
          this.props.createRedirect('home');
        }, 1000);
      } else {
        this.props.signUpErrors(json.errors);
      }
    }).catch((e) => alert(`e: ${e}`));
  }
  render() {
    if (this.props.redirect === 'sign-up') {
      this.props.removeRedirect();
    } else if (this.props.redirect) {
      return <Redirect to={`/${this.props.redirect}`}/>
    }

    const email = this.props.signUpForm.email;
    const password = this.props.signUpForm.password;
    const age = this.props.signUpForm.age;
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
    if (age.validity === 'valid') {
      var ageClass = "form-input-valid sign-up-form-input";
    } else if (age.validity.length > 0) {
      ageClass = "form-input-invalid sign-up-form-input";
    } else {
      ageClass = "form-input sign-up-form-input";
    }
    return(
      <div className="sign-up-cont p-reg">
        <div className="sign-up-item p-reg m-reg">
          <img className="p-reg m-reg" src={require("../img/pinterest-logo.png")} width="40px" height="40px" alt=""/>
        </div>
        <div className="sign-up-item p-reg m-reg f-bold" style={{flexDirection: "column"}}>
          <div className="p-reg m-reg" style={{fontSize: "26px"}}>Sign Up for Pinterest</div>
          <div className="p-reg m-reg" style={{fontSize: "18px", color: "#b5b5b5"}}>Find new ideas to try</div>
        </div>
        <form onSubmit={this.signUpSubmit.bind(this)} className="sign-up-form">
          <div className="sign-up-form-item p-reg m-reg">
            <input onChange={this.props.signUpChange.bind(this)} value={this.props.signUpForm.email.value} className={emailClass} type="text" placeholder="Email"/>
            {email.validity.length > 0 && email.validity !== 'valid' ?
              <div className="sign-up-form-validity">{email.validity}</div>
            : null}
          </div>
          <div className="sign-up-form-item p-reg m-reg">
            <input onChange={this.props.signUpChange.bind(this)} value={this.props.signUpForm.password.value} className={passwordClass} type="password" placeholder="Password"/>
            {password.validity.length > 0 && password.validity !== 'valid' ?
              <div className="sign-up-form-validity">{password.validity}</div>
            : null}
          </div>
          <div className="sign-up-form-item p-reg m-reg">
            <input onChange={this.props.signUpChange.bind(this)} value={this.props.signUpForm.age.value} className={ageClass} type="text" placeholder="Age"/>
            {age.validity.length > 0 && age.validity !== 'valid' ?
              <div className="sign-up-form-validity">{age.validity}</div>
            : null}
            {email.validity === 'valid' && password.validity === 'valid' && age.validity === 'valid' ?
              <div className="sign-up-form-validity">Sign Up Successful!</div>
            : null}
          </div>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
              <button className="btn-main sign-up-form-btn" style={{width: "90%", maxWidth: "250px"}} type="submit">Continue</button>
              <div>OR</div>
              <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <Link to="/log-in" style={{textDecoration: "none", width: "250px", maxWidth: "250px"}}>
                  <button className="btn-sec sign-up-form-btn" style={{width: "100%", margin: "0px", cursor: "pointer"}}>
                    Log In
                  </button>
                </Link>
              </div>
          </div>
          <div className="sign-up-form-item p-reg m-reg">
            <div className="sign-up-form-txt p-reg m-reg">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    signUpForm: state.signUpForm,
    redirect: state.redirect
  };
}

export default connect(mapStateToProps, actions)(SignUp);
