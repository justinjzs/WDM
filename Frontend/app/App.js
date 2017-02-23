import React, { Component } from 'react';
import Header from './components/Header';
import Functionbar from './components/Functionbar';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import getFormatTime from './utils/getFormatTime'
import { Router, Route, browserHistory } from 'react-router'
import { IntlProvider, addLocaleData } from 'react-intl'
import localeZh from 'react-intl/locale-data/zh'
import en from '../asset/language/en_US'
import zh from '../asset/language/zh_CN'
addLocaleData([...localeZh]);

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

class App extends Component {
  componentWillMount() {
    getFormatTime();
  }
  render() {
    return (
      <IntlProvider locale={navigator.language} messages={getIntlMessages()}>
        <div className="App">
          <Header />
          <Functionbar pathName={this.props.location.pathname} />
          <div className="body row">
            <Sidebar />
            {this.props.children}
          </div>
        </div>
      </IntlProvider>
    );
  }
}


export default App;
