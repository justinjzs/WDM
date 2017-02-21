import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducers';
import { IntlProvider, addLocaleData } from 'react-intl'
import localeZh from 'react-intl/locale-data/zh'
import en from '../asset/language/en_US'
import zh from '../asset/language/zh_CN'

addLocaleData([...localeZh]);

const middleware = [thunk, createLogger()];

const getIntlMessages = () => {
  switch (navigator.language) {
    case 'zh':
    case 'zh-CN':
      return zh;
    case 'en':
    case 'en-US':
    default:
      return en;
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(...middleware)
)

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={navigator.language} messages={getIntlMessages()} >
      <App />
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);
