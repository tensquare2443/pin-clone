import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';

class EditBoardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardNameInput: ''
    }
  }
  componentDidMount() {
    this.setState({boardNameInput: this.props.board.name});
  }
  changeNameInput(e) {
    const boardNameInput = e.currentTarget.value;

    this.setState({boardNameInput});
  }
  submitEditBoard(e) {
    e.preventDefault();
    if (this.state.boardNameInput.length === 0) {
      return alert('Please enter a board name!');
    }
    var boardId = this.props.board._id;
    var newBoard;
    var user = JSON.parse(JSON.stringify(this.props.user));

    for (var i = 0; i < user.boards.length; i++) {
      if (user.boards[i]._id === boardId) {
        user.boards[i].name = this.state.boardNameInput;
        newBoard = JSON.parse(JSON.stringify(user.boards[i]));
        break;
      }
    }

    //send user
    fetch('http://localhost:3001/user/update', {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user})
    }).then((res) => res.json()).then((json) => {
      this.props.setUser(json.userDoc);
      this.props.setBoard(newBoard);
      this.props.toggleEditBoardModal('close');
    }).catch((e) => alert(`e: ${e}`));

  }
  deleteBoard() {
    var boardId = this.props.board._id;
    var user = JSON.parse(JSON.stringify(this.props.user));
    var deletedBoardPins = JSON.parse(JSON.stringify(this.props.board.pins));

    for (var i = 0; i < user.boards.length; i++) {
      if (user.boards[i]._id === boardId) {
        user.boards.splice(i, 1);
        break;
      }
    }

    var allPinsToCheck = [];
    for (var j = 0; j < user.boards.length; j++) {
      for (var k = 0; k < user.boards[j].pins.length; k++) {
        allPinsToCheck.push(user.boards[j].pins[k]);
      }
    }

    var pinsToDelete = [];
    for (var l = 0; l < deletedBoardPins.length; l++) {
      var anotherCopy = false;
      for (var m = 0; m < allPinsToCheck.length; m++) {
        if (allPinsToCheck[m]._id === deletedBoardPins[l]._id) {
          anotherCopy = true;
          break;
        }
      }
      if (!anotherCopy) {
        pinsToDelete.push(deletedBoardPins[l]);
      }
    }
    pinsToDelete = pinsToDelete.map((pin) => pin._id);

    var updatedUserPins = [];
    if (pinsToDelete.length > 0) {
      //there was only one instance of this pin, and it was on the baord being deleted now. so now delete these in the user obj.
      user.pins.forEach((pin) => {
        if (!pinsToDelete.includes(pin._id)) {
          updatedUserPins.push(pin);
        }
      });
      user.pins = JSON.parse(JSON.stringify(updatedUserPins));

      fetch('http://localhost:3001/user/update-and-check-pins-collection', {
        method: "POST",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user,
          pinsToDelete
        })
      }).then((res) => res.json()).then((json) => {
        this.props.setUser(json.userDoc);
        this.props.createRedirect(`profile/${this.props.user.email}/boards`);
        this.props.setBoard();
        this.props.toggleEditBoardModal('close');
      }).catch((e) => alert(`e: ${e}`));

      //go to db, update user obj, then do the follower cut thing on the Pins
    } else {
      //every pin being deleted off this board exists on a different board of same user, so no need to delete from pins db.
      fetch('http://localhost:3001/user/update', {
        method: "POST",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({user})
      }).then((res) => res.json()).then((json) => {
        this.props.setUser(json.userDoc);
        this.props.setBoard();
        this.props.createRedirect(`profile/${this.props.user.email}/boards`);
        this.props.toggleEditBoardModal('close');
      }).catch((e) => alert(`e: ${e}`));
    }


  }
  closeModal() {
    this.props.toggleEditBoardModal('close');
  }
  render() {
    return(
      <div className="prof-photo-modal">
        <div className="prof-photo-modal-top d-flex flex-row justify-content-between align-items-center">
          <div className="prof-photo-modal-title">Edit Board</div>
          <div className="prof-photo-modal-close" onClick={this.closeModal.bind(this)}>&#10006;</div>
        </div>
        <div className="prof-photo-modal-content">
          <form name="boardNameModal" onSubmit={this.submitEditBoard.bind(this)}>
          <div className="d-flex flex-row flex-wrap justify-content-between align-items-center">
            <label
              htmlFor="editBoardNameInput"
              className="edit-board-name-input-label"
            >
              Edit Board Name
            </label>
            <input
              id="editBoardNameInput"
              onChange={this.changeNameInput.bind(this)}
              value={this.state.boardNameInput}
              className="edit-board-name-input"
              type="text"
              placeholder="Enter board name"
            />
          </div>
          <button className="prof-photo-submit-btn" type="submit">Submit Name</button>
          </form>
          <button onClick={this.deleteBoard.bind(this)} className="prof-photo-submit-btn">Remove Board</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    board: state.board,
    editBoardModal: state.editBoardModal
  };
}

export default connect(mapStateToProps, actions)(EditBoardModal);
