import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { fetchSearch, fetchUserName } from '../actions'
import { Link } from 'react-router'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      searchText: props.intl.formatMessage({id: 'search_All_files'})
    }
    this.inputHandler = this.inputHandler.bind(this);
    this.rangeHandler = this.rangeHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }
  componentWillMount() {
    this.props.getUserName();
  }
  inputHandler(e) {
    this.setState({
      inputText: e.target.value
    })
  }
  rangeHandler(searchText) {
    this.setState({
      searchText
    })
  }
  searchHandler() {
    const { search, currentPath, intl } = this.props;
    const { inputText, searchText } = this.state;
    let searchPath = searchText === intl.formatMessage({id: 'search_This_Folder'}) ? currentPath : undefined;
    search(inputText, searchPath);
  }
  render() {
    const { currentPath, userName, intl } = this.props;
    const { inputText } = this.state;
    const toUrl = `/home/search/${inputText}`;
    return (
      <nav className="header navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <img src="/css/svg/wdm.svg" className="logo" /><span id="description" >
              <FormattedMessage id='app_Description'
                description='description the app' />
            </span>
          </div>
          <div className="input-group nav navbar-nav">
            <div className="input-group-btn search-panel">
              <button type="button" className="btn btn-default dropdown-toggle" id="filter" data-toggle="dropdown">
                <span id="search_concept">{this.state.searchText}</span> <span className="caret"></span>
              </button>
              <ul className="dropdown-menu" role="menu">
                <li><a href="javascript:void(0)" onClick={() => this.rangeHandler(intl.formatMessage({id: 'search_This_Folder'}))}>
                  <FormattedMessage id='search_This_Folder' /></a></li>
                <li><a href="javascript:void(0)" onClick={() => this.rangeHandler(intl.formatMessage({id: 'search_All_files'}))}>
                  <FormattedMessage id='search_All_files' /></a></li>
              </ul>
            </div>
            <input type="text" className="form-control" id="search" value={inputText} onChange={this.inputHandler} placeholder={intl.formatMessage({id: 'search_Input_Placeholder'})} />
            <span className="input-group-btn">
              <Link to="/home/search"><button className="btn btn-default" type="button" id="submit" onClick={() => this.searchHandler()} ><img src="/css/svg/search.svg" /></button></Link>
            </span>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#"><img src="/css/svg/user.svg" />
              <FormattedMessage id='greeting'
                description='Greeting to the user'
                values={{ userName: <b>{userName}</b> }} /></a></li>
            <li><a href="/logout"><span className="fa fa-sign-out fa-2x"></span><FormattedMessage id='log_Out' /></a></li>
          </ul>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  currentPath: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
  getUserName: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  intl: intlShape.isRequired
}

const mapStateToProps = state => ({
  currentPath: state.workspace.currentPath,
  userName: state.user.name
})

const mapDispatchToProps = dispatch => ({
  search: (name, path) => dispatch(fetchSearch(name, path)),
  getUserName: () => dispatch(fetchUserName())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Header))