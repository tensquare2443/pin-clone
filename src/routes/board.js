import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Link} from 'react-router-dom';
import * as actions from 'actions';
import TopNav from 'components/top-nav';
import EditBoardModal from 'components/edit-board-modal';
import {
  urlDisplayFormatted,
  urlLinkFormatted,
  manualNavigationUserCheck,
  redirector
} from 'helper-functions';

class Board extends Component {
  constructor(props) {
    super(props);
    this.manualNavigationUserCheck = manualNavigationUserCheck.bind(this);
    this.redirector = redirector.bind(this);
  }
  editBoard() {
    this.props.toggleEditBoardModal('open');
  }
  redirectToPinPage(e) {
    if (e.target.dataset.id === 'outboundLinkButton') {return;}
    var pinId = e.currentTarget.dataset.id;
    var pin;

    for (var i = 0; i < this.props.board.pins.length; i++) {
      if (this.props.board.pins[i]._id === pinId) {
        pin = this.props.board.pins[i];
        break;
      }
    }

    this.props.setPin(pin);
    this.props.createRedirect(`pin/${pinId}`);
    this.props.setOnBoard(true);

  }
  addPinToBoard() {
    this.props.createRedirect('pin/new');
  }
  backToBoards() {
    // alert('back')
    this.props.createRedirect(`profile/${this.props.user.email}/boards`);
  }
  render() {
  // if (this.redirector('board/view/', null, true) !== undefined) {
  //   alert('ya')
  //   return this.redirector(`profile/${this.props.user.email}/boards`);
  // }
  // alert('ya2')
    if (this.props.redirect && this.props.redirect.includes('board/view/')) {
      this.props.removeRedirect();
    } else if (this.props.redirect) {
      return <Redirect to={`/${this.props.redirect}`}/>
    }
    if (!this.props.user) {
      if (window.localStorage.getItem('pclUser')) {
        var email = JSON.parse(window.localStorage.pclUser).email;
        var password = JSON.parse(window.localStorage.pclUser).password;
        var path = window.location.pathname;
        var boardId = path.split('/')[path.split('/').length - 1];

        this.manualNavigationUserCheck(email, password, null, boardId);
      } else {
        alert('5');
        this.props.createRedirect('sign-up');
      }
      return null;
    }

    const pinsMapped = (pins) => {
      return pins.map((pin, index) => {
        return (
          <div
            key={index}
            onClick={this.redirectToPinPage.bind(this)}
            data-id={pin._id}
            style={{
              textDecoration: 'none',
              alignContent: "flex-start",
              margin: '10px'
            }}
            className="create-cont pin-item d-flex flex-column"
          >
          <div className="content create-cont-content d-flex justify-content-center align-items-center">
            <img src={pin.image} width="100%" height="100%" style={{objectFit: 'cover', borderRadius: '8px'}} alt=""/>
          </div>
          <div className="home-item-link-btn-cont">
            <a href={urlLinkFormatted(pin.url)} target="_blank">
              <button
                data-id="outboundLinkButton"
                className="home-item-link-btn"
              >
                {urlDisplayFormatted(pin.url)}
              </button>
            </a>
          </div>
          </div>
        );
      });
    };

    var boardImg = () => {
      if (this.props.user.photo) {
        return this.props.user.photo;
      } else {
        return require('../img/profile-unknown.png');
      }
    }

    return(
      <div className="board-content">
        {this.props.editBoardModal ?
          <div className="profile-photo-modal-cont">
            <EditBoardModal/>
          </div>
        : null}
        <TopNav/>


        <div className="d-none d-sm-block">
          <div onClick={this.backToBoards.bind(this)} style={{display: 'inline-block'}}>
            <button className="back-to-boards-btn">
              {'<'} Back to boards
            </button>
          </div>
        </div>

        <div className="d-block d-sm-none">
          <div onClick={this.backToBoards.bind(this)} style={{display: 'inline-block'}}>
            <button className="back-to-boards-btn">
              {'<'} Back to boards
            </button>
          </div>
        </div>


        <div
          className="board-container-lg d-none d-sm-flex flex-row flex-wrap justify-content-between"
        >
          <div className="d-flex flex-column">
            <div className="board-title-lg">{this.props.board.name}</div>
          </div>
          <div>
            <img src={boardImg()} alt="" height="70px" className="board-home-photo" width="70px"/>
          </div>
        </div>
        <div className="board-container-sm d-flex flex-row flex-wrap d-sm-none justify-content-center align-items-center">
          <div className="d-flex flex-column" style={{padding: "20px"}}>
            <div className="board-title-sm">{this.props.board.name}</div>
          </div>
          <div style={{padding: "20px"}}>
            <img src={boardImg()} alt="" height="70px" className="board-home-photo" width="70px"/>
          </div>
        </div>
        <div className="nav-btn-cont-lg d-none d-sm-flex flex-row align-items-center justify-content-between">
          <button className="nav-button-active">Pins</button>
          <button onClick={this.editBoard.bind(this)} className="edit-board-btn">Edit Board</button>
        </div>
        <div className="nav-btn-cont-sm d-flex d-sm-none align-items-center justify-content-between">
          <button className="nav-button-active">Pins</button>
          <button onClick={this.editBoard.bind(this)} className="edit-board-btn">Edit Board</button>
        </div>

        {this.props.board.pins && this.props.board.pins.length > 0 ?
          <div className="boards-mapped-cont d-flex flex-row flex-wrap justify-content-center">
            {pinsMapped(this.props.board.pins)}
          </div>
        :
          <div>
            <div style={{paddingTop: "0px"}} className="board-container-lg d-none d-sm-block">
              <h4 style={{marginBottom: "10px", fontWeight: "normal", color: "#808080"}}>No pins yet.</h4>
              <div className="d-flex flex-row justify-content-start align-items-center">
                <img onClick={this.addPinToBoard.bind(this)} style={{marginRight: "10px", cursor: "pointer"}} src={require('../img/plus-black.png')} width="50px" alt=""/>
                <div onClick={this.addPinToBoard.bind(this)} style={{color: "#808080", cursor: "pointer"}}>Add pin</div>
              </div>
            </div>
            <div style={{paddingTop: "0px", marginLeft: "10px"}} className="board-container-sm d-block d-sm-none">
              <h4 style={{marginBottom: "10px", fontWeight: "normal", color: "#808080"}}>No pins yet.</h4>
              <div className="d-flex flex-row justify-content-start align-items-center">
                <img onClick={this.addPinToBoard.bind(this)} style={{marginRight: "10px", cursor: "pointer"}} src={require('../img/plus-black.png')} width="50px" alt=""/>
                <div onClick={this.addPinToBoard.bind(this)} style={{color: "#808080", cursor: "pointer"}}>Add pin</div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    redirect: state.redirect,
    board: state.board,
    editBoardModal: state.editBoardModal
  };
}

export default connect(mapStateToProps, actions)(Board);
