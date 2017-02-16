import React, { Component, PropTypes } from 'react'
import Rename from './Rename';
import Move from './Move'
import AddShare from './AddShare'
import { connect } from 'react-redux'
import {
  ajaxDownload,
  fetchMove,
  ajaxDelete,
  fetchRename,
  fetchAddShare,
  resetAddShare
} from '../actions'
import merge from 'deepmerge'

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.moveHandler = this.moveHandler.bind(this);
    this.downloadHandler = this.downloadHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.renameHandler = this.renameHandler.bind(this);
    this.addShareHandler = this.addShareHandler.bind(this);
  }
  downloadHandler() {
    const { currentFiles, download } = this.props;
    download(currentFiles);
  }
  renameHandler() {
    const { currentPath, rename } = this.props;
    return rename(currentPath);
  }
  deleteHandler() {
    const { currentFiles, deleteFiles } = this.props;
    deleteFiles(currentFiles);
  }
  moveHandler() {
    const { currentPath, currentFiles, move } = this.props;
    let keys = [];
    for (let file of currentFiles) {
      if (file.selected)
        keys.push(file.key);
    }
    return move(keys, currentPath);
  }
  addShareHandler() {
    const { currentFiles, addShare } = this.props;
    let keys = [];
    for (let file of currentFiles) {
      if (file.selected)
        keys.push(file.key);
    }
    return addShare(keys);
  }

  render() {
    const {show, renameFile, tree, addShare, addShareLink, resetAddShare } = this.props;
    return (
      <div className="toolbar">
        <AddShare addShareHandler={this.addShareHandler()}
                  resetHandler={resetAddShare} 
                  addShareLink={addShareLink} />
        <button type="button" className="btn btn-default btn-sm tool" onClick={() => this.downloadHandler()}>
          <img src="/css/svg/download.svg" className="funcbarsvg" /> Download
        </button>
        <button type="button" className="btn btn-default btn-sm tool" onClick={() => this.deleteHandler()}>
          <img src="/css/svg/delete.svg" className="funcbarsvg" /> Delete
        </button>
        <Move tree={tree} moveHandler={this.moveHandler()} />
        {show || <Rename renameHandler={this.renameHandler()} renameFile={renameFile} />}
      </div>
    )
  }
}

Toolbar.propTypes = {
  tree: PropTypes.object.isRequired,
  currentPath: PropTypes.string.isRequired,
  currentFiles: PropTypes.array.isRequired,
  addShareLink: PropTypes.object.isRequired,
  download: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  deleteFiles: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
  addShare: PropTypes.func.isRequired,
  resetAddShare: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  tree: merge({}, state.tree, { clone: true }),
  currentFiles: merge({}, state.workspace.currentFiles, { clone: true }),
  currentPath: state.workspace.currentPath,
  addShareLink: state.share.addShare,
})

const mapDispatchToProps = dispatch => ({
  download: currentFiles => dispatch(ajaxDownload(currentFiles)),
  move: (keys, prePath) => newPath => dispatch(fetchMove(keys, prePath, newPath)),
  deleteFiles: currentFiles => dispatch(ajaxDelete(currentFiles)),
  rename: currentPath => (key, name) => dispatch(fetchRename(key, name, currentPath)),
  addShare: keys => isSecret => dispatch(fetchAddShare(keys, isSecret)),
  resetAddShare: () => dispatch(resetAddShare())

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);