import React, { Component, PropTypes } from 'react';
import Row from './Row';
import Displaybar from './Displaybar';
import { connect } from 'react-redux'
import getIconName from '../utils/getIconName'
import formatBytes from '../utils/formatBytes'
import {
  fetchCurrentFiles,
  selectFile,
  selectAll,
  sortByName,
  sortBySize,
  sortByLastTime,
  sortByCreateTime
} from '../actions'
import merge from 'deepmerge'

class Workspace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: false
    }
    this.changeOrder = this.changeOrder.bind(this);
    this.checkAllHandler = this.checkAllHandler.bind(this);
  }
  componentWillMount() {
    this.props.loadFilesHandler();
  }
  changeOrder() {
    this.setState({
      order: !this.state.order
    })
  }

  checkAllHandler(e) {
    this.props.selectAll(e.target.checked);
  }
  render() {
    const { order } = this.state;
    const { currentFiles,
      currentPath,
      map,
      loadFilesHandler,
      selectFile,
      sortByName,
      sortBySize,
      sortByLastTime,
      sortByCreateTime } = this.props;

    return (
      <div className="table-responsive workspace">
        <Displaybar {...this.props} />
        <table className="table table-hover" >
          <thead>
            <tr>
              <th className="center-cell" width="50px">
                <div className="checkbox">
                  <input type='checkbox' className="styled" onChange={e => this.checkAllHandler(e)} />
                  <label></label>
                </div>
              </th>
              <th width="40%">Name<a href="javascript:void(0)" 
                                     onClick={() => {sortByName(order); this.changeOrder();}}>
                <i className="fa fa-sort" aria-hidden="true"></i></a>
              </th>
              <th >Size<a href="javascript:void(0)" 
                          onClick={() => {sortBySize(order); this.changeOrder();}}>
                <i className="fa fa-sort" aria-hidden="true"></i></a>
              </th>
              <th >LastModified<a href="javascript:void(0)" 
                                  onClick={() => {sortByLastTime(order); this.changeOrder();}}>
                <i className="fa fa-sort" aria-hidden="true"></i></a>
              </th>
              <th>CreateTime<a href="javascript:void(0)" 
                               onClick={() => {sortByCreateTime(order); this.changeOrder();}}>
                <i className="fa fa-sort" aria-hidden="true"></i></a>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentFiles.map(file => {
              return (
                <Row key={file.key} {...file}
                  fileKey={file.key}
                  size={formatBytes(file.size, 0)}
                  checkHandler={selectFile}
                  icon={getIconName(file)}
                  path={file.path + file.key + '/'}
                  clickHandler={loadFilesHandler} />
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
  currentPath: PropTypes.string.isRequired,
  map: PropTypes.object.isRequired,
  isSearch: PropTypes.bool.isRequired,
  loadFilesHandler: PropTypes.func.isRequired,
  selectFile: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  sortByName: PropTypes.func.isRequired,
  sortBySize: PropTypes.func.isRequired,
  sortByLastTime: PropTypes.func.isRequired,
  sortByCreateTime: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentFiles: merge({}, state.workspace.currentFiles, { clone: true }),
  currentPath: state.workspace.currentPath,
  map: merge({}, state.tree.map, { clone: true }),
  isSearch: state.workspace.isSearch
})

const mapDispatchToProps = dispatch => ({
  loadFilesHandler: path => dispatch(fetchCurrentFiles(path)),
  selectFile: key => dispatch(selectFile(key)),
  selectAll: checked => dispatch(selectAll(checked)),
  sortByName: order => dispatch(sortByName(order)),
  sortBySize: order => dispatch(sortBySize(order)),
  sortByLastTime: order => dispatch(sortByLastTime(order)),
  sortByCreateTime: order => dispatch(sortByCreateTime(order))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace);