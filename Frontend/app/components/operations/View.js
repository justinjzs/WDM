import React, { Component } from 'react'

export default class View extends Component {
  render() {
    const { folders, dist, clickHandler, selected, level } = this.props;
    let array = [];
    for (let folder in folders) {
      array.push(folders[folder])
    }
    return (
      <div id={dist} className="collapse">
        {array.map(folder => {
          let src = folder.key === this.props.selected ? 
            "/css/svg/folder_green_16pix.svg" :
            "/css/svg/folder_24pix.svg"
          return (
            <div key={folder.key} className="view">
              <img className="view-icon" src={src} style={{paddingLeft: 10 * level + 'px'}}/>
              <a data-toggle="collapse" href={`#view${folder.key}`} 
                 onClick={() => clickHandler(folder.key, `${folder.path}${folder.key}/`)}>
              {folder.name}</a>
              <View folders={folder.children}
                    level={level + 1}
                    selected={selected}
                    dist={`view${folder.key}`}
                    clickHandler={clickHandler} />
            </div>
          )
        })}
      </div>
    )
  }
}


