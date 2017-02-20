import React, { Component } from 'react'

export default class UploadFiles extends Component {
  render() {
    const { uploadHandler } = this.props
    return ( 
      <label id="upload-files" htmlFor="file">
        <input id='file' type='file'  name='files'  multiple='multiple' onChange={() => uploadHandler()}/>
        <i className="fa fa-file" aria-hidden="true">Upload Files</i>
      </label>
    )
  }
}