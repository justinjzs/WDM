import React, { Component } from 'react'

export default class Toolbar extends Component {
  render() {
    const { deleteHandler, downloadHandler } = this.props;
    return (
      <div className="toolbar">
        <button type="button" className="btn btn-default btn-sm tool" >
          <img src="/css/svg/share_green.svg" className="funcbarsvg" />Share 
        </button>
        <button type="button" className="btn btn-default btn-sm tool" onClick={() => downloadHandler() }>
          <img src="/css/svg/download.svg" className="funcbarsvg" /> Download 
        </button>
        <button type="button" className="btn btn-default btn-sm tool" onClick={() => deleteHandler()}>
          <img src="/css/svg/delete.svg" className="funcbarsvg" /> Delete 
        </button>
        <button type="button" className="btn btn-default btn-sm tool" >
          <img src="/css/svg/moveto.svg" className="funcbarsvg" /> Move to
        </button>
        <button type="button" className="btn btn-default btn-sm tool" >
          <img src="/css/svg/rename.svg" className="funcbarsvg" /> Rename 
        </button>
      </div>
    )
  }
}