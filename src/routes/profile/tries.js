import React, {Component} from 'react';

class Tries extends Component {
  render() {
    return(
      <div className="d-flex flex-column" style={{width: "90%", maxWidth: "400px", margin: "auto"}}>
        <div className="f-bold text-center" style={{fontSize: "13px"}}>Pins you try live here</div>
        <div className="f-bold text-center" style={{fontSize: "13px", color: "#808080"}}>Add notes and photos to recipes you made, places you traveled and other ideas you tried</div>
      </div>
    );
  }
}

export default Tries;
