import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';

class ProfilePhotoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoInput: '',
      loader: false
    };
  }
  photoInputChange(e) {
    const photoInput = e.currentTarget.value;
    this.setState({photoInput});
  }
  removeProfilePhoto() {
    var _id = this.props.user._id;

    this.setState({photoInput: ''});
    this.setState({loader: true});
    fetch('http://localhost:3001/profile-photo/remove', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({_id})
    }).then((res) => res.json()).then((json) => {
      this.props.setUser(json.userDoc);
      this.closeProfilePhotoModal();
      this.setState({loader: false});
    }).catch((e) => {
      this.closeProfilePhotoModal();
      this.setState({loader: false});
      alert(`e: ${e}`);
    });
  }
  submitProfilePhoto(e) {
    e.preventDefault();
    var form = document.forms.namedItem('profPhotoForm');
    var formData = new FormData(form);

    formData.append('user', JSON.stringify(this.props.user));

    this.setState({photoInput: ''});
    this.setState({loader: true});

    fetch('http://localhost:3001/profile-photo/upload', {
      method: "POST",
      mode: 'cors',
      body: formData
    }).then((res) => res.json()).then((json) => {
      this.props.setUser(json.userDoc);
      this.closeProfilePhotoModal();
      this.setState({loader: false});
    }).catch((e) => {
      this.setState({loader: false});
      alert(`e: ${e}`);
    });
  }
  closeProfilePhotoModal() {
    this.props.toggleProfilePhotoModal('close');
    this.setState({photoInput: ''});
    this.setState({loader: false});
  }
  render() {
    var removePhotoBtn = () => {
      if (this.props.user.photo) {
        return(
          <button onClick={this.removeProfilePhoto.bind(this)} className="prof-photo-submit-btn">
            Remove Profile Photo
          </button>
        );
      } else return null;
    };
    var submitBtnVisibility = () => {
      if (this.state.photoInput.length > 0) {
        return {visibility: 'visible'};
      } else {
        return {visibility: 'hidden'};
      }
    };
    return(
      <div>
        <div className="prof-photo-modal">
          <div className="prof-photo-modal-top d-flex flex-row justify-content-between align-items-center">
            <div className="prof-photo-modal-title">Change Profile Photo</div>
            <div className="prof-photo-modal-close" onClick={this.closeProfilePhotoModal.bind(this)}>&#10006;</div>
          </div>

          <div className="prof-photo-modal-content">
            {this.state.loader ?
              <div className="prof-photo-loader-cont">
                <img
                  className="prof-photo-loader"
                  src={require('../img/loader.gif')}
                  width="36px"
                  height="36px"
                  alt=""
                />
              </div>
            :
              <div>
                <form name="profPhotoForm" onSubmit={this.submitProfilePhoto.bind(this)}>
                  <input
                    value={this.state.photoInput}
                    onChange={this.photoInputChange.bind(this)}
                    className="prof-photo-file-input"
                    type="file"
                    name="profileImage"
                  />
                  <button
                    style={submitBtnVisibility()}
                    className="prof-photo-submit-btn"
                    type="submit"
                  >
                    Submit Profile Photo
                  </button>
                </form>
                {removePhotoBtn()}
              </div>
            }
          </div>

        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(ProfilePhotoModal);
