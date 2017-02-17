import React, { Component } from 'react'
import Collapse from './Collapse'
import View from './View'
export default class New extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedFolder: 0,
      newPath: '/'
    }
    this.clickHandler = this.clickHandler.bind(this);
  }
  clickHandler(key, newPath) {
    this.setState({
      selectedFolder: key,
      newPath
    })
  }
  render() {
    let src = this.state.selectedFolder ? "/css/svg/folder_24pix.svg" : "/css/svg/folder_green_16pix.svg";
    const { tree, moveHandler } = this.props;
    const { selectedFolder, newPath } = this.state;
    return (
      <div id="move-div">
        <button type="button" className="btn btn-default btn-sm tool" data-toggle="modal" data-target="#moveto">
          <img src="/css/svg/moveto.svg" className="funcbarsvg" /> Move to
        </button>
        <div id="moveto" className="modal fade" ref="modal" role="move to">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Move to</h4>
              </div>
              <div className="modal-body">
                <img className="view-icon" src={src} /><a data-toggle="collapse" href="#movehome" onClick={() => this.clickHandler(0, '/')}>Home</a>
                <View folders={tree.home.children}
                      level={1} 
                      selected={selectedFolder}
                      clickHandler={this.clickHandler}
                      dist="movehome"/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => moveHandler(newPath)} >Move</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}