import React, { Component } from 'react'

export default class UploadDir extends Component {
  componentDidMount() {
    this.input.webkitdirectory = true;
  }

  render() {
    const { currentPath, uploadDirHandler } = this.props;
    return (
      <label htmlFor="dir">
        <input id='dir' type="file" name='dir' ref={e => this.input = e} onChange={() => uploadDirHandler(currentPath)} />
        <li><i className="fa fa-folder" aria-hidden="true">Upload Folder</i></li>
      </label>
    )
  }
}