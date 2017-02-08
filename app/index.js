import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory, Route, IndexRoute } from 'react-router';
import App from './App';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducers';
import Workspace from './components/Workspace';
import Search from './components/Search';
import Share from './components/Share';

const middleware = [thunk, createLogger()];

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(...middleware)
)

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} >
      <Route path='/home' component={App}>
        <IndexRoute component={Workspace} />
        <Route path='share' component={Share} />
        <Route path='search/:keyword' component={Search} />
        <Route path='**' component={Workspace} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

