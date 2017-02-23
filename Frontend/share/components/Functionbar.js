import React, { Component, PropTypes } from 'react'
import Breadcrumb from './Breadcrumb'
import { connect } from 'react-redux'
import merge from 'deepmerge'
import Save from './Save'
import getSelectedNumber from '../utils/getSelectedNumber'
import getSelectedKeys from '../utils/getSelectedKeys'
import { FormattedMessage } from 'react-intl'
import {
  fetchDownload,
  fetchSaveTo,
  fetchCurrentFiles
} from '../actions'

class Functionbar extends Component {
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
    const {
      currentFiles,
      currentPath,
      isLoggedin,
      tree,
      map,
      loadCurrentFiles } = this.props;
    const num = getSelectedNumber(currentFiles);
    return (
      <div className="functionbar row">
        <Breadcrumb currentPath={currentPath} map={map} clickHandler={loadCurrentFiles} />
        <div className="toolbar col-sm-3">
          {!!num && <button type="button" className="btn btn-default btn-sm tool"
            onClick={() => this.downloadHandler()} >
            <span className="icon-download green-icon"></span>
            <FormattedMessage id="download" /></button>}
          {isLoggedin && !!num && <Save tree={tree} saveHandler={this.saveHandler()} />}
        </div>
      </div>
    )
  }
}

Functionbar.propTypes = {
  currentFiles: PropTypes.array.isRequired,
  currentPath: PropTypes.string.isRequired,
  loadCurrentFiles: PropTypes.func.isRequired,
  map: PropTypes.object.isRequired,
  download: PropTypes.func.isRequired,
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
  download: keys => dispatch(fetchDownload(keys)),
  save: keys => path => dispatch(fetchSaveTo(keys, path))

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Functionbar)
