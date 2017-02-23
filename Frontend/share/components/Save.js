import React, { Component } from 'react'
import View from './View'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
export default class SaveTo extends Component {
  constructor(props) {
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
    const { tree, saveHandler } = this.props;
    const { selectedFolder, newPath } = this.state;
    const flag = selectedFolder === 0;
    const cls = classNames({
      'icon-folder': true,
      'green-icon': flag,
      'yellow-icon': !flag
    })
    return (
      <div id="Save-div">
        <button type="button" className="btn btn-default btn-sm tool" data-toggle="modal" data-target="#Saveto">
          <span className="icon-saveas green-icon"></span>
          <FormattedMessage id="save_To" />
        </button>
        <div id="Saveto" className="modal fade" ref="modal" role="Save to">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title"><FormattedMessage id="save_To" /></h4>
              </div>
              <div className="modal-body">
                <span className={cls}></span>
                <a data-toggle="collapse" href="#movehome" onClick={() => this.clickHandler(0, '/')}>
                  <FormattedMessage id="home" />
                </a>
                <View folders={tree.children}
                  level={1}
                  selected={selectedFolder}
                  clickHandler={this.clickHandler}
                  dist="movehome" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">
                  <FormattedMessage id="close" />
                </button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => saveHandler(newPath)} ><FormattedMessage id="save" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}