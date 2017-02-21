import React, { Component } from 'react'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

export default class Message extends Component {
  render() {
    const { message: {
      text,
      level
    }, hideHandler } = this.props;
    const cls = classNames({
      'alert': true,
      'alert-dismissable': true,
      'alert-danger': level === 'Error',
      'alert-info': level === 'Info',
      'alert-success': level === 'Success'
    })
    return (
      <div className={cls} onClick={() => hideHandler()}>
        <FormattedMessage id={text} />
      </div>
    )
  }
}


