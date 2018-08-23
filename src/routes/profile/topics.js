import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';

class Topics extends Component {
  render() {
    const topicsLg = this.props.user.topics.map((topic) => {
      var topicReformatted = (topic) => {
        return topic.replace(/[']/g, '').replace(/[ ]/g, '-').toLowerCase();
      };
      return(
        <div className="m-reg p-reg">
          <div style={{alignContent: "flex-start"}} className="topic-cont-lg d-flex flex-column">
            <div className="content topic-cont-content d-flex justify-content-center align-items-center">
              <img src={require(`../../img/topics/${topicReformatted(topic)}.jpg`)} width="100%" height="100%" alt=""/>
            </div>
            <button className="topic-subtitle">Unfollow</button>
          </div>
        </div>
      );
    });
    const topicsSm = this.props.user.topics.map((topic) => {
      var topicReformatted = (topic) => {
        return topic.replace(/[']/g, '').replace(/[ ]/g, '-').toLowerCase();
      };
      return(
        <div className="d-flex justify-content-center m-reg p-reg">
          <div style={{alignContent: "flex-start"}} className="topic-cont-sm d-flex flex-column">
            <div className="content topic-cont-content d-flex justify-content-center align-items-center">
              <img src={require(`../../img/topics/${topicReformatted(topic)}.jpg`)} width="100%" height="100%" alt=""/>
            </div>
            <button className="topic-subtitle">Unfollow</button>
          </div>
        </div>
      );
    });
    return(
      <div>
        <div className="d-none d-sm-flex flex-row flex-wrap justify-content-center">{topicsLg}</div>
        <div className="d-flex d-sm-none flex-column justify-content-center">{topicsSm}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(Topics);
