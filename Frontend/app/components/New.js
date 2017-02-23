import React, { Component } from 'react'

export default class New extends Component {
  constructor(props) {
    super(props);
    this.textFocus = this.textFocus.bind(this);
  }
  componentDidMount() {
    $('#newFolder').on('shown.bs.modal', () => alert('123'));
  }
  componentWillUnmount() {
    $('#newFolder').off('shown.bs.modal', this.textFocus);
  }
  textFocus() {
    this.input.focus();
    $('#newFolder input').select();
  }
  mkdir() {
    const name = this.input.value;
    name && this.props.mkdirHandler(name);
  }

  render() {
    return (
      <div id="newFolder" className="modal fade" ref="modal" role="new folder">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Folder Name</h4>
            </div>
            <div className="modal-body">
              <input type="text" style={{width: "270px"}} ref={e => this.input = e} defaultValue="Untitled"/>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.mkdir()}>New</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}