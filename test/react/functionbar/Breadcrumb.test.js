import React from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import { IntlProvider, injectIntl, intlShape } from 'react-intl'
import en from '../../../Frontend/asset/language/en-US'
import { FormattedMessage } from 'react-intl'
import sinon from 'sinon'
import Breadcrumb from '../../../Frontend/app/components/functionbar/Breadcrumb'

describe('<Breadcrumb />', () => {

  it('component static characteristics', () => {
    const wapper = mount(<IntlProvider locale="en" messages={en} >
                          <Breadcrumb currentPath='/' />
                         </ IntlProvider>);
    expect(wapper.find('ul')).to.have.length(1);
    expect(wapper.find('li')).to.have.length(1);
    

  }); 

  it('click <a> to call clickHandler', () => {
    const clickHandler = sinon.spy();
    const wapper = mount(<IntlProvider locale="en" messages={en} >
                          <Breadcrumb currentPath='/1/' clickHandler={clickHandler} map={{'1': 'folder'}} />
                         </ IntlProvider>);
    expect(clickHandler.called).to.equal(false);
    expect(wapper.find('ul')).to.have.length(1);
    expect(wapper.find('li')).to.have.length(2);
    expect(wapper.find('a').simulate('click'))
    expect(clickHandler.calledOnce).to.equal(true);

  })

})