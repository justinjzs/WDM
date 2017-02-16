import React from 'react';
import { Link } from 'react-router';

const Row = ({
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
}) => (
  <tr onClick={() => checkHandler(fileKey) }>
    <td className="center-cell" >
      <div className="checkbox">
        <input className="styled" type='checkbox' checked={selected} onChange={e => checkHandler(fileKey)} onClick={() => checkHandler(fileKey) }/>
        <label></label>
      </div>
    </td>
    <td > <img src={`/css/svg/${icon}`} className="icon"/> {isdir ? 
      <a href="javascript:void(0)" onClick={() => clickHandler(path)} ><span>{name}</span></a> : 
      <span>{name}</span>} </td>
    <td > {size || '-'} </td>
    <td > {lastTime} </td>
    <td> {createTime} </td>
  </tr>
)

export default Row;