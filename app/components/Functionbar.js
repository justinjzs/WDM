import React, { Component } from 'react';
import Breadcrumb from './Breadcrumb';

export default class Functionbar extends Component {
  render() {
    //const { section } = this.props;
    return (
      <nav className="navbar" id="functionbar">
        <div className="container-fluid">
          <button type="button" className="btn navbar-btn btn-default btn-sm">
            <span className="fa fa-folder-o fa-lg"></span> New Folder
        </button>
          {' '}
          <button type="button" className="btn navbar-btn btn-default btn-sm">
            <span className="fa fa-cloud-upload fa-lg"></span> Upload
        </button>
          <Breadcrumb />
        </div>
      </nav>
    );
  }
}