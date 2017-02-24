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
        <span className="icon-uploadfolder green-icon in-label"></span><span className="in-label">
          <FormattedMessage id="upload_Folder" />
        </span>
      </label>
    )
  }
}