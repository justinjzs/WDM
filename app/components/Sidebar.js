import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import merge from 'deepmerge'
import { fetchAllFolders } from '../actions'


class Sidebar extends Component {
  componentWillMount() {
    this.props.loadTreeHandler();
  }
  render() {
    return (
      <div className="nav-side-menu">
        <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>

        <div className="menu-list">

          <ul id="menu-content" className="menu-content collapse out">

            <li data-toggle="collapse" data-target="#products" className="collapsed active">
              <a href="#"><i className="fa fa-home fa-lg"></i> Home <span className="arrow"></span></a>
            </li>
            <ul className="sub-menu collapse" id="products">
              <li className="active"><a href="#">CSS3 Animation</a></li>
              <li><a href="#">General</a></li>
              <li><a href="#">Buttons</a></li>
            </ul>
            <li>
              <a href="#">
                <i className="fa fa-share-alt fa-lg"></i> Share
                  </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
};

Sidebar.propTypes = {
  tree: PropTypes.object.isRequired,
  loadTreeHandler: PropTypes.func.isRequired

};

const mapStateToProps = state => ({
  tree: merge({}, state.tree, {clone: true})
});

const mapDispatchToProps = dispatch => ({
  loadTreeHandler: () => dispatch(fetchAllFolders())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)