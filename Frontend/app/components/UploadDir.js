import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

export default class UploadDir extends Component {
  componentDidMount() {
    this.input.webkitdirectory = true;
  }

  render() {
    const { uploadDirHandler } = this.props;
    return (
      <label id="upload-dir" htmlFor="dir">
        <input id='dir' type="file" name='dir' ref={e => this.input = e} onChange={() => uploadDirHandler()} />
        <i className="fa fa-folder" aria-hidden="true"><FormattedMessage id="upload_Folder" /></i>
      </label>
    )
  }
}