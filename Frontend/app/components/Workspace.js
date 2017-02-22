import React, { Component, PropTypes } from 'react';
import Row from './Row';
import Displaybar from './Displaybar';
import { connect } from 'react-redux'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import getIconName from '../utils/getIconName'
import formatBytes from '../utils/formatBytes'
import Message from './Message'
import New from './New'
import { FormattedMessage } from 'react-intl'
import {
  fetchCurrentFiles,
  fetchMkdir,
  selectFile,
  selectAll,
  sortByName,
  sortBySize,
  sortByLastTime,
  sortByCreateTime,
  hideMessage
} from '../actions'
import merge from 'deepmerge'

class Workspace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: false
    }
    this.changeOrder = this.changeOrder.bind(this);
    this.checkAllHandler = this.checkAllHandler.bind(this);
    this.mkdirHandler = this.mkdirHandler.bind(this);
  }

  componentWillMount() {
    this.props.loadFilesHandler();
  }
  changeOrder() {
    this.setState({
      order: !this.state.order
    })
  }
  mkdirHandler() {
    const { currentPath, mkdir } = this.props;
    return mkdir(currentPath);
  }
  checkAllHandler(e) {
    this.props.selectAll(e.target.checked);
  }
  render() {
    const { order } = this.state;
    const { currentFiles,
      currentPath,
      map,
      loadFilesHandler,
      selectFile,
      sortByName,
      sortBySize,
      sortByLastTime,
      sortByCreateTime,
      hideHandler,
      message
 } = this.props;

    return (
      <ContextMenuTrigger attributes={{ className: 'table-responsive workspace' }} id="under-table">
        <Displaybar {...this.props} />
        <table className="table table-hover" >
          <thead>
            <tr>
              <th width="50px">
                <div className="checkbox">
                  <input type='checkbox' className="center-checkbox" className="styled" onChange={e => this.checkAllHandler(e)} />
                  <label></label>
                </div>
              </th>
              <th width="50%">
              <FormattedMessage id="file_Name" />
              <a href="javascript:void(0)"
                onClick={() => { sortByName(order); this.changeOrder(); } }>
                <i className="fa fa-sort" aria-hidden="true"></i></a>
              </th>
              <th >
              <FormattedMessage id="file_Size" />
              <a href="javascript:void(0)"
                onClick={() => { sortBySize(order); this.changeOrder(); } }>
                <i className="fa fa-sort" aria-hidden="true"></i></a>
              </th>
              <th >
              <FormattedMessage id="file_LastModified" />
              <a href="javascript:void(0)"
                onClick={() => { sortByLastTime(order); this.changeOrder(); } }>
                <i className="fa fa-sort" aria-hidden="true"></i></a>
              </th>
              <th>
              <FormattedMessage id="file_CreateTime" />
              <a href="javascript:void(0)"
                onClick={() => { sortByCreateTime(order); this.changeOrder(); } }>
                <i className="fa fa-sort" aria-hidden="true"></i></a>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentFiles.map(file => {
              return (
                <Row key={file.key} {...file}
                  fileKey={file.key}
                  size={formatBytes(file.size, 0)}
                  checkHandler={selectFile}
                  icon={getIconName(file)}
                  path={file.path + file.key + '/'}
                  clickHandler={loadFilesHandler} />
              )
            })}
          </tbody>
        </table>

        {message.show && <Message message={message} hideHandler={hideHandler} />}
        
        <ContextMenu id="under-table" >
          <MenuItem>
            <span data-toggle="modal" data-target="#newFolder">
            <span className="icon-new blue-icon"></span>
            <FormattedMessage id="new_Folder" /></span>
          </MenuItem>
          <MenuItem onClick={() => $('#upload-files').click()}>
          <span className="icon-upload blue-icon"></span>
            <FormattedMessage id="upload_Files" />
          </MenuItem>
          <MenuItem divider />
          <MenuItem onClick={() => $('#upload-dir').click()}>
          <span className="icon-uploadfolder blue-icon"></span>
            <FormattedMessage id="upload_Folder" />
          </MenuItem>
        </ContextMenu>
        <New mkdirHandler={this.mkdirHandler()} />
      </ContextMenuTrigger>
    );
  }
}


Workspace.propTypes = {
  currentFiles: PropTypes.array.isRequired,
  currentPath: PropTypes.string.isRequired,
  map: PropTypes.object.isRequired,
  isSearch: PropTypes.bool.isRequired,
  loadFilesHandler: PropTypes.func.isRequired,
  selectFile: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  sortByName: PropTypes.func.isRequired,
  sortBySize: PropTypes.func.isRequired,
  sortByLastTime: PropTypes.func.isRequired,
  sortByCreateTime: PropTypes.func.isRequired,
  mkdir: PropTypes.func.isRequired,
  hideHandler: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  currentFiles: merge({}, state.workspace.currentFiles, { clone: true }),
  currentPath: state.workspace.currentPath,
  map: merge({}, state.tree.map, { clone: true }),
  isSearch: state.workspace.isSearch,
  message: merge({}, state.message, {clone: true})
})

const mapDispatchToProps = dispatch => ({
  loadFilesHandler: path => dispatch(fetchCurrentFiles(path)),
  selectFile: key => dispatch(selectFile(key)),
  selectAll: checked => dispatch(selectAll(checked)),
  sortByName: order => dispatch(sortByName(order)),
  sortBySize: order => dispatch(sortBySize(order)),
  sortByLastTime: order => dispatch(sortByLastTime(order)),
  sortByCreateTime: order => dispatch(sortByCreateTime(order)),
  mkdir: path => name => dispatch(fetchMkdir(name, path)),
  hideHandler: () => dispatch(hideMessage())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace);