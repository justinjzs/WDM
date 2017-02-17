import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import Workspace from './components/Workspace';
import Search from './components/Search';

export default (
  <Route path='/home' component={App}>
    <IndexRoute component={Workspace} />
    <Route path=':workspacePath' component={Workspace} />
    <Route path='search/:keyword' component={Search} />
  </Route>
)

