import React, { Component } from 'react';


export default class Header extends Component {
  render() {
    return (
      <div className="nav-side-menu">
        <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>

        <div className="menu-list">

          <ul id="menu-content" className="menu-content collapse out">

            <li data-toggle="collapse" data-target="#products" className="collapsed active">
              <a href="#"><i className="fa fa-home fa-lg"></i> Home <span className="arrow"></span></a>
            </li>
            <ul className="sub-menu collapse" id="products">
              <li className="active"><a href="#">CSS3 Animation</a></li>
              <li><a href="#">General</a></li>
              <li><a href="#">Buttons</a></li>
            </ul>
            <li>
              <a href="#">
                <i className="fa fa-share-alt fa-lg"></i> Share
                  </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}