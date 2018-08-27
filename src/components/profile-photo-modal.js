import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';

class ProfilePhotoModal extends Component {
  submitProfilePhoto(e) {
    e.preventDefault();
    var form = document.forms.namedItem('profPhotoForm');
    var formData = new FormData(form);

    formData.append('user', JSON.stringify(this.props.user));

    fetch('http://localhost:3001/profile-photo/upload', {
      method: "POST",
      mode: 'cors',
      body: formData
    }).then((res) => res.json()).then((json) => {
      this.props.setUser(json.userDoc);
      this.closeProfilePhotoModal();
    }).catch((e) => alert(`e: ${e}`));
  }
  closeProfilePhotoModal() {
    this.props.toggleProfilePhotoModal('close');
  }
  render() {
    return(
      <div>
        <div className="prof-photo-modal">
          <div className="prof-photo-modal-top d-flex flex-row justify-content-between align-items-center">
            <div className="prof-photo-modal-title">Change Profile Photo</div>
            <div className="prof-photo-modal-close" onClick={this.closeProfilePhotoModal.bind(this)}>&#10006;</div>
          </div>
          <div className="prof-photo-modal-content">
            <form name="profPhotoForm" onSubmit={this.submitProfilePhoto.bind(this)}>
              <input className="prof-photo-file-input" type="file" name="profileImage"/>
              <button className="prof-photo-submit-btn" type="submit">Submit</button>
            </form>
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
