import React, { Component, PropTypes } from 'react';
import Row from './Row';
import Displaybar from './Displaybar';
import { connect } from 'react-redux'
import { fetchCurrentFiles, selectFile, selectAll, ajaxDelete, download } from '../actions'
import merge from 'deepmerge'

class Workspace extends Component {
  componentWillMount() {
    this.props.loadFilesHandler();
  }

  checkAllHandler(e) {
    this.props.selectAll(e.target.checked);
  }

  getIconName(file) {
    if (file.isdir)
      return 'folder_24pix.svg';
    let extname = file.name.match(/\.(doc|docx|pdf|xls|gif|jpg|svg|jpeg|png|mp4|avi|rmvb|wmv|mov|flv|webm|zip|rar|7z)$/i);
    if (extname)
      extname = extname[0];
    switch (extname) {
      case '.doc':
      case '.docx':
        return 'doc.svg';
      case '.pdf':
        return 'pdf.svg';
      case '.xls':
        return 'xls.svg'
      case '.gif':
      case '.svg':
      case '.jpg':
      case '.jpeg':
      case '.png':
        return 'image.svg';
      case '.mp4':
      case '.avi':
      case '.rmvb':
      case '.wmv':
      case '.mov':
      case '.flv':
      case 'webm':
        return 'video.svg';
      case 'zip':
      case 'rar':
      case '7z':
        return 'zip.svg'
      default:
        return 'other.svg';
    }
  }

  formatBytes(bytes,decimals = 3) {
    if(!bytes)
      return bytes;
    if(bytes == 0) return '0 Bytes';
    var k = 1000,
    dm = decimals,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
  render() {

    const { currentFiles, 
            currentPath, 
            map, 
            loadFilesHandler, 
            selectFile } = this.props;

    return (
      <div className="table-responsive workspace">
        <Displaybar {...this.props} />
        <table className="table table-hover" >
          <thead>
            <tr>
              <th className="center-cell" width="50px">
              <div className="checkbox">
                <input type='checkbox' className="styled" onChange={e => this.checkAllHandler(e)}/>
                <label></label>
              </div>                
              </th>
              <th width="40%">Name</th>
              <th >Size</th>
              <th >LastModified</th>
              <th>CreateTime</th>
            </tr>
          </thead>
          <tbody>
            {currentFiles.map(file => {
              return (
                <Row key={file.key} {...file} fileKey={file.key} size={this.formatBytes(file.size, 0)} checkHandler={selectFile} icon={this.getIconName(file)} path={file.path + file.key + '/'} clickHandler={loadFilesHandler} />
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}


Workspace.propTypes = {
  currentFiles: PropTypes.array.isRequired,
  currentPath: PropTypes.string.isRequired,
  map: PropTypes.object.isRequired,
  loadFilesHandler: PropTypes.func.isRequired,
  selectFile: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  deleteFiles: PropTypes.func.isRequired,
  download: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentFiles: merge({}, state.workspace.currentFiles, {clone: true}),
  currentPath: state.workspace.currentPath,
  map: merge({}, state.tree.map, {clone: true})
})

const mapDispatchToProps = dispatch => ({
  loadFilesHandler: path => dispatch(fetchCurrentFiles(path)),
  selectFile: key => dispatch(selectFile(key)),
  selectAll: checked => dispatch(selectAll(checked)),
  deleteFiles: currentFiles => dispatch(ajaxDelete(currentFiles)),
  download: currentFiles => dispatch(download(currentFiles))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace);