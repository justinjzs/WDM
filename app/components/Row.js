import React from 'react';
import { Link } from 'react-router';

const Row = ({
  isChecked,
  iconClass,
  key,
  name,
  size,
  lastTime,
  createTime,
  onClick
}) => (
  <tr>
    <td >
      <input type='checkbox' value={isChecked} />
    </td>
    <td > <i className={iconClass} /> <a href="javascript:void(0)" onClick={console.log(key) } >{' ' + name}</a> </td>
    <td > {size || '-'} </td>
    <td > {lastTime.slice(0, 24)} </td>
    <td> {createTime.slice(0, 24)} </td>
  </tr>
)

export default Row;