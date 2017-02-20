import React, { Component } from 'react'

export default class Rename extends Component {
  constructor(props) {
    super(props);
    this.textFocus = this.textFocus.bind(this);
  }
  componentDidMount() {
    $('#rename').on('shown.bs.modal', this.textFocus);
  }
  componentWillUnmount() {
    $('#rename').off('shown.bs.modal', this.textFocus);
  }
  textFocus() {
    this.input.focus();
    $('#rename input').select();
  }
  rename() {
    const {renameHandler} = this.props;
    const name = this.input.value;
    name && renameHandler(name);
  }

  render() {
    return (
      <div id={this.props.id || "rename"} className="modal fade" ref="modal" role="rename">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">New Name</h4>
            </div>
            <div className="modal-body">
              <input type="text" style={{width: "270px"}} ref={e => this.input = e} defaultValue={this.props.name}/>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.rename()}>Rename</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}