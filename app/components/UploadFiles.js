import React, { Component } from 'react'

export default class UploadFiles extends Component {
  render() {
    const { currentPath, uploadHandler } = this.props
    return ( 
      <label>
        <input id='file' type='file'  name='files'  multiple='multiple' onChange={() => uploadHandler(currentPath)}/>
        <li><i className="fa fa-file" aria-hidden="true">Upload Files</i></li>
      </label>
    )
  }
}