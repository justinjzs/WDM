import React from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import { IntlProvider, injectIntl, intlShape } from 'react-intl'
import en from '../Frontend/asset/language/en-US'
import { FormattedMessage } from 'react-intl'
import sinon from 'sinon'
import Collapse from '../Frontend/app/components/Collapse'

describe('<Collapse />', () => {

  it('component static characteristics', () => {
    const wapper = shallow(<Collapse />);
    expect(wapper.find('div')).to.have.length(1);
    

  }); 

  it('dclick <a> to call clickHandler', () => {
    const dClickHandler = sinon.spy();
    const wapper = shallow(<Collapse folders={[{}]} dClickHandler={dClickHandler} />);
    expect(wapper.find('div')).to.have.length(1);
    expect(wapper.find('li')).to.have.length(1);
    expect(dClickHandler.called).to.equal(false);
    wapper.find('li').simulate('doubleclick');
    expect(dClickHandler.calledOnce).to.equal(true);
  })

})