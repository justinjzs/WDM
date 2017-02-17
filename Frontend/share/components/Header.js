import React, { Component } from 'react'

export default class Header extends Component {
  render() {
    return(
      <div className="header">
        <img src="/css/svg/wdm.svg" className="logo" />
        <span className="description">Document Manager</span>
      </div>
    )
  }
}