import React, { Component } from 'react';
import { Link } from 'react-router'; 



const Breadcrumb = ({
  pathName
}) => {
  let path = pathName.split('/');
  let folders = [];
  let active = true;
  while (path.length >= 2) {
    let folder = {
      path: path.join('/'),
      name: path.pop(),
      active
    }
    active = false;
    folders.unshift(folder);
  }

  return (
    <ul className="breadcrumb">
      {folders.map(folder => (
        folder.active ? 
         <li className="active" key={folder.path} > {folder.name} </li> :
         <li key={folder.path} ><Link to={folder.path} > {folder.name} </Link></li>
      ))}
    </ul>
  )
}
export default Breadcrumb;
