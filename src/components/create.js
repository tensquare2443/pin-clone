import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as actions from 'actions';

class Create extends Component {
  // toggleModal() {
  //   if (this.props.modal) {
  //     return this.props.toggleModal();
  //   } else if (this.props.subtitle === 'Create Pin') {
  //     return this.props.toggleModal('Pin');
  //   } else if (this.props.subtitle === 'Create Board') {
  //     return this.props.toggleModal('Board');
  //   }
  // }
  render() {
    const linkPath = this.props.subtitle.split(' ')[1].toLowerCase();
    return(
        <Link
          to={`/${linkPath}/new`}
          style={{textDecoration: 'none', alignContent: "flex-start"}}
          className="create-cont d-flex flex-column"
        >
          <div className="content create-cont-content d-flex justify-content-center align-items-center">
            <img src={require(`../img/plus-black.png`)} width="50px" height="50px" alt=""/>
          </div>
          {/*}{this.props.subtitle === 'Create Pin' ?
            null
          :
            <div className="create-subtitle">{this.props.subtitle}</div>
          }*/}
        </Link>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    modal: state.modal
  };
}

export default connect(mapStateToProps, actions)(Create);
