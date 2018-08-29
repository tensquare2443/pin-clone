import React, {Component} from 'react';
import Create from 'components/create';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as actions from 'actions';
import {
  manualNavigationUserCheck,
  redirector
} from 'helper-functions';

class Boards extends Component {
  constructor(props) {
    super(props);
    this.manualNavigationUserCheck = manualNavigationUserCheck.bind(this);
    this.redirector = redirector.bind(this);
  }
  redirectToBoard(e) {
    const _id = e.currentTarget.dataset.id;
    var boardToSet;
    var boards = this.props.user.boards;
    for (var i = 0; i < boards.length; i++) {
      if (boards[i]._id === _id) {
        boardToSet = JSON.parse(JSON.stringify(boards[i]));
        break;
      }
    }

    this.props.createRedirect(`board/view/${_id}`);
    this.props.setBoard(boardToSet);
  }
  render() {
    // if (this.redirector(`profile/${this.props.user.email}/boards`) !== undefined) {
    //   return this.redirector(`profile/${this.props.user.email}/boards`);
    // }
    const boardsMapped = this.props.user.boards.map((board, index) => {
      var pinsSection = (length) => {
        if (length === 0) {
          return (
            <div className="create-sub-subtitle">0 Pins</div>
          );
        } else if (length === 1) {
          return (
            <div className="create-sub-subtitle">{board.pins.length} Pin</div>
          );
        } else {
          return (
            <div className="create-sub-subtitle">{board.pins.length} Pins</div>
          );
        }
      };
      var boardPinImg = (pins) => {
        if (pins.length > 0 && pins[pins.length - 1].image) {
          return (
            <img src={pins[pins.length - 1].image} width="100%" height="100%" className="boards-mapped-board-img" alt=""/>
          );
        } else return null;
      }
      return (
        <div
          onClick={this.redirectToBoard.bind(this)}
          data-id={board._id}
          key={index}
          style={{
            alignContent: "flex-start",
            margin: '10px'
          }}
          className="create-cont board-item d-flex flex-column"
        >
          <div className="content create-cont-content d-flex justify-content-center align-items-center">
            {boardPinImg(board.pins)}
          </div>
          <div className="create-subtitle">{board.name}</div>
          {pinsSection(board.pins.length)}
        </div>
      );
    });
    if (this.props.user.boards && this.props.user.boards.length > 0) {
      return(
        <div>
          <div className="boards-mapped-cont d-flex flex-row flex-wrap justify-content-center">
            <Create subtitle="Create Board" style={{margin: '10px'}}/>
            {boardsMapped}
          </div>
        </div>
      );
    } else {
      return(
        <div>
          <div style={{marginLeft: '50px'}} className="boards-mapped-cont d-none d-sm-flex flex-row flex-wrap justify-content-start">
            <Create subtitle="Create Board" style={{margin: '10px'}}/>
          </div>
          <div className="boards-mapped-cont d-flex d-sm-none flex-row flex-wrap justify-content-start">
            <Create subtitle="Create Board" style={{margin: '10px'}}/>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(Boards);
