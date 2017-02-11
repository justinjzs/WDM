import React, { Component } from 'react';
//import { Navbar, FormGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';

export default class Header extends Component {
  render() {
    return (
      <nav className="header navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <img src="/css/svg/wdm.svg" className="logo" /><span id="description" >Document Manager</span>
          </div>
            <div className="input-group nav navbar-nav">
              <div className="input-group-btn search-panel">
                <button type="button" className="btn btn-default dropdown-toggle" id="filter" data-toggle="dropdown">
                  <span id="search_concept">All Files</span> <span className="caret"></span>
                </button>
                  <ul className="dropdown-menu" role="menu">
                    <li><a href="#contains">This Folder</a></li>
                    <li><a href="#its_equal">All Files</a></li>
                  </ul>
              </div>
              <input type="text" className="form-control"id="search" placeholder="Search term..." />
              <span className="input-group-btn">
                <button className="btn btn-default" type="button" id="submit" ><img src="/css/svg/search.svg" /></button>
              </span>
            </div>
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#"><img src="/css/svg/user.svg" /> Hi</a></li>
            <li><a href="/logout"><span className="fa fa-sign-out fa-2x"></span> Log out</a></li>
          </ul>
        </div>
      </nav>
    );
  }
}