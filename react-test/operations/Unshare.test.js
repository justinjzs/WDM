import React from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import { IntlProvider } from 'react-intl'
import en from '../../Frontend/asset/language/en-US'
import { FormattedMessage } from 'react-intl'
import sinon from 'sinon'
import Unshare from '../../Frontend/app/components/operations/Unshare'

describe('<Unshare />', () => {

  it('component static characteristics', () => {
    const wapper = shallow(<Unshare  />);
    expect(wapper.find('div#unshare-div')).to.have.length(1);
    expect(wapper.find('div#unshare')).to.have.length(1);
    expect(wapper.find('div.modal-dialog')).to.have.length(1);
    expect(wapper.find('div.modal-content')).to.have.length(1);
    expect(wapper.find('div.modal-header')).to.have.length(1);
    expect(wapper.find('div.modal-body')).to.have.length(1);
    expect(wapper.find('div.modal-footer')).to.have.length(1);
    expect(wapper.find('button')).to.have.length(4)  
    expect(wapper.contains(<FormattedMessage id="unshare" />)).to.equal(true);
    expect(wapper.contains(<FormattedMessage id="close" />)).to.equal(true);
    expect(wapper.contains(<FormattedMessage id="confirm_Unshare" />)).to.equal(true);

  }); 

  it('click Unshare button to call unshareHandler', () => {
    const unshareHandler = sinon.spy();
    const wapper = shallow(<Unshare unshareHandler={unshareHandler} />);

    expect(unshareHandler.called).to.equal(false);                  
    wapper.find('.modal-footer').childAt(1).simulate('click');
    expect(unshareHandler.calledOnce).to.equal(true);
  })

})