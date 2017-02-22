import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

export default class UploadFiles extends Component {
  render() {
    const { uploadHandler } = this.props
    return ( 
      <label id="upload-files" htmlFor="file">
        <input id='file' type='file'  name='files'  multiple='multiple' onChange={() => uploadHandler()}/>
        <span className="icon-upload green-icon in-label"></span><span className="in-label"><FormattedMessage id="upload_Files" /></span>
      </label>
    )
  }
}