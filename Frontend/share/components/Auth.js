import React, { Component } from 'react'

class Auth extends Component {
  clickHandler() {
    const { authWithSecret } = this.props;
    authWithSecret(this.input.value);
  }
  render() {

    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          <div className="cover-container">
            <div className="inner cover">
              <div>
              <img src='/css/svg/wdm.svg' id="logo" />
              <span className="banner">Your personal document manager</span>
              </div>
              <div className="lead">
                <input type="text" className="secret-input" ref={e => this.input = e } placeholder="Please input secret to extract" />
                <a href="#" className="btn btn-default btn-lg"
                  onClick={() => this.clickHandler()} >
                  <span>Extract</span></a></div>
            </div>


          </div>
        </div>
      </div>
    )
  }
}



export default Auth;