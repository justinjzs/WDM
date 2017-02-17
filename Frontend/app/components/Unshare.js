import React, { Component } from 'react'

export default class Unshare extends Component {
  render() {
    const { unshareHandler } = this.props;
    return (
      <div id="unshare-div">
      <button type="button" className="btn btn-default btn-sm tool" data-toggle="modal" data-target="#unshare">
          <img src="/css/svg/rename.svg" className="funcbarsvg" /> Unshare 
        </button>
      <div id="unshare" className="modal fade" ref="modal" role="unshare">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Confirm</h4>
            </div>
            <div className="modal-body">
              <span>Are you sure you want to unshare?</span>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => unshareHandler()}>Unshare</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}