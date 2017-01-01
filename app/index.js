//16.12.25 
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import marked from 'marked'
import '../node_modules/bootstrap/scss/bootstrap.scss';

class Contain extends Component {
	render() {
		return (
			<div>
			  <p> contain </p>
			</div>
		)
	}

}


ReactDOM.render(
  <Contain />,
  document.getElementById('root')
)
