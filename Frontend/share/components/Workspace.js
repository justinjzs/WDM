import React, { Component, PropTypes } from 'react'
import merge from 'deepmerge'
import { connect } from 'react-redux'
import {
  fetchCurrentFiles,
  fetchMap,
  selectFile,
  selectAll,
  fetchDownload
} from '../actions'
import Row from './Row.js'
import Breadcrumb from './Breadcrumb.js'
import getIconName from '../utils/getIconName'
import formatBytes from '../utils/formatBytes'

class Workspace extends Component {
  componentWillMount() {
    this.props.loadCurrentFiles();
    this.props.loadMap();
  }
  checkAllHandler(e) {
    this.props.selectAllHandler(e.target.checked);
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
      loadCurrentFiles,
      currentPath,
      map,
      selectFileHandler } = this.props;
    return (
      <div className="workspace table-responsive">
        <div>
          <Breadcrumb currentPath={currentPath} map={map} clickHandler={loadCurrentFiles} />
          <div className="toolbar">
            <button type="button" className="btn btn-default btn-sm tool"
              onClick={() => this.downloadHandler()} >Download</button>
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
              <th width="40%">Name</th>
              <th>Size</th>
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
  download: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  currentFiles: merge({}, state.workspace.currentFiles, { clone: true }),
  currentPath: state.workspace.currentPath,
  map: merge({}, state.workspace.map, { clone: true })
})

const mapDispatchToProps = dispatch => ({
  loadCurrentFiles: path => dispatch(fetchCurrentFiles(path)),
  loadMap: () => dispatch(fetchMap()),
  selectFileHandler: key => dispatch(selectFile(key)),
  selectAllHandler: checked => dispatch(selectAll(checked)),
  download: keys => dispatch(fetchDownload(keys))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace)