import React from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import { IntlProvider } from 'react-intl'
import en from '../../Frontend/asset/language/en-US'
import { FormattedMessage } from 'react-intl'
import sinon from 'sinon'
import Rename from '../../Frontend/app/components/operations/Rename'

describe('<Rename />', () => {

  it('calls componentDidMount', () => {
    sinon.spy(Rename.prototype, 'componentDidMount');
    const wapper = mount(<IntlProvider locale="en" messages={en} >
                          <Rename />
                         </ IntlProvider>);
    expect(Rename.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('calls componentWillUnmount', () => {
    sinon.spy(Rename.prototype, 'componentWillUnmount');
    const wapper = mount(<IntlProvider locale="en" messages={en} >
                          <Rename />
                         </ IntlProvider>);
    wapper.unmount()
    expect(Rename.prototype.componentWillUnmount.calledOnce).to.equal(true);
  });

  it('component static characteristics', () => {
    const wapper = shallow(<Rename />);
    expect(wapper.find('div#rename')).to.have.length(1);
    expect(wapper.find('div.modal-dialog')).to.have.length(1);
    expect(wapper.containsMatchingElement(<input type="text" style={{width: "270px"}} />)).to.equal(true);
    expect(wapper.find('input')).to.have.length(1);
    expect(typeof wapper.find('input').node.ref).to.equal('function')
    expect(wapper.contains(<FormattedMessage id="new_Name" />)).to.equal(true);
    expect(wapper.contains(<FormattedMessage id="close" />)).to.equal(true);
    expect(wapper.contains(<FormattedMessage id="rename" />)).to.equal(true);

  }); 

  it('click Rename button to call renameHandler', () => {
    sinon.spy(Rename.prototype, 'rename');
    const renameHandler = sinon.spy();
    const wapper = mount(<IntlProvider locale="en" messages={en} >
                          <Rename renameHandler={renameHandler} name={'default'} />
                         </ IntlProvider>);
    expect(wapper.find('input').props().defaultValue).to.equal('default');
    expect(Rename.prototype.rename.called).to.equal(false);
    expect(renameHandler.called).to.equal(false);                  
    wapper.find('.modal-footer').childAt(1).simulate('click');
    expect(Rename.prototype.rename.calledOnce).to.equal(true);
    expect(renameHandler.calledOnce).to.equal(true);
  })

})