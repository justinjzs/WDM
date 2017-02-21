import React, { Component, PropTypes } from 'react'
import merge from 'deepmerge'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import {
  fetchCurrentFiles,
  fetchMap,
  selectFile,
  selectAll,
  fetchDownload,
  fetchAllFolders,
  fetchSaveTo
} from '../actions'
import Row from './Row.js'
import Breadcrumb from './Breadcrumb.js'
import Save from './Save'
import getIconName from '../utils/getIconName'
import formatBytes from '../utils/formatBytes'
import getSelectedNumber from '../utils/getSelectedNumber'
import getSelectedKeys from '../utils/getSelectedKeys'

class Workspace extends Component {
  componentWillMount() {
    this.props.loadCurrentFiles();
    this.props.loadMap();
    this.props.loadMyTree();
  }
  checkAllHandler(e) {
    this.props.selectAllHandler(e.target.checked);
  }
  saveHandler() {
    const { currentFiles, save } = this.props;
    let keys = getSelectedKeys(currentFiles);
    return save(keys);
  }
  downloadHandler() {
    const { currentFiles, download } = this.props;
    let keys = [];
    for (let file of currentFiles) {
      if (file.selected)
        keys.push(file.key)
    }
    keys.length && download(keys);
  }
  render() {
    const { currentFiles,
            isLoggedin,
            loadCurrentFiles,
            currentPath,
            map,
            tree,
            selectFileHandler } = this.props;
    const num = getSelectedNumber(currentFiles);
    return (
      <div className="workspace table-responsive">
        <div>
          <Breadcrumb currentPath={currentPath} map={map} clickHandler={loadCurrentFiles} />
          <div className="toolbar">
            {!!num && <button type="button" className="btn btn-default btn-sm tool"
              onClick={() => this.downloadHandler()} >
              <img src="/css/svg/download.svg" className="funcbarsvg" /><FormattedMessage id="download" /></button>}
            {isLoggedin && !!num && <Save tree={tree} saveHandler={this.saveHandler()} />}
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="center-cell" width="50px">
                <div className="checkbox">
                  <input type='checkbox' className="styled" onClick={e => this.checkAllHandler(e)} />
                  <label></label>
                </div>
              </th>
              <th width="40%"><FormattedMessage id="file_Name" /></th>
              <th><FormattedMessage id="file_Size" /></th>
            </tr>
          </thead>
          <tbody>
            {currentFiles.map(file =>
              <Row icon={getIconName(file)} {...file}
                fileKey={file.key}
                clickHandler={loadCurrentFiles}
                checkHandler={selectFileHandler}
                size={formatBytes(file.size, 0)} />)}
          </tbody>
        </table>
      </div>
    )
  }
}

Workspace.propTypes = {
  currentFiles: PropTypes.array.isRequired,
  currentPath: PropTypes.string.isRequired,
  loadCurrentFiles: PropTypes.func.isRequired,
  loadMap: PropTypes.func.isRequired,
  map: PropTypes.object.isRequired,
  selectFileHandler: PropTypes.func.isRequired,
  selectAllHandler: PropTypes.func.isRequired,
  download: PropTypes.func.isRequired,
  loadMyTree: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  tree: PropTypes.object.isRequired,
  isLoggedin: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  currentFiles: merge({}, state.workspace.currentFiles, { clone: true }),
  currentPath: state.workspace.currentPath,
  map: merge({}, state.workspace.map, { clone: true }),
  tree: merge({}, state.mytree, { clone: true }),
  isLoggedin: state.isLoggedin
})

const mapDispatchToProps = dispatch => ({
  loadCurrentFiles: path => dispatch(fetchCurrentFiles(path)),
  loadMap: () => dispatch(fetchMap()),
  selectFileHandler: key => dispatch(selectFile(key)),
  selectAllHandler: checked => dispatch(selectAll(checked)),
  download: keys => dispatch(fetchDownload(keys)),
  loadMyTree: () => dispatch(fetchAllFolders()),
  save: keys => path => dispatch(fetchSaveTo(keys, path))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace)