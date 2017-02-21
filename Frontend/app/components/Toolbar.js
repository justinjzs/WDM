import React, { Component, PropTypes } from 'react'
import Rename from './Rename';
import Move from './Move'
import AddShare from './AddShare'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import {
  ajaxDownload,
  fetchMove,
  ajaxDelete,
  fetchRename,
  fetchAddShare,
  resetAddShare
} from '../actions'
import merge from 'deepmerge'
import getSelectedKeys from '../utils/getSelectedKeys'

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
    const keys = getSelectedKeys(currentFiles);
    download(keys);
  }
  renameHandler() {
    const { currentPath, currentFiles, rename } = this.props;
    const key = getSelectedKeys(currentFiles).pop();
    return rename(currentPath, key);
  }
  deleteHandler() {
    const { currentFiles, deleteFiles } = this.props;
    const keys = getSelectedKeys(currentFiles);
    deleteFiles(keys);
  }
  moveHandler() {
    const { currentPath, currentFiles, move } = this.props;
    const keys = getSelectedKeys(currentFiles);
    return move(keys, currentPath);
  }
  addShareHandler() {
    const { currentFiles, addShare } = this.props;
    const keys = getSelectedKeys(currentFiles);
    return addShare(keys);
  }

  render() {
    const {show, name, tree, addShare, addShareLink, resetAddShare } = this.props;
    return (
      <div className="toolbar">
        <button type="button" className="btn btn-default btn-sm tool" data-toggle="modal" data-target="#addshare">
          <img src="/css/svg/share_green.svg" className="funcbarsvg" /><FormattedMessage id='share' />
        </button>
        <AddShare addShareHandler={this.addShareHandler()}
          resetHandler={resetAddShare}
          addShareLink={addShareLink} />
        <button type="button" className="btn btn-default btn-sm tool" onClick={() => this.downloadHandler()}>
          <img src="/css/svg/download.svg" className="funcbarsvg" /> <FormattedMessage id='download' />
        </button>
        <button type="button" className="btn btn-default btn-sm tool" onClick={() => this.deleteHandler()}>
          <img src="/css/svg/delete.svg" className="funcbarsvg" /> <FormattedMessage id='delete' />
        </button>
        <button type="button" className="btn btn-default btn-sm tool" data-toggle="modal" data-target="#moveto">
          <img src="/css/svg/moveto.svg" className="funcbarsvg" /> <FormattedMessage id='move_To' />
        </button>
        <Move tree={tree} moveHandler={this.moveHandler()} />
        {show || <button type="button" className="btn btn-default btn-sm tool" data-toggle="modal" data-target="#rename">
          <img src="/css/svg/rename.svg" className="funcbarsvg" /> <FormattedMessage id='rename' />
        </button>}
        <Rename renameHandler={this.renameHandler()} name={name} />
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
  download: keys => dispatch(ajaxDownload(keys)),
  move: (keys, prePath) => newPath => dispatch(fetchMove(keys, prePath, newPath)),
  deleteFiles: keys => dispatch(ajaxDelete(keys)),
  rename: (currentPath, key) => name => dispatch(fetchRename(key, name, currentPath)),
  addShare: keys => isSecret => dispatch(fetchAddShare(keys, isSecret)),
  resetAddShare: () => dispatch(resetAddShare())

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);