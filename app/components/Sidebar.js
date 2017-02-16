import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router'
import merge from 'deepmerge'
import { fetchAllFolders, 
         fetchCurrentFiles, 
         fetchShareRecords } from '../actions'
import Collapse from './Collapse';

class Sidebar extends Component {
  componentWillMount() {
    this.props.loadTreeHandler();
  }
  render() {
    let { currentPath, loadShareRecods } = this.props;
    let key = currentPath.match(/\d+/g) && +currentPath.match(/\d+/g).pop();

    let src = key ? "/css/svg/folder_white_16pix.svg" : "/css/svg/folder_green_16pix.svg";
    return (
      <div className="nav-side-menu">
        <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>

        <div className="menu-list">

          <ul id="menu-content" className="menu-content collapse out">
            <li  data-toggle="collapse" data-target="#home" onDoubleClick={e => this.props.loadFilesHandler()} className="collapsed">
              <Link to="/home"><img src={src} className="sidebar-icon"/> Home <span className="arrow"></span></Link>
            </li>
            <ul id="home" className="collapse">
              <Collapse level={1} currentFolder={key} dClickHandler={this.props.loadFilesHandler} folders={this.props.tree.home.children} />
            </ul>
            <li>
              <img src="/css/svg/share_white.svg" className="sidebar-icon" /><Link to="/home/share" onClick={() => loadShareRecods()}> My Share</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
};

Sidebar.propTypes = {
  tree: PropTypes.object.isRequired,
  currentPath: PropTypes.string.isRequired,
  loadTreeHandler: PropTypes.func.isRequired,
  loadFilesHandler: PropTypes.func.isRequired,
  loadShareRecods: PropTypes.func.isRequired

};

const mapStateToProps = state => ({
  tree: merge({}, state.tree, {clone: true}),
  currentPath: state.workspace.currentPath
});

const mapDispatchToProps = dispatch => ({
  loadTreeHandler: () => dispatch(fetchAllFolders()),
  loadFilesHandler: path => dispatch(fetchCurrentFiles(path)),
  loadShareRecods: () => dispatch(fetchShareRecords())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)