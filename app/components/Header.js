import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchSearch } from '../actions'

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      searchPath: '/',
      searchText: 'All Files'
    }
    this.inputHandler = this.inputHandler.bind(this);
    this.rangeHandler = this.rangeHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }
  inputHandler(e) {
    this.setState({
      inputText: e.target.value
    })
  }
  rangeHandler(searchPath, searchText) {
    this.setState({
      searchPath,
      searchText
    })
  }
  searchHandler() {
    const { search } = this.props;
    const { inputText, searchPath } = this.state;
    search(inputText, searchPath);
  }
  render() {
    const { currentPath } = this.props;
    const { inputText } = this.state;
    const toUrl = `/home/search/${inputText}`;
    return (
      <nav className="header navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <img src="/css/svg/wdm.svg" className="logo" /><span id="description" >Document Manager</span>
          </div>
            <div className="input-group nav navbar-nav">
              <div className="input-group-btn search-panel">
                <button type="button" className="btn btn-default dropdown-toggle" id="filter" data-toggle="dropdown">
                  <span id="search_concept">{this.state.searchText}</span> <span className="caret"></span>
                </button>
                  <ul className="dropdown-menu" role="menu">
                    <li><a href="javascript:void(0)" onClick={() => this.rangeHandler(currentPath, "This Folder")}>This Folder</a></li>
                    <li><a href="javascript:void(0)"onClick={() => this.rangeHandler('/', "All Files")}>All Files</a></li>
                  </ul>
              </div>
              <input type="text" className="form-control"id="search" value={inputText} onChange={this.inputHandler} placeholder="Search..." />
              <span className="input-group-btn">
                <Link to={toUrl}><button className="btn btn-default" type="button" id="submit" onClick={() => this.searchHandler()} ><img src="/css/svg/search.svg" /></button></Link>
              </span>
            </div>
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#"><img src="/css/svg/user.svg" /> Hi</a></li>
            <li><a href="/logout"><span className="fa fa-sign-out fa-2x"></span> Log out</a></li>
          </ul>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  currentPath: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  currentPath: state.workspace.currentPath
})

const mapDispatchToProps = dispatch => ({
  search: (name, path) => dispatch(fetchSearch(name, path)) 
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)