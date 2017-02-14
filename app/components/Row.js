import React from 'react';
import { Link } from 'react-router';

const Row = ({
  icon,
  selected,
  fileKey,
  name,
  path,
  size,
  lastTime,
  createTime,
  clickHandler,
  checkHandler
}) => (
  <tr>
    <td className="center-cell" >
      <div className="checkbox">
        <input className="styled" type='checkbox' checked={selected} onChange={e => checkHandler(fileKey)}/>
        <label></label>
      </div>
    </td>
    <td > <img src={`/css/svg/${icon}`} className="icon"/> <a href="javascript:void(0)" onClick={() => clickHandler(path)} >{name}</a> </td>
    <td > {size || '-'} </td>
    <td > {lastTime.slice(0, 24)} </td>
    <td> {createTime.slice(0, 24)} </td>
  </tr>
)

export default Row;