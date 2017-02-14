import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import New from './New'
import UploadFiles from './UploadFiles'
import UploadDir from './UploadDir'
import { fetchCurrentFiles, fetchMkdir, ajaxUpload ,ajaxUploadDir } from '../actions'

class Functionbar extends Component {
  render() {
    const { currentPath, upload, uploadDir, mkdir } = this.props;
    return (
      
      <div className="functionbar">
        <New mkdirHandler={mkdir} currentPath={currentPath}/>
        <div className="dropdown" id="upload-dropdown">
          <button type="button" id="upload"  className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
            <img src="/css/svg/upload.svg" className="funcbarsvg" />Upload <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            <UploadFiles uploadHandler={upload} currentPath={currentPath} />
            <UploadDir uploadDirHandler={uploadDir} currentPath={currentPath} />
          </ul>
        </div>
      </div>
    );
  }
}

Functionbar.propTypes = {
  currentPath: PropTypes.string.isRequired,
  upload: PropTypes.func.isRequired,
  uploadDir: PropTypes.func.isRequired,
  mkdir: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  currentPath: state.workspace.currentPath
})

const mapDispatchToProps = dispatch => ({
  upload: path => dispatch(ajaxUpload(path)),
  uploadDir: path => dispatch(ajaxUploadDir(path)),
  mkdir: (name, path) => dispatch(fetchMkdir(name, path))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Functionbar)