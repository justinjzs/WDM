import React, { Component } from 'react';
import Breadcrumb from './Breadcrumb'

export default class Functionbar extends Component {
  render() {
    return (
      <div className="displaybar">
      <Breadcrumb pathName="/home/a/b" />
      </div>
    );
  }
}