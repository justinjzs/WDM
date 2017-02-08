import React, { Component } from 'react';


export default class Functionbar extends Component {
  render() {
    //const { section } = this.props;
    return (
      <div className="functionbar">
        <button type="button" id="new" className="btn btn-default btn-sm">
          <img src="/css/svg/new.svg" className="funcbarsvg" /> New
        </button>
        <button type="button" id="upload" className="btn btn-default btn-sm">
          <img src="/css/svg/upload.svg" className="funcbarsvg" /> Upload
        </button>
      </div>
    );
  }
}