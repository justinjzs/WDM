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
      searchText: props.intl.formatMessage({ id: 'search_All_files' })
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
    let searchPath = searchText === intl.formatMessage({ id: 'search_This_Folder' }) ? currentPath : undefined;
    search(inputText, searchPath);
  }
  render() {
    const { currentPath, userName, intl } = this.props;
    const { inputText, searchText } = this.state;
    const toUrl = `/home/search/${inputText}`;
    return (
      <nav className="navbar navbar-default header" role="navigation">
        <div className="navbar-header col-sm-2">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#max-768">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <div className="logo">
            <span>
              <img src="/css/svg/wdm.svg" />
            </span>
            <div className="description" >
              <FormattedMessage id='app_Description'
                description='description the app' />
            </div>
          </div>
        </div>
        <div className="collapse navbar-collapse row" id="max-768">
          <div className="nav navbar-nav col-sm-6">
            <div className="input-group navbar-form">
              <div className="input-group-btn">
                <button type="button" className="btn btn-default  dropdown-toggle" id="filter" data-toggle="dropdown">
                  <span id="search_concept">{searchText}</span> <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" role="menu">
                  <li><a href="javascript:void(0)" onClick={() => this.rangeHandler(intl.formatMessage({ id: 'search_This_Folder' }))}>
                    <FormattedMessage id='search_This_Folder' /></a></li>
                  <li><a href="javascript:void(0)" onClick={() => this.rangeHandler(intl.formatMessage({ id: 'search_All_files' }))}>
                    <FormattedMessage id='search_All_files' /></a></li>
                </ul>
              </div>
              <input type="text" className="form-control" id="search" value={inputText} onChange={this.inputHandler} placeholder={intl.formatMessage({ id: 'search_Input_Placeholder' })} />
              <div className="input-group-btn">
                <button className="btn btn-default" type="button" id="submit" onClick={() => this.searchHandler()} ><Link to="/home/search"><img src="/css/svg/search.svg" /></Link></button>
              </div>
            </div>
          </div>

          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" >
                <img src="/css/svg/user.svg " />
                <FormattedMessage id='greeting'
                  description='Greeting to the user'
                  values={{ userName: <b>{userName}</b> }} /></a>
                <ul className="dropdown-menu" role="user menu">
                  <li><a href="/logout">Lou out</a></li>
                </ul>
              </li>
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



