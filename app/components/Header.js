import React, { Component } from 'react';
//import { Navbar, FormGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';

export default class Header extends Component {
  render() {
    return (
      <nav className="header navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">WDM</a>
          </div>
          <form className="navbar-form navbar-left">
            <div className="form-group">
              <input type="text" id="search" className="form-control" placeholder="Search" />
            </div>
            <div className="dropdown form-group">
              <button className="btn form-control dropdown-toggle" type="button" data-toggle="dropdown">This Folder
  <span className="caret"></span></button>
              <ul className="dropdown-menu">
                <li><a href="#">This Folder</a></li>
                <li><a href="#">All Files</a></li>
              </ul>
            </div>
          </form>
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#"><span className="fa fa-user fa-2x"></span> Username</a></li>
            <li><a href="#"><span className="fa fa-sign-out fa-2x"></span> Log out</a></li>
          </ul>
        </div>
      </nav>
    );
  }
}