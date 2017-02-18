import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Header from './components/Header'
import Workspace from './components/Workspace'
import Auth from './components/Auth'
import {
  fetchAuth,
  fetchAuthWithSecret
} from './actions'
import $ from 'jquery'
import 'bootstrap'
import '../asset/css/share.css'
//import '../asset/css/libs/bootstrap.min.css'

class Share extends Component {
  componentWillMount() {
    this.props.auth();
  }
  render() {
    const { isAuthed, authWithSecret } = this.props;
    return (
      <div>
        {isAuthed ?
          <div>
            <Header />
            <Workspace />
          </div> :
          <Auth authWithSecret={authWithSecret} />}
      </div>
    )
  }
}

Share.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
  auth: PropTypes.func.isRequired,
  authWithSecret: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isAuthed: state.auth.isAuthed,
})
const mapDispatchToProps = dispatch => ({
  auth: () => dispatch(fetchAuth()),
  authWithSecret: secret => dispatch(fetchAuthWithSecret(secret))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Share)