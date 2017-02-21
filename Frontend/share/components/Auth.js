import React, { Component } from 'react'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

class Auth extends Component {
  clickHandler() {
    const { authWithSecret } = this.props;
    authWithSecret(this.input.value);
  }
  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          <div className="cover-container">
            <div className="inner cover">
              <div>
              <img src='/css/svg/wdm.svg' id="logo" />
              <span className="banner"><FormattedMessage id="authpage_Description" /></span>
              </div>
              <div className="lead">
                <input type="text" className="secret-input" ref={e => this.input = e } placeholder={formatMessage({id: 'authpage_Input_PlaceHolder'})} />
                <a href="#" className="btn btn-default btn-lg"
                  onClick={() => this.clickHandler()} >
                  <FormattedMessage id="extract" /></a></div>
            </div>


          </div>
        </div>
      </div>
    )
  }
}

Auth.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(Auth);