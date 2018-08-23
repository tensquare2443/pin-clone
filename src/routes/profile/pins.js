import React, {Component} from 'react';
import {connect} from 'react-redux';
import Create from 'components/create';
import * as actions from 'actions';
import CreatePinModal from 'components/create-pin-modal';

class Pins extends Component {
  render() {
    return(
      <div>
        <Create subtitle="Create Pin"/>
        {this.props.modal === 'Pin' ?
          <CreatePinModal/>
        : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal
  };
}

export default connect(mapStateToProps, actions)(Pins);
