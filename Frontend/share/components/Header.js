import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

export default class Header extends Component {
  render() {
    return(
      <div className="header">
        <img src="/css/svg/wdm.svg" className="logo" />
        <span className="description"><FormattedMessage id="app_Description" /></span>
      </div>
    )
  }
}