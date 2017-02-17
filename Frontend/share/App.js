import React, { Component, PropTypes } from 'react'
import Header from './components/Header'
import Workspace from './components/Workspace'
import $ from 'jquery'
import 'bootstrap'
import '../asset/css/share.css'
//import '../asset/css/libs/bootstrap.min.css'

export default class Share extends Component {
  componentWillMount() {
  
  }
  render() {
    return (
      <div>
        <Header />
        <Workspace/>
      </div>
    )
  }
} 