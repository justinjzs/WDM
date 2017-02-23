import React, { Component, PropTypes } from 'react'
import merge from 'deepmerge'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import {
  fetchCurrentFiles,
  fetchMap,
  selectFile,
  selectAll,
  fetchAllFolders
} from '../actions'
import Row from './Row.js'
import Functionbar from './Functionbar'
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

  render() {
    const { currentFiles,
            loadCurrentFiles,
            selectFileHandler } = this.props;
    const num = getSelectedNumber(currentFiles);
    return (
      <div className="workspace">
      <Functionbar />
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
  loadCurrentFiles: PropTypes.func.isRequired,
  loadMap: PropTypes.func.isRequired,
  selectFileHandler: PropTypes.func.isRequired,
  selectAllHandler: PropTypes.func.isRequired,
  loadMyTree: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  currentFiles: merge({}, state.workspace.currentFiles, { clone: true }),
})

const mapDispatchToProps = dispatch => ({
  loadCurrentFiles: path => dispatch(fetchCurrentFiles(path)),
  loadMap: () => dispatch(fetchMap()),
  selectFileHandler: key => dispatch(selectFile(key)),
  selectAllHandler: checked => dispatch(selectAll(checked)),
  loadMyTree: () => dispatch(fetchAllFolders()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace)