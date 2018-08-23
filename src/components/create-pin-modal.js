import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';

class CreatePinModal extends Component {

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
    const outerContStyling = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%'
    };
    const innerContStyling = {
      backgroundColor: "white",
      border: '1px solid #ECECEC',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '800px',
      margin: 'auto',
      marginTop: '20px'
    };
    const topContStyling = {
      padding: '10px',
      borderBottom: "1px solid #ECECEC",
      fontSize: "24px"
    };
    const inputStyling = {
      width: "87%",
      border: "1px solid grey",
      borderRadius: '4px',
      padding: '10px'
    };
    const descInputStyling = {
      width: "87%",
      height: '150px',
      fontFamily: "Arial",
      border: "1px solid grey",
      borderRadius: '4px',
      padding: '10px'
    };
    return(
      <div className="d-flex justify-content-center" style={outerContStyling}>
        <div style={innerContStyling}>
          <div
            className="f-bold d-flex justify-content-center align-items-center"
            style={topContStyling}
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
                    className="m-reg p-reg"
                    name="url"
                    style={inputStyling}
                    type="text"
                    placeholder="Add the URL this Pin links to"
                  />
                </div>
                <div>
                  <div className="m-reg p-reg">Description</div>
                  <textarea
                    value={this.props.createPinForm.description.value}
                    onChange={this.changeForm.bind(this)}
                    className="m-reg p-reg"
                    name="description"
                    style={descInputStyling}
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
                    style={inputStyling}
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
                    style={inputStyling}
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
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(CreatePinModal);
