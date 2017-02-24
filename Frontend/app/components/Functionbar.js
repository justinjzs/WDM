import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import New from './operations/New'
import UploadFiles from './operations/UploadFiles'
import UploadDir from './operations/UploadDir'
import Breadcrumb from './functionbar/Breadcrumb'
import Toolbar from './functionbar/Toolbar'
import Unshare from './operations/Unshare'
import merge from 'deepmerge'
import { FormattedMessage } from 'react-intl'
import {
  fetchCurrentFiles,
  ajaxUpload,
  ajaxUploadDir,
  fetchMkdir,
  fetchUnshare
} from '../actions'

class Functionbar extends Component {
  constructor(props) {
    super(props);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.uploadDirHandler = this.uploadDirHandler.bind(this);
    this.unshareHandler = this.unshareHandler.bind(this);
    this.mkdirHandler = this.mkdirHandler.bind(this);
  }
  uploadHandler() {
    const { currentPath, upload } = this.props;
    upload(currentPath);
  }
  uploadDirHandler() {
    const { currentPath, uploadDir } = this.props;
    uploadDir(currentPath);
  }
  mkdirHandler() {
    const { currentPath, mkdir } = this.props;
    return mkdir(currentPath);
  }
  unshareHandler() {
    const { unshare, list } = this.props;
    let array = [];
    for (let item of list) {
      if (item.selected)
        array.push(item.addr);
    }
    unshare(array);
  }
  render() {
    const {
      currentFiles,
      currentPath,
      map,
      list,
      loadFilesHandler,
      isSearch,
      pathName} = this.props;
    let count = 0;
    let renameFile;
    for (let file of currentFiles) {
      if (count > 1)
        break;
      if (file.selected) {
        count++;
        renameFile = file;
      }
    }
    let show = false;
    for (let item of list) {
      if (item.selected) {
        show = true;
        break;
      }
    }
    const isShare = pathName === '/home/share';
    return (
      <div className="functionbar row">
        <div className="new-upload col-sm-3">
          <button type="button" id="new" className="btn btn-default btn-sm" data-toggle="modal" data-target="#newFolder">
            <div className="in-functionbar">
              <span className="icon-new white-icon"> </span>
              <FormattedMessage id="new" />
            </div>
          </button>
          <New mkdirHandler={this.mkdirHandler()} />
          <div className="dropdown" id="upload-dropdown">
            <button type="button" id="upload" className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
              <div className="in-functionbar">
                <span className="icon-upload"> </span>
                <FormattedMessage id="upload" /> <span className="caret"></span>
              </div>
            </button>
            <ul className="dropdown-menu">
              <li><UploadFiles uploadHandler={this.uploadHandler} /></li>
              <li><UploadDir uploadDirHandler={this.uploadDirHandler} /></li>
            </ul>
          </div>
        </div>
        <div className="displaybar">
          {isSearch && <span id="search-result">
            <FormattedMessage id="search_Result" />
          </span>}
          {isShare && <span id="my-share">
            <FormattedMessage id="my_Share" />
          </span>}
          {(!isShare && !isSearch) && <Breadcrumb currentPath={currentPath} map={map} clickHandler={loadFilesHandler} />}
          {(!!count && !isShare) && <Toolbar show={count > 1} name={renameFile.name} />}
          {(isShare && show) && <div className="toolbar">
            <Unshare unshareHandler={this.unshareHandler} />
          </div>}
        </div>
      </div>
    );
  }
}

Functionbar.propTypes = {
  upload: PropTypes.func.isRequired,
  uploadDir: PropTypes.func.isRequired,
  currentFiles: PropTypes.array.isRequired,
  currentPath: PropTypes.string.isRequired,
  map: PropTypes.object.isRequired,
  isSearch: PropTypes.bool.isRequired,
  loadFilesHandler: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  mkdir: PropTypes.func.isRequired,
  unshare: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  currentFiles: merge({}, state.workspace.currentFiles, { clone: true }),
  currentPath: state.workspace.currentPath,
  map: merge({}, state.tree.map, { clone: true }),
  isSearch: state.workspace.isSearch,
  list: merge({}, state.share.list)
})

const mapDispatchToProps = dispatch => ({
  loadFilesHandler: path => dispatch(fetchCurrentFiles(path)),
  upload: path => dispatch(ajaxUpload(path)),
  uploadDir: path => dispatch(ajaxUploadDir(path)),
  unshare: addrs => dispatch(fetchUnshare(addrs)),
  mkdir: path => name => dispatch(fetchMkdir(name, path))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Functionbar)