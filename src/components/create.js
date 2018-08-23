import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';

class Create extends Component {
  toggleModal() {
    if (this.props.modal) {
      return this.props.toggleModal();
    } else if (this.props.subtitle === 'Create Pin') {
      return this.props.toggleModal('Pin');
    } else if (this.props.subtitle === 'Create Board') {
      return this.props.toggleModal('Board');
    }
  }
  render() {
    return(
      <div onClick={this.toggleModal.bind(this)} style={{alignContent: "flex-start"}} className="create-cont d-flex flex-column">
        <div className="content create-cont-content d-flex justify-content-center align-items-center">
          <img src={require(`../img/plus-black.png`)} width="50px" height="50px" alt=""/>
        </div>
        <div className="create-subtitle">{this.props.subtitle}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal
  };
}

export default connect(mapStateToProps, actions)(Create);
