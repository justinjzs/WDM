import React, { Component } from 'react';
import { Link } from 'react-router';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import Hoverbar from './Hoverbar'
import RowContextMenu from './RowContextMenu'

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    }
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
  }
  mouseOver() {
    this.setState({
      hover: true
    })
  }
  mouseOut() {
    this.setState({
      hover: false
    })
  }
  render() {
    const {
      icon,
      isdir,
      selected,
      fileKey,
      name,
      path,
      size,
      lastTime,
      createTime,
      clickHandler,
      checkHandler
    } = this.props;
    return (
      <ContextMenuTrigger renderTag="tr" id={`rclick${fileKey}`} attributes={{onClick: () => checkHandler(fileKey)}}>
        <td className="center-cell" >
          <div className="checkbox">
            <input className="styled" type='checkbox' checked={selected} />
            <label></label>
          </div>
        </td>
        <td >
          <img src={`/css/svg/${icon}`} className="icon" />
          {isdir ?
            <a href="javascript:void(0)" onClick={() => clickHandler(path)} ><span>{name}</span></a> :
            <span>{name}</span>}
          {<Hoverbar fileKey={fileKey} name={name} />}

        </td>
        <td > {size || '-'} </td>
        <td > {lastTime} </td>
        <td> {createTime} </td>
        <RowContextMenu id={`rclick${fileKey}`} fileKey={fileKey} />
      </ContextMenuTrigger>
    )
  }
}

export default Row;
