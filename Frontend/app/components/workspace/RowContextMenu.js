import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { FormattedMessage } from 'react-intl'
import {
  ajaxDownload,
  resetAddShare,
  fetchAddShare,
  ajaxDelete,
  fetchRename
} from '../../actions'

class RowContextMenu extends Component {
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
    const { id, fileKey } = this.props;
    return (
      <ContextMenu id={id}>
        <MenuItem >
          <span data-toggle="modal" data-target={`#hover-share-${fileKey}`} >
          <span className="icon-share blue-icon"></span>
            <FormattedMessage id="share" />
          </span>
        </MenuItem >
        <MenuItem onClick={this.downloadHandler}>
        <span className="icon-download blue-icon"></span>
          <FormattedMessage id="download" />
        </MenuItem>
        <MenuItem>
          <span data-toggle="modal" data-target={`#hover-move-${fileKey}`} >
          <span className="icon-moveto blue-icon"></span>
            <FormattedMessage id="move_To" />
          </span>
        </MenuItem>
        <MenuItem>
          <span data-toggle="modal" data-target={`#hover-rename-${fileKey}`} >
          <span className="icon-rename blue-icon"></span>
            <FormattedMessage id="rename" />
          </span>
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={e => this.deleteHandler()} >
        <span className="icon-delete blue-icon"></span>
          <FormattedMessage id="delete" />
        </MenuItem>
      </ContextMenu>
    )
  }
}


RowContextMenu.propTypes = {
  addShareLink: PropTypes.object.isRequired,
  download: PropTypes.func.isRequired,
  resetAddShare: PropTypes.func.isRequired,
  addShare: PropTypes.func.isRequired,
  deleteFiles: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  addShareLink: state.share.addShare,
  currentPath: state.workspace.currentPath
})

const mapDispatchToProps = dispatch => ({
  download: keys => dispatch(ajaxDownload(keys)),
  resetAddShare: () => dispatch(resetAddShare()),
  addShare: keys => isSecret => dispatch(fetchAddShare(keys, isSecret)),
  deleteFiles: keys => dispatch(ajaxDelete(keys)),
  rename: (currentPath, key) => name => dispatch(fetchRename(key, name, currentPath))
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RowContextMenu);

