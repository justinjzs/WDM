import React, { Component } from 'react';
import Breadcrumb from './Breadcrumb'

export default class Displaybar extends Component {
  render() {
    return (
      <div className="displaybar">
      <Breadcrumb {...this.props} />
      </div>
    );
  }
}