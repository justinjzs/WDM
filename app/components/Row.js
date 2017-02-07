import React from 'react';
import { Link } from 'react-router';

const Row = ({
  iconClass,
  name,
  size,
  lasttime,
  createtime
}) => (
  <tr>
    <td >
      <input type='checkbox' />
    </td>
    <td > <i className={iconClass} /> {' ' + name} </td>
    <td > {size || '-'} </td>
    <td > {lasttime} </td>
    <td> {createtime} </td>
  </tr>
)

export default Row;