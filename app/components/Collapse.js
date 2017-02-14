import React, { Component } from 'react';

export default class Collapse extends Component {
  render(){
    let {level, folders, currentFolder, dClickHandler} = this.props
    let array = [];
    for (let folder in folders) {
      array.push(folders[folder])
    }
    let offset = (level)*10 + 10 + 'px';
    return (
      <div>
        {array.map(folder => {
          let color = currentFolder === folder.key ? 'green' : 'white';
          return (
            folder.children ?
              (<div key={folder.key}>
                <li onDoubleClick={e => dClickHandler(folder.path + folder.key + '/')} data-toggle="collapse" data-target={`#${folder.key}`} className="collapsed">
                  <img style={{ padding: `0px 10px 0px ${offset}` }} src={`/css/svg/folder_${color}_16pix.svg`} className="folder-icon" /><a href="#">{folder.name}<span className="arrow"></span></a>
                </li>
                <ul id={folder.key} className="collapse">
                  <Collapse level={++level} folders={folder.children} dClickHandler={dClickHandler} currentFolder={currentFolder} />
                </ul>
              </div>) :
              <li onDoubleClick={e => dClickHandler(folder.path + folder.key + '/')} key={folder.key}><img style={{ padding: `0px 10px 0px ${offset}` }} src={`/css/svg/folder_${color}_16pix.svg`} className="folder-icon" /><a href="#">{folder.name}</a></li>
          )
        })}
      </div>
    )
  }
}
