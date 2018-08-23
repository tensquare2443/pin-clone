import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';
import {Link} from 'react-router-dom';

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawer: false,
      searchBar: ''
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.searchBarChange = this.searchBarChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
  }
  searchBarChange(e) {
    const searchBar = e.currentTarget.value;
    this.setState({searchBar});
  }
  searchSubmit(e) {
    e.preventDefault();
    // alert(this.state.searchBar);
    const searchBar = this.state.searchBar;
    fetch('http://localhost:3001/pins/filter', {
      method: 'POST',
      body: {searchBar}
    }).then((response) => response.json()).then((json) => {
      alert(JSON.stringify(json));
    }).catch((e) => alert(`e: ${e}`));
  }

  toggleDrawer(action) {
    if (action === 'close') {
      return this.setState({drawer: false});
    } else if (action === 'open') {
      return this.setState({drawer: true});
    } else {
      return this.setState({drawer: !this.state.drawer});
    }
  }

  render() {
    var email = this.props.user.email;
    var buttonClass = (button) => {
      if (window.location.pathname.includes(button)) {
        return 'nav-button-active'
      } else return 'nav-button';
    };
    return (
      <div>
        <div className="top-nav d-flex flex-row align-items-center" style={{
          height: '63px',
          borderBottom: '1px solid #ECECEC'
        }}>
          <Link to="/home" style={{textDecoration: "none"}}>
            <img style={{margin: "22px"}} src={require('../img/pinterest-logo.png')} width="28px" height="28px" alt=""/>
          </Link>
          <form onSubmit={this.searchSubmit.bind(this)} className="d-none d-sm-block">
            <input
              onChange={this.searchBarChange}
              value={this.state.searchBar}
              placeholder="Search"
              className="top-nav-search-bar"
              type="text"
            />
          </form>
          <div className="d-none d-sm-block" style={{margin: "22px", marginLeft: "auto"}}>
            <Link to="/home" >
              <button className={buttonClass('/home')}>Home</button>
            </Link>
            <Link to="/following" style={{textDecoration: "none"}}>
              <button className={buttonClass('/following')}>Following</button>
            </Link>
            <Link to={`/profile/${email}/boards`} style={{textDecoration: "none"}}>
              <button className={buttonClass('/profile')}>{email.split('@')[0]}</button>
            </Link>
          </div>
          <div
          onClick={this.toggleDrawer}
          className="d-block d-sm-none top-nav-drawer-cont"
          style={{marginLeft: "auto"}}>
            <img src={require('../img/drawer.png')} width="28px" height="28px" alt=""/>
          </div>
        </div>
        {this.state.drawer ?
          <div className="d-flex flex-column d-sm-none">
            <form onSubmit={this.searchSubmit.bind(this)} className="top-nav-dropdown-search-cont">
              <input onChange={this.searchBarChange} value={this.state.searchBar} className="top-nav-dropdown-search-bar" placeholder="Search" type="text"/>
            </form>
            <Link to="/home" >
              <button className="top-nav-dropdown-button">Home</button>
            </Link>
            <Link to="/following" style={{textDecoration: "none"}}>
              <button className="top-nav-dropdown-button">Following</button>
            </Link>
            <Link to={`/profile/${email}/boards`} style={{textDecoration: "none"}}>
              <button className="top-nav-dropdown-button">{email.split('@')[0]}</button>
            </Link>
          </div>
        : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(TopNav);
