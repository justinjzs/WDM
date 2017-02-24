import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import merge from 'deepmerge'
import getIconName from '../utils/getIconName'
import ShareRecord from './ShareRecord'
import { FormattedMessage } from 'react-intl'
import { fetchShareRecords,
         selectShareRecords,
         selectAllShareRecords,
         sortShareRecordsByName,
         sortShareRecordsByTime } from '../actions'

class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: false
    }
    this.changeOrder = this.changeOrder.bind(this);
  }
  componentWillMount(){
    this.props.loadShareRecords();
  }
  changeOrder() {
    this.setState({
      order: !this.state.order
    })
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
          <table className="table table-hover" >
            <thead>
              <tr>
                <th className="center-cell" width="50px">
                  <div className="checkbox">
                    <input type='checkbox' className="styled" onClick={checkAllHandler} />
                    <label></label>
                  </div>
                </th>
                <th width="40%">
                <FormattedMessage id="shared_File_Name" />
                <a href="javascript:void(0)"
                  onClick={() => {sortByName(order); this.changeOrder(); }}>
                  <i className="fa fa-sort" aria-hidden="true"></i></a>
                </th>
                <th>
                <FormattedMessage id="shared_At" />
                <a href="javascript:void(0)"
                  onClick={() => {sortByTime(order); this.changeOrder(); }}>
                  <i className="fa fa-sort" aria-hidden="true"></i></a>
                </th>
                <th><FormattedMessage id="shared_Link" /></th>
                <th><FormattedMessage id="shared_Secret" /></th>
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
  sortByTime: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  list: merge({}, state.share.list)
})

const mapDispatchToProps = dispatch => ({
  loadShareRecords: () => dispatch(fetchShareRecords()),
  checkHandler: addr => dispatch(selectShareRecords(addr)),
  checkAllHandler: () => dispatch(selectAllShareRecords()),
  sortByName: order => dispatch(sortShareRecordsByName(order)),
  sortByTime: order => dispatch(sortShareRecordsByTime(order))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Share);