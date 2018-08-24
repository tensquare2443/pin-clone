import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from 'actions';

class CreatePin extends Component {
  backClick() {
    this.props.createRedirect(`profile/${this.props.user.email}/pins`);
  }
  componentDidMount() {
    document.getElementsByTagName('body')[0].style.backgroundColor = '#ECECEC';
  }
  componentWillUnmount() {
    this.props.createPinFormChange();
    document.getElementsByTagName('body')[0].style.backgroundColor = '#fff';
  }
  changeForm(e) {
    var createPinForm = JSON.parse(JSON.stringify(this.props.createPinForm));
    const input = e.currentTarget.getAttribute('name');
    const value = e.currentTarget.value;

    createPinForm[input].value = value;

    this.props.createPinFormChange(createPinForm);
  }
  formSubmit(e) {
    e.preventDefault();
    var form = document.forms.namedItem('pinForm');
    var pinFormData = new FormData(form);

    pinFormData.append('user', JSON.stringify(this.props.user));

    fetch('http://localhost:3001/pins/new', {
      method: 'POST',
      mode: 'cors',
      body: pinFormData
    }).then((res) => res.json()).then((json) => {
      alert(JSON.stringify(json))

      if (
        !json.response &&
        !json.response.url &&
        !json.response.description &&
        !json.response.image
      ) {
        //all good, sent to db, user updated
        alert('all good');
        //update user state
        alert(json.response.userDoc);
        //remove modal
        //remove form values

      } else {
        var errors = ['Errors\n'];
        Object.keys(json.response).forEach((field) => {
          if (json.response[field]) {
            //error exists
            json.response[field] = json.response[field].replace('Error: ', '');
            errors.push(`${field}: ${json.response[field]}\n`);
          }
        });
        errors = errors.join('');
        alert(errors);
      }

    }).catch((e) => alert(`e: ${e}`));
  }

  render() {
    if (this.props.redirect === 'pin/new') {
      this.props.removeRedirect();
    } else if (this.props.redirect) {
      return <Redirect to={`/${this.props.redirect}`}/>
    }
    if (!this.props.user) {
      if (window.localStorage.getItem('pclUser')) {
        this.props.createRedirect('log-in');
      } else {
        this.props.createRedirect('sign-up');
      }
      return null;
    }
    return(
      <div className="pin-route-outer-cont">
        <div className="pin-route-back-cont d-flex flex-row align-items-center">
          <div onClick={this.backClick.bind(this)} style={{cursor: 'pointer'}}>
            <img src={require('../img/back-arrow.png')} width="48px" alt=""/>
          </div>
          <div onClick={this.backClick.bind(this)} className="pin-route-back-txt">Back</div>
        </div>
          <div className="create-pin-inner-cont">
            <div
              className="create-pin-top-cont f-bold d-flex justify-content-center align-items-center"
            >
              <div className="m-reg p-reg">Create Pin</div>
            </div>
            <form name="pinForm" onSubmit={this.formSubmit.bind(this)}>
              <div className="d-none d-sm-flex flex-row">
                <div className="p-reg m-reg">
                  <input
                    onChange={this.changeForm.bind(this)}
                    className="p-reg m-reg"
                    name="image"
                    type="file"
                  />
                </div>
                <div style={{width: "100%", padding: "5px"}}>
                  <div>
                    <div className="m-reg p-reg">Website</div>
                    <input
                      value={this.props.createPinForm.url.value}
                      onChange={this.changeForm.bind(this)}
                      className="create-pin-input m-reg p-reg"
                      name="url"
                      type="text"
                      placeholder="Add the URL this Pin links to"
                    />
                  </div>
                  <div>
                    <div className="m-reg p-reg">Description</div>
                    <textarea
                      value={this.props.createPinForm.description.value}
                      onChange={this.changeForm.bind(this)}
                      className="create-pin-desc-input m-reg p-reg"
                      name="description"
                      type="text"
                      placeholder="Say more about this Pin"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex d-sm-none flex-column">
                <div className="p-reg m-reg" style={{width: "95%"}}>
                  <input
                    onChange={this.changeForm.bind(this)}
                    name="image"
                    className="p-reg m-reg"
                    type="file"
                  />
                </div>
                <div style={{width: "100%", padding: "5px"}}>
                  <div className="m-reg p-reg">
                    <div>Website</div>
                    <input
                      value={this.props.createPinForm.url.value}
                      onChange={this.changeForm.bind(this)}
                      className="create-pin-input"
                      name="url"
                      type="text"
                      placeholder="Add the URL this Pin links to"
                    />
                  </div>
                  <div className="m-reg p-reg">
                    <div>Description</div>
                    <textarea
                      value={this.props.createPinForm.description.value}
                      onChange={this.changeForm.bind(this)}
                      className="create-pin-input"
                      name="description"
                      placeholder="Say more about this Pin"
                    />
                  </div>
                </div>
              </div>
              <div style={{borderTop: "1px solid #ECECEC"}}>
                <div
                  style={{margin: "5px", padding: "5px"}}
                  className="d-flex justify-content-end align-items-center"
                >
                  <button className="btn-sec" type="submit">
                    Done
                  </button>
                </div>
              </div>
            </form>
          </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    createPinForm: state.createPinForm,
    user: state.user,
    redirect: state.redirect
  };
}

export default connect(mapStateToProps, actions)(CreatePin);
