import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

export default class Unshare extends Component {
  render() {
    const { unshareHandler } = this.props;
    return (
      <div id="unshare-div">
      <button type="button" className="btn btn-default btn-sm tool" data-toggle="modal" data-target="#unshare">
          <span className="icon-cancelshare functionbar green-icon"></span> <FormattedMessage id="unshare" /> 
        </button>
      <div id="unshare" className="modal fade" ref="modal" role="unshare">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title"><FormattedMessage id="confirm" /></h4>
            </div>
            <div className="modal-body">
              <FormattedMessage id="confirm_Unshare" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage id="close" />
              </button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => unshareHandler()}>
                <FormattedMessage id="unshare" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}