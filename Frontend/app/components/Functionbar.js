import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import New from './New'
import UploadFiles from './UploadFiles'
import UploadDir from './UploadDir'
import { fetchCurrentFiles, ajaxUpload, ajaxUploadDir } from '../actions'

class Functionbar extends Component {
  constructor(props) {
    super(props);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.uploadDirHandler = this.uploadDirHandler.bind(this);
  }
  uploadHandler() {
    const { currentPath, upload } = this.props;
    upload(currentPath);
  }
  uploadDirHandler() {
    const { currentPath, uploadDir } = this.props;
    uploadDir(currentPath);
  }
  render() {
    return (

      <div className="functionbar">
        <button type="button" id="new" className="btn btn-default btn-sm" data-toggle="modal" data-target="#newFolder">
          <img src="/css/svg/new.svg" className="funcbarsvg" />New
        </button>
        <div className="dropdown" id="upload-dropdown">
          <button type="button" id="upload" className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
            <img src="/css/svg/upload.svg" className="funcbarsvg" />Upload <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            <li><UploadFiles uploadHandler={this.uploadHandler} /></li>
            <li><UploadDir uploadDirHandler={this.uploadDirHandler}/></li>
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
}

const mapStateToProps = state => ({
  currentPath: state.workspace.currentPath
})

const mapDispatchToProps = dispatch => ({
  upload: path => dispatch(ajaxUpload(path)),
  uploadDir: path => dispatch(ajaxUploadDir(path)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Functionbar)