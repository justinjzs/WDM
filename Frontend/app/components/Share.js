import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import merge from 'deepmerge'
import getIconName from '../utils/getIconName'
import Unshare from './Unshare'
import ShareRecord from './ShareRecord'
import { fetchShareRecords,
         selectShareRecords,
         selectAllShareRecords,
         sortShareRecordsByName,
         sortShareRecordsByTime,
         fetchUnshare } from '../actions'

class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: false
    }
    this.changeOrder = this.changeOrder.bind(this);
    this.unshareHandler = this.unshareHandler.bind(this);
  }
  componentWillMount(){
    this.props.loadShareRecords();
  }
  changeOrder() {
    this.setState({
      order: !this.state.order
    })
  }
  unshareHandler() {
    const { unshare, list } = this.props;
    let array = [];
    for (let item of list) {
      if (item.selected)
        array.push(item.addr);
    }
    unshare(array);
  }
  checkHandler(addr) {
    for (let item of this.props.list) {
      if (item.addr === addr)
        item.selected = !item.selected
    }
  }
  render() {
    const { list, 
            checkHandler, 
            checkAllHandler,
            sortByName,
            sortByTime }  = this.props;
    const { order } = this.state;
    let show = false;
    for (let item of list) {
      if (item.selected) {
        show = true;
        break;
      }
    }
    return (
      <div className="sharespace">
        <div className="displaybar">
          <span> My Share</span>
          <div className="toolbar">
          {show && <Unshare unshareHandler={this.unshareHandler}/>}
          </div>         
        </div>
          <table className="table table-hover" >
            <thead>
              <tr>
                <th className="center-cell" width="50px">
                  <div className="checkbox">
                    <input type='checkbox' className="styled" onClick={checkAllHandler} />
                    <label></label>
                  </div>
                </th>
                <th width="40%">Name<a href="javascript:void(0)"
                  onClick={() => {sortByName(order); this.changeOrder(); }}>
                  <i className="fa fa-sort" aria-hidden="true"></i></a>
                </th>
                <th >Share At<a href="javascript:void(0)"
                  onClick={() => {sortByTime(order); this.changeOrder(); }}>
                  <i className="fa fa-sort" aria-hidden="true"></i></a>
                </th>
                <th >Link</th>
                <th>Secret</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <ShareRecord checkHandler={checkHandler} icon={getIconName(item)} {...item} key={item.addr} />
              ))}
            </tbody>
          </table>

      </div>
    )
  }
}

Share.propTypes = {
  list: PropTypes.array.isRequired,
  loadShareRecords: PropTypes.func.isRequired,
  checkHandler: PropTypes.func.isRequired,
  checkAllHandler: PropTypes.func.isRequired,
  sortByName: PropTypes.func.isRequired,
  sortByTime: PropTypes.func.isRequired,
  unshare: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  list: merge({}, state.share.list)
})

const mapDispatchToProps = dispatch => ({
  loadShareRecords: () => dispatch(fetchShareRecords()),
  checkHandler: addr => dispatch(selectShareRecords(addr)),
  checkAllHandler: () => dispatch(selectAllShareRecords()),
  sortByName: order => dispatch(sortShareRecordsByName(order)),
  sortByTime: order => dispatch(sortShareRecordsByTime(order)),
  unshare: addrs => dispatch(fetchUnshare(addrs))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Share);