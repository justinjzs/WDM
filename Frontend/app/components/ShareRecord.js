import React from 'react'

const ShareRecord = ({
  selected,
  checkHandler,
  icon,
  name,
  time,
  addr,
  secret
}) => (
    <tr onClick={() => checkHandler(addr)}>
      <td className="center-cell">
        <div className="checkbox">
          <input className="styled" type='checkbox' checked={selected} />
          <label></label>
        </div>
      </td>
      <td><img src={`/css/svg/${icon}`} className="icon" /> {name} </td>
      <td>{time}</td>
      <td>
        <a href={`http://localhost:3000/share?addr=${addr}`}>{`http://localhost:3000/share?addr=${addr}`}</a>
      </td>
      <td>{secret || '-'}</td>
    </tr>
  )

export default ShareRecord;