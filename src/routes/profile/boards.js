import React, {Component} from 'react';
import Create from 'components/create';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as actions from 'actions';

class Boards extends Component {
  render() {
    const boardsMapped = this.props.user.boards.map((board) => {
      var pinsSection = (length) => {
        if (length === 0) {
          return null;
        } else if (length === 1) {
          return (
            <div className="create-subtitle">{board.pins.length} Pin</div>
          );
        } else {
          return (
            <div className="create-subtitle">{board.pins.length} Pins</div>
          );
        }
      };
      return (
        <Link
          to={`/board/${board._id}`}
          style={{
            textDecoration: 'none',
            alignContent: "flex-start",
            margin: '10px'
          }}
          className="create-cont d-flex flex-column"
        >
          <div className="content create-cont-content d-flex justify-content-center align-items-center">
          </div>
          <div className="create-subtitle">{board.name}</div>
          {pinsSection(board.pins.length)}
        </Link>
      );
    });
    return(
      <div>
        <div className="boards-mapped-cont d-flex flex-row flex-wrap justify-content-center">
          <Create subtitle="Create Board" style={{margin: '10px'}}/>
          {boardsMapped}
        </div>
        {JSON.stringify(this.props.user.boards)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(Boards);
