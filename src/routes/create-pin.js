import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from 'actions';
import {
  redirector,
  manualNavigationUserCheck
} from 'helper-functions';

class CreatePin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createPinInnerContDisplay: {
        display: 'block'
      },
      chooseBoardInnerContDisplay: {
        display: 'none'
      },
      createBoardInnerContDisplay: {
        display: 'none'
      },
      loadingDisplay: {
        display: 'none'
      },
      createBoardNameInput: ''
    };
    this.redirector = redirector.bind(this);
    this.manualNavigationUserCheck = manualNavigationUserCheck.bind(this);
  }
  backClick() {
    this.props.createRedirect(`profile/${this.props.user.email}/pins`);
  }
  componentDidMount() {
    document.getElementsByTagName('body')[0].style.backgroundColor = '#ECECEC';
  }
  componentWillUnmount() {
    this.props.createPinFormChange();
    document.getElementsByTagName('body')[0].style.backgroundColor = '#fff';
  }
  changeForm(e) {
    var createPinForm = JSON.parse(JSON.stringify(this.props.createPinForm));
    const input = e.currentTarget.getAttribute('name');
    const value = e.currentTarget.value;

    createPinForm[input].value = value;

    this.props.createPinFormChange(createPinForm);
  }
  createPinFormSubmit(e) {
    e.preventDefault();

    var createPinForm = this.props.createPinForm;

    var image = createPinForm.image.value;
    var url = createPinForm.url.value;
    var description = createPinForm.description.value;
    var response = {
      url: false,
      description: false,
      image: false
    };
    const isUrlValid = (url) => {
      var test = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

      if(test == null) {
      	return false;
      } else return true;
    }

    if (!isUrlValid(url)) {
      response.url = 'Error: please enter a valid url';
    } else if (url.length === 0) {
      response.url = 'Error: please enter a valid url';
    } else if (url.length > 1024) {
      response.url = 'Error: url must be less than 1024 characters in length';
    } else response.url = false;

    if (description.length > 1024) {
      response.description = 'Error: description must be less than 1024 characters in length';
    } else response.description = false;

    if (image.length === 0) {
      response.image = 'Error: please enter an image';
    } else response.image = false;

    if (response.image || response.url || response.description) {
      var errors = ['Errors\n'];
      Object.keys(response).forEach((field) => {
        if (response[field]) {
          //error exists
          response[field] = response[field].replace('Error: ', '');
          errors.push(`${field}: ${response[field]}\n`);
        }
      });
      errors = errors.join('');
      return alert(errors);
    }

    this.setState({
      createPinInnerContDisplay: {
        display: 'none'
      }
    });
    this.setState({
      chooseBoardInnerContDisplay: {
        display: 'block'
      }
    });
  }
  openCreateBoardForm() {
    this.setState({
      chooseBoardInnerContDisplay: {
        display: 'none'
      }
    });
    this.setState({
      createBoardInnerContDisplay: {
        display: 'block'
      }
    });
  }
  chooseBoardInstead(e) {
    e.preventDefault();
    this.setState({
      chooseBoardInnerContDisplay: {
        display: 'block'
      }
    });
    this.setState({
      createBoardInnerContDisplay: {
        display: 'none'
      }
    });
  }
  savePinToBoard(e) {
    var boardId = e.currentTarget.dataset.id;
    var oldUser = JSON.parse(JSON.stringify(this.props.user));
    var oldBoard;

    for (var i = 0; i < oldUser.boards.length; i++) {
      if (oldUser.boards[i]._id === boardId) {
        oldBoard = oldUser.boards[i];
        break;
      }
    }

    var form = document.forms.namedItem('pinForm');
    var pinFormData = new FormData(form);

    pinFormData.append('user', JSON.stringify({oldUser}));
    pinFormData.append('board', JSON.stringify({oldBoard}));

    this.setState({
      loadingDisplay: {
        display: 'block'
      }
    });
    fetch('http://localhost:3001/pins/create-and-add-to-board', {
      method: "POST",
      mode: 'cors',
      body: pinFormData
    }).then((res) => res.json()).then((json) => {
      this.props.setUser(json.userDoc);
      this.props.createRedirect(`profile/${this.props.user.email}/pins`);
      this.props.createPinFormChange();
      this.setState({
        loadingDisplay: {display: 'none'}
      });
    }).catch((e) => alert(`e: ${e}`));

    //you need to first save the pin and get the id, so do that on the back end.
    //so send the formData, the oldUser, and the board.
    //do your pin save, and on success, update user.pins, user.boards, and the board doc
  }
  createBoardSubmit(e) {
    e.preventDefault();
    var boardName = this.state.createBoardNameInput;
    var oldUser = JSON.parse(JSON.stringify(this.props.user));

    var form = document.forms.namedItem('pinForm');
    var pinFormData = new FormData(form);

    pinFormData.append('user', JSON.stringify({oldUser}));
    pinFormData.append('boardName', boardName);

    //SWIRL



    this.setState({
      loadingDisplay: {
        display: 'block'
      }
    });
    fetch('http://localhost:3001/pins/create-and-create-new-board', {
      method: "POST",
      mode: 'cors',
      body: pinFormData
    }).then((res) => res.json()).then((json) => {
      this.props.setUser(json.userDoc);
      this.props.createRedirect(`profile/${this.props.user.email}/pins`);
      this.props.createPinFormChange();
      this.setState({
        loadingDisplay: {display: 'none'}
      });
    }).catch((e) => alert(`e: ${e}`));
  }
  nameInputChange(e) {
    const createBoardNameInput = e.currentTarget.value;
    this.setState({createBoardNameInput});
  }
  formSubmit(e) {
    e.preventDefault();
    var form = document.forms.namedItem('pinForm');
    var pinFormData = new FormData(form);

    pinFormData.append('user', JSON.stringify(this.props.user));

    fetch('http://localhost:3001/pins/new', {
        method: 'POST',
        mode: 'cors',
        body: pinFormData
    }).then((res) => res.json()).then((json) => {
      if (json.userDoc) {
        this.props.setUser(json.userDoc);
        this.props.createRedirect(`profile/${this.props.user.email}/pins`);
        this.props.createPinFormChange();
      } else {
        var errors = ['Errors\n'];
        Object.keys(json.response).forEach((field) => {
          if (json.response[field]) {
            //error exists
            json.response[field] = json.response[field].replace('Error: ', '');
            errors.push(`${field}: ${json.response[field]}\n`);
          }
        });
        errors = errors.join('');
        alert(errors);
      }
    }).catch((e) => alert(`e: ${e}`));
  }

  render() {
    if (this.redirector('pin/new') !== undefined) {
      return this.redirector('pin/new');
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

        <div className="create-pin-inner-cont" style={this.state.chooseBoardInnerContDisplay}>
          <div className="create-pin-top-cont f-bold d-flex justify-content-center align-items-center">
            <div className="m-reg p-reg">Choose Board</div>
          </div>



          {this.state.loadingDisplay.display === 'block' ?
            <div className="choose-board-loader-cont">
              <img
                className="choose-board-loader"
                src={require('../img/loader.gif')}
                width="36px"
                height="36px"
                alt=""
              />
            </div>
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

        <div className="create-pin-inner-cont" style={this.state.createBoardInnerContDisplay}>
          <div className="create-pin-top-cont f-bold d-flex justify-content-center align-items-center">
            <div className="m-reg p-reg">Create Board</div>
          </div>


          {this.state.loadingDisplay.display === 'block' ?
            <div className="choose-board-loader-cont">
              <img
                className="choose-board-loader"
                src={require('../img/loader.gif')}
                width="36px"
                height="36px"
                alt=""
              />
            </div>
          :
          <form onSubmit={this.createBoardSubmit.bind(this)}>
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
              <button onClick={this.chooseBoardInstead.bind(this)} className="cancel-create-board-btn">Choose Board Instead</button>
              {submitBtn()}
              </div>
            </div>
          </form>
          }


        </div>

          <div className="create-pin-inner-cont" style={this.state.createPinInnerContDisplay}>
            <div
              className="create-pin-top-cont f-bold d-flex justify-content-center align-items-center"
            >
              <div className="m-reg p-reg">Create Pin</div>
            </div>
            <form name="pinForm" onSubmit={this.createPinFormSubmit.bind(this)}>
              <div className="d-none d-sm-flex flex-row">
                <div className="p-reg m-reg">
                  <input
                    onChange={this.changeForm.bind(this)}
                    className="p-reg m-reg"
                    name="image"
                    type="file"
                  />
                </div>
                <div style={{width: "100%", padding: "5px"}}>
                  <div>
                    <div className="m-reg p-reg">Website</div>
                    <input
                      value={this.props.createPinForm.url.value}
                      onChange={this.changeForm.bind(this)}
                      className="create-pin-input m-reg p-reg"
                      name="url"
                      type="text"
                      placeholder="Add the URL this Pin links to"
                    />
                  </div>
                  <div>
                    <div className="m-reg p-reg">Description</div>
                    <textarea
                      value={this.props.createPinForm.description.value}
                      onChange={this.changeForm.bind(this)}
                      className="create-pin-desc-input m-reg p-reg"
                      name="description"
                      type="text"
                      placeholder="Say more about this Pin"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex d-sm-none flex-column">
                <div className="p-reg m-reg" style={{width: "95%"}}>
                  <input
                    onChange={this.changeForm.bind(this)}
                    name="image"
                    className="p-reg m-reg"
                    type="file"
                  />
                </div>
                <div style={{width: "100%", padding: "5px"}}>
                  <div className="m-reg p-reg">
                    <div>Website</div>
                    <input
                      value={this.props.createPinForm.url.value}
                      onChange={this.changeForm.bind(this)}
                      className="create-pin-input"
                      name="url"
                      type="text"
                      placeholder="Add the URL this Pin links to"
                    />
                  </div>
                  <div className="m-reg p-reg">
                    <div>Description</div>
                    <textarea
                      value={this.props.createPinForm.description.value}
                      onChange={this.changeForm.bind(this)}
                      className="create-pin-input"
                      name="description"
                      placeholder="Say more about this Pin"
                    />
                  </div>
                </div>
              </div>
              <div style={{borderTop: "1px solid #ECECEC"}}>
                <div
                  style={{margin: "5px", padding: "5px"}}
                  className="d-flex justify-content-end align-items-center"
                >
                  <button style={{
                    padding: '10px',
                    fontSize: '15px',
                    cursor: 'pointer'
                  }} className="btn-sec" type="submit">
                    Done
                  </button>
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
    createPinForm: state.createPinForm,
    user: state.user,
    redirect: state.redirect,
    prev: state.prev,
    board: state.board
  };
}

export default connect(mapStateToProps, actions)(CreatePin);
