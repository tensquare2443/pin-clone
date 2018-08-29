import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from 'actions';
import {
  redirector,
  manualNavigationUserCheck
} from 'helper-functions';

class CreateBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createBoardNameInput: ''
    };
    this.nameInputChange = this.nameInputChange.bind(this);
    this.redirector = redirector.bind(this);
    this.manualNavigationUserCheck = manualNavigationUserCheck.bind(this);
  }
  cancelCreateBoard() {
    this.props.createRedirect(`profile/${this.props.user.email}/boards`);
    this.setState({createBoardNameInput: ''});
  }
  formSubmit(e) {
    e.preventDefault();
    var board = this.state.createBoardNameInput;
    var user = JSON.parse(JSON.stringify(this.props.user));

    fetch('http://localhost:3001/board/new', {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({board, user})
    }).then((res) => res.json()).then((json) => {
      if (json.e) {
        if (json.e.message.includes('duplicate key error')) {
          return alert('Board name already in use!');
        } else alert('Error. Cannot save board!');
      }

      if (json.userDoc) {
        this.props.setUser(json.userDoc);
        this.props.createRedirect(`profile/${this.props.user.email}/boards`);
        this.setState({createBoardNameInput: ''});
      }
    }).catch((e) => alert(`e: ${e}`));
  }
  componentDidMount() {
    document.getElementsByTagName('body')[0].style.backgroundColor = '#ECECEC';
  }
  componentWillUnmount() {
    this.setState({createBoardNameInput: ''});
    document.getElementsByTagName('body')[0].style.backgroundColor = '#fff';
  }
  nameInputChange(e) {
    var createBoardNameInput = e.currentTarget.value;
    this.setState({createBoardNameInput});
  }
  backClick() {
    this.props.createRedirect(`profile/${this.props.user.email}/boards`);
  }
  render() {
    if (this.redirector('board/new') !== undefined) {
      return this.redirector('board/new');
    }
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
            <div className="m-reg p-reg">Create Board</div>
          </div>

          <form onSubmit={this.formSubmit.bind(this)}>
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
                <button
                  onClick={this.cancelCreateBoard.bind(this)}
                  type="button"
                  className="cancel-create-board-btn"
                >
                  Cancel
                </button>
                {submitBtn()}
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
    user: state.user,
    redirect: state.redirect
  };
}

export default connect(mapStateToProps, actions)(CreateBoard);
