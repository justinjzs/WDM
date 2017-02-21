import React, { Component } from 'react';
import { Link } from 'react-router'; 
import { injectIntl, intlShape } from 'react-intl'

const Breadcrumb = ({
  currentPath,
  map,
  clickHandler,
  intl
}) => {
  let path = currentPath.match(/\d+/g);
  let folders = [];
  let active = true;
  while ( path && path.length > 0 ) {
    let folder = {
      path: '/' + path.join('/') + '/',
      name: map[path.pop()],
      active
    }
    active = false;
    folders.unshift(folder);
  }
  folders.unshift({
    path: '/',
    name: intl.formatMessage({id: 'home'}),
    active
  })

  return (
    <ul className="breadcrumb">
      {folders.map(folder => (
        folder.active ? 
         <li className="active" key={folder.path} > {folder.name} </li> :
         <li key={folder.path} ><a href="javascript:void(0)" onClick={
          () => clickHandler(folder.path)
        } > {folder.name} </a></li>
      ))}
    </ul>
  )
}

Breadcrumb.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Breadcrumb);
