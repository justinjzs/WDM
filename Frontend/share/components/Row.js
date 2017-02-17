import React from 'react'

const Row = ({
  checkHandler,
  selected,
  icon,
  isdir,
  name,
  size,
  path,
  fileKey,
  clickHandler
}) => (
    <tr onClick={() => checkHandler(fileKey)}>
      <td>
        <div className="checkbox">
          <input className="styled" type='checkbox' checked={selected}/>
          <label></label>
        </div>
      </td>
      <td><img src={`/css/svg/${icon}`} className="icon" />
        {isdir ?
          <a href="javascript:void(0)" onClick={() => clickHandler(`${path}${fileKey}/`)} ><span>{name}</span></a> :
          <span>{name}</span>
        }
      </td>
      <td>{size || '-'}</td>
    </tr>
  )

export default Row;