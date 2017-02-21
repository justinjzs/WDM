import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import {
  ajaxDownload,
  resetAddShare,
  fetchAddShare,
  ajaxDelete,
  fetchRename,
  fetchMove
} from '../actions'
import merge from 'deepmerge'
import AddShare from './AddShare'
import Rename from './Rename'
import Move from './Move'

class Hoverbar extends Component {
  constructor(props) {
    super(props);
    this.downloadHandler = this.downloadHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.addShareHandler = this.addShareHandler.bind(this);
    this.renameHandler = this.renameHandler.bind(this);
  }
  addShareHandler() {
    const { addShare, fileKey } = this.props;
    return addShare([fileKey]);
  }
  deleteHandler() {
    const { fileKey, deleteFiles } = this.props;
    deleteFiles([fileKey]);
  }
  moveHandler() {
    const { currentPath, fileKey, move } = this.props;
    return move([fileKey], currentPath);
  }
  renameHandler() {
    const { currentPath, fileKey, rename } = this.props;
    return rename(currentPath, fileKey);
  }
  downloadHandler(e) {
    e.stopPropagation();
    const { fileKey, download } = this.props;
    download([fileKey]);
    return false;
  }
  render() {
    const {fileKey, addShareLink, resetAddShare, name, tree} = this.props;
    return (
      <div className="hoverbar">
        <a href="#" data-toggle="modal" data-target={`#hover-share-${fileKey}`} ><img className="hoversvg" src="/css/svg/share_blue.svg" /></a>
        <AddShare id={`hover-share-${fileKey}`}
          addShareHandler={this.addShareHandler()}
          resetHandler={resetAddShare}
          addShareLink={addShareLink} />
        <img className="hoversvg" src="/css/svg/download_blue.svg" onClick={this.downloadHandler} />
        <div className="dropdown hover-more">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" onClick={e => e.stopPropagation()}><img className="hoversvg" src="/css/svg/more.svg" /></a>
          <ul className="dropdown-menu">
            <li><a href="#" data-toggle="modal" data-target={`#hover-rename-${fileKey}`} >
              <FormattedMessage id="rename" />
            </a>
            </li>
            <li><a href="#" data-toggle="modal" data-target={`#hover-move-${fileKey}`}><FormattedMessage id="share" /></a></li>
            <li><a href="#" onClick={e => this.deleteHandler()}><FormattedMessage id="delete" /></a></li>
          </ul>
        </div>
        <Rename id={`hover-rename-${fileKey}`} name={name} renameHandler={this.renameHandler()} />
        <Move tree={tree} moveHandler={this.moveHandler()} id={`hover-move-${fileKey}`} />
      </div>
    )
  }
}

Hoverbar.propTypes = {
  addShareLink: PropTypes.object.isRequired,
  download: PropTypes.func.isRequired,
  resetAddShare: PropTypes.func.isRequired,
  addShare: PropTypes.func.isRequired,
  deleteFiles: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  tree: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  addShareLink: state.share.addShare,
  currentPath: state.workspace.currentPath,
  tree: merge({}, state.tree, { clone: true })
})

const mapDispatchToProps = dispatch => ({
  download: keys => dispatch(ajaxDownload(keys)),
  resetAddShare: () => dispatch(resetAddShare()),
  addShare: keys => isSecret => dispatch(fetchAddShare(keys, isSecret)),
  deleteFiles: keys => dispatch(ajaxDelete(keys)),
  rename: (currentPath, key) => name => dispatch(fetchRename(key, name, currentPath)),
  move: (keys, prePath) => newPath => dispatch(fetchMove(keys, prePath, newPath))
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hoverbar);

