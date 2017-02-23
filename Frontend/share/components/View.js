import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'

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
          let isSelected = folder.key === this.props.selected;
          const cls = classNames({
            'icon-folder': true,
            'green-icon': isSelected,
            'yellow-icon': !isSelected
          })
          return (
            <div key={folder.key} className="view">
          <span className={cls} style={{ paddingLeft: 10 * level + 'px' }} ></span>
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


