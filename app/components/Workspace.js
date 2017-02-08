import React, { Component, PropTypes } from 'react';
import Row from './Row';
import Displaybar from './Displaybar';
import { connect } from 'react-redux'
import { fetchCurrentFiles } from '../actions'

class Workspace extends Component {
  componentWillMount() {
    this.props.loadFilesHandler();
  }
  render() {

    const { currentFiles, loadFilesHandler } = this.props;

    return (
      <div className="table-responsive workspace">
        <Displaybar />
        <table className="table table-striped table-bordered table-hover" >
          <thead>
            <tr>
              <th >
                <input type='checkbox' />
              </th>
              <th >Name</th>
              <th >Size</th>
              <th >LastModified</th>
              <th>CreateTime</th>
            </tr>
          </thead>
          <tbody>
            {currentFiles.map(file => {
              file.iconClass = 'fa fa-folder fa-2x';
              return (
                <Row key={file.key} {...file} onClick={loadFilesHandler} />
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

Workspace.propTypes = {
  currentFiles: PropTypes.array.isRequired,
  loadFilesHandler: PropTypes.func.isRequired 
};

const mapStateToProps = state => ({
  currentFiles: state.currentFiles
})

const mapDispatchToProps = dispatch => ({
  loadFilesHandler: key => dispatch(fetchCurrentFiles(key))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace);