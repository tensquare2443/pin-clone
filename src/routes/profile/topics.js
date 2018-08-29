import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';

class Topics extends Component {
  componentDidMount() {
    fetch('http://localhost:3001/topics').then((res) => {
      return res.json();
    }).then((json) => {
      var topicDocs = json.topicDocs;
      var topicsOrdered = [];
      var topicsNotFollowed = [];

      topicDocs.forEach((topicDoc) => {
        if (this.props.user.topics.includes(topicDoc.name)) {
          topicsOrdered.push(topicDoc);
        } else {
          topicsNotFollowed.push(topicDoc);
        }
      });

      topicsOrdered = topicsOrdered.concat(topicsNotFollowed);

      this.props.setTopics(topicsOrdered);
    }).catch((e) => alert(JSON.stringify(`e: ${e}`)));
  }
  componentWillUnmount() {
    this.props.setTopics();
  }

  changeTopic(e) {
    var user = JSON.parse(JSON.stringify(this.props.user));
    var topic = e.currentTarget.dataset.id;
    var action = e.currentTarget.innerText;

    if (action === 'Follow') {
      user.topics.push(topic);
    } else if (action === 'Unfollow') {
      for (var i = 0; i < user.topics.length; i++) {
        if (user.topics[i] === topic) {
          user.topics.splice(i,1);
          break;
        }
      }
    }

    fetch('http://localhost:3001/user/update', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user})
    }).then((res) => res.json()).then((json) => {
      this.props.setUser(json.userDoc);
    }).catch((e) => `e: ${e}`);
  }
  render() {
    if (this.props.topics) {
      var followed = (topic) => {
        var userTopics = this.props.user.topics;
        var followed;
        for (var i = 0; i < userTopics.length; i++) {
          if (userTopics[i] === topic) {
            followed = true;
          }
        }
        if (followed) {
          return (
            <button
              onClick={this.changeTopic.bind(this)}
              data-id={topic}
              className="topic-subtitle-unfollow"
            >
              Unfollow
            </button>
          );
        } else {
          return (
            <button
              onClick={this.changeTopic.bind(this)}
              data-id={topic}
              className="topic-subtitle"
            >
              Follow
            </button>
          );
        }
      };
      const topicsLg = this.props.topics.map((topic) => {
        var topicReformatted = (topic) => {
          return topic.replace(/[']/g, '').replace(/[ ]/g, '-').toLowerCase();
        };

        return(
          <div key={topic.name} className="m-reg p-reg">
            <div style={{alignContent: "flex-start"}} className="topic-cont-lg d-flex flex-column">
              <div className="content topic-cont-content d-flex justify-content-center align-items-center">
                <div className="topic-content-name">{topic.name}</div>
                <img style={{borderRadius: '8px'}} src={require(`../../img/topics/${topicReformatted(topic.name)}.jpg`)} width="100%" height="100%" alt=""/>
              </div>
              {followed(topic.name)}
            </div>
          </div>
        );
      });
      const topicsSm = this.props.topics.map((topic) => {
        var topicReformatted = (topic) => {
          return topic.replace(/[']/g, '').replace(/[ ]/g, '-').toLowerCase();
        };
        return(
          <div key={topic.name} className="d-flex justify-content-center m-reg p-reg">
            <div style={{alignContent: "flex-start"}} className="topic-cont-sm d-flex flex-column">
              <div className="content topic-cont-content d-flex justify-content-center align-items-center">
                <div className="topic-content-name">{topic.name}</div>
                <img src={require(`../../img/topics/${topicReformatted(topic.name)}.jpg`)} width="100%" height="100%" alt=""/>
              </div>
              {followed(topic.name)}
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
    } else return null;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    topics: state.topics
  };
}

export default connect(mapStateToProps, actions)(Topics);
