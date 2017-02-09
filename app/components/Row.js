import React from 'react';
import { Link } from 'react-router';

const Row = ({
  icon,
  name,
  path,
  size,
  lastTime,
  createTime,
  clickHandler
}) => (
  <tr>
    <td >
      <input type='checkbox' />
    </td>
    <td > <img src={`/css/svg/${icon}`} /> <a href="javascript:void(0)" onClick={() => clickHandler(path)} >{' ' + name}</a> </td>
    <td > {size || '-'} </td>
    <td > {lastTime.slice(0, 24)} </td>
    <td> {createTime.slice(0, 24)} </td>
  </tr>
)

export default Row;