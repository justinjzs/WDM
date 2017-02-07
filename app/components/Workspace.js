import React, { Component } from 'react';
import Row from './Row';

const data = [
  {
    key: 647,
    name: 'doc',
    size: null,
    isdir: true,
    lasttime: 'Tue Feb 07 2017 11:34:18',
    createtime: 'Tue Feb 07 2017 11:34:18'

  }
]

export default class Workspace extends Component {
  render() {
    const files = data;

    return (
      <div className="table-responsive" id="workspace">
        <table className="table table-striped table-bordered table-hover" >
          <thead>
            <tr>
              <th >
                <input type='checkbox' />
              </th>
              <th >Name</th>
              <th >Size</th>
              <th >LastModified</th>
              <th>CreateTime</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => {
              file.iconClass = 'fa fa-folder fa-2x';
              return (
                <Row key={file.key} {...file} />
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}