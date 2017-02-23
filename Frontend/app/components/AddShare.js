import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

export default class AddShare extends Component {
  render() {
    const { addShareHandler, addShareLink, resetHandler, id } = this.props;
    return (
        <div id={id || "addshare"} className="modal fade addshare-modal" ref="modal" role="add share">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" onClick={() => resetHandler()}>&times;</button>
                <h4 className="modal-title"><FormattedMessage id="create_Share_Link" /></h4>
              </div>
              {addShareLink.link ?
                <div className="modal-body">
                  <div><a href={`http://localhost:3000/share?addr=${addShareLink.link}`}>
                  <FormattedMessage id="new_Share_Link" values={{addr: addShareLink.link}} /></a></div>
                  <div>{addShareLink.secret && <FormattedMessage id="new_Share_Serect" values={{secret: addShareLink.secret}} />}</div>
                </div> :
                <div className="modal-body">
                  <div>
                    <button className="btn btn-primary btn-sm" onClick={() => addShareHandler(false)}>
                      <FormattedMessage id="create_Public_Link" />
                    </button>
                    <FormattedMessage id="public_Link_Description" />
                  </div>
                  <div>
                    <button className="btn btn-primary btn-sm" onClick={() => addShareHandler(true)}>
                      <FormattedMessage id="create_Secret_Link" />
                    </button>
                    <FormattedMessage id="secret_Link_Description" />
                  </div>
                </div>}
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={() => resetHandler()}><FormattedMessage id="close" /></button>
              </div>
            </div>
          </div>
        </div>
    )
  }
}