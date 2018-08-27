import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from 'actions';

class ChooseBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createBoard: false,
      createBoardNameInput: ''
    };
  }
  createBoard(e) {
    e.preventDefault();
    var user = JSON.parse(JSON.stringify(this.props.user));
    var board = {
      followers: [this.props.user.email],
      name: this.state.createBoardNameInput,
      creator: this.props.user.email,
      pins: [JSON.parse(JSON.stringify(this.props.pin))]
    };

    fetch('http://localhost:3001/boards/new-and-save-pin', {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user, board})
    }).then((res) => res.json()).then((json) => {
      // alert(JSON.stringify(json));
      this.props.setUser(json.userDoc);
      //redirec to
      this.props.createRedirect(`profile/${this.props.user.email}/boards`);
    }).catch((e) => alert(`e: ${e}`));
  }
  nameInputChange(e) {
    const createBoardNameInput = e.currentTarget.value;
    this.setState({createBoardNameInput});
  }
  closeCreateBoardForm() {
    this.setState({createBoard: false});
  }
  openCreateBoardForm() {
    this.setState({createBoard: true});
  }
  savePinToBoard(e) {
    var boardId = e.currentTarget.dataset.id;
    var user = JSON.parse(JSON.stringify(this.props.user));
    var pin = JSON.parse(JSON.stringify(this.props.pin));

    user.pins.push(pin);

    var board;
    for (var i = 0; i < user.boards.length; i++) {
      if (user.boards[i]._id === boardId) {
        user.boards[i].pins.push(pin);
        board = JSON.parse(JSON.stringify(user.boards[i]));
        board.pins.push(pin);
        break;
      }
    }
    fetch('http://localhost:3001/pins/save', {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user, board, pin})
    }).then((res) => res.json()).then((json) => {
      this.props.setUser(json.userDoc);
      this.props.createRedirect(`profile/${this.props.user.email}/pins`);
    }).catch((e) => alert(`e: ${e}`));
  }
  backClick() {
    if (this.props.prev === 'home') {
      this.props.createRedirect(`home`);
    } else {
      this.props.createRedirect(`pin/${this.props.pin._id}`);
    }
  }
  render() {
    if (this.props.redirect === 'pin/save/choose-board') {
      this.props.removeRedirect();
    } else if (this.props.redirect) {
      return <Redirect to={`/${this.props.redirect}`}/>
    }
    if (!this.props.user) {
      if (window.localStorage.getItem('pclUser')) {
        this.props.createRedirect('log-in');
      } else this.props.createRedirect('sign-up');
      return null;
    }

    const myBoardsMapped = this.props.user.boards.map((board) => {
      return (
        <div
          className="my-boards-list-item d-flex flex-row justify-content-between align-items-center"
          key={board.name}
          data-id={board._id}
        >
          <div className="save-pin-to-board-name">{board.name}</div>
          <div>
            <button
              onClick={this.savePinToBoard.bind(this)}
              data-id={board._id}
              className="save-pin-to-board-btn"
            >
              Save
            </button>
          </div>
        </div>
      );
    });
    var submitBtn = () => {
      if (this.state.createBoardNameInput.length > 0) {
        return <button className="submit-create-board-btn-active">Create</button>;
      } else {
        return <button className="submit-create-board-btn-disabled">Create</button>;
      }
    };

    return(
      <div className="pin-route-outer-cont">
        <div className="pin-route-back-cont d-flex flex-row align-items-center">
          <div onClick={this.backClick.bind(this)} style={{cursor: 'pointer'}}>
            <img src={require('../img/back-arrow.png')} width="48px" alt=""/>
          </div>
          <div onClick={this.backClick.bind(this)} className="pin-route-back-txt">Back</div>
        </div>
        <div className="create-pin-inner-cont">
          <div className="create-pin-top-cont f-bold d-flex justify-content-center align-items-center">
            <div className="m-reg p-reg">
            {this.state.createBoard ?
              <span>Create Board</span>
              :
              <span>Choose Board</span>
            }
            </div>
          </div>

          {this.state.createBoard ?
              <form onSubmit={this.createBoard.bind(this)}>
                <div className="create-board-name-group d-flex flex-row justify-content-between align-items-center">
                  <label className="create-board-name-label" htmlFor="createBoardNameInput">Name</label>
                  <input
                    value={this.state.createBoardNameInput}
                    onChange={this.nameInputChange.bind(this)}
                    className="create-board-name-input"
                    id="createBoardNameInput"
                    type="text"
                    placeholder={'Like "Places to Go" or "Recipes to Make"'}
                  />
                </div>

                <div style={{borderTop: "1px solid #ECECEC"}}>
                  <div
                    style={{margin: "5px", padding: "5px"}}
                    className="d-flex justify-content-end align-items-center"
                  >
                    <button onClick={this.closeCreateBoardForm.bind(this)} className="cancel-create-board-btn">Cancel</button>
                    {submitBtn()}
                  </div>
                </div>
              </form>
            :
            <div className="my-boards-list-cont">
              {myBoardsMapped}
              <div
                onClick={this.openCreateBoardForm.bind(this)}
                className="my-boards-list-item d-flex flex-row justify-content-between align-items-center"
              >
                <div className="save-pin-to-board-name d-flex flex-row align-items-center">
                  <img style={{marginRight: '3px'}} src={require('../img/plus-black.png')} width="40px" alt=""/>
                  <span>Create Board</span>
                </div>
              </div>
            </div>
          }

        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    redirect: state.redirect,
    user: state.user,
    pin: state.pin,
    prev: state.prev
  };
}

export default connect(mapStateToProps, actions)(ChooseBoard);
