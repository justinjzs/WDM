import React from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import { IntlProvider } from 'react-intl'
import en from '../../Frontend/asset/language/en-US'
import { FormattedMessage } from 'react-intl'
import sinon from 'sinon'
import New from '../../Frontend/app/components/operations/New'

describe('<New />', () => {

  it('calls componentDidMount', () => {
    sinon.spy(New.prototype, 'componentDidMount');
    sinon.spy(New.prototype, 'textFocus');
    const wapper = mount(<IntlProvider locale="en" messages={en} >
                          <New />
                         </ IntlProvider>);
    expect(New.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('calls componentWillUnmount', () => {
    sinon.spy(New.prototype, 'componentWillUnmount');
    const wapper = mount(<IntlProvider locale="en" messages={en} >
                          <New />
                         </ IntlProvider>);
    wapper.unmount()
    expect(New.prototype.componentWillUnmount.calledOnce).to.equal(true);
  });

  it('component static characteristics', () => {
    const wapper = shallow(<New />);
    expect(wapper.find('#newFolder')).to.have.length(1);
    expect(wapper.find('div.modal-dialog')).to.have.length(1);
    expect(wapper.containsMatchingElement(<input type="text" style={{width: "270px"}} defaultValue="Untitled" />)).to.equal(true);
    expect(wapper.find('input')).to.have.length(1);
    expect(typeof wapper.find('input').node.ref).to.equal('function')
    expect(wapper.contains(<FormattedMessage id="new_Folder" />)).to.equal(true);
    expect(wapper.contains(<FormattedMessage id="close" />)).to.equal(true);
    expect(wapper.contains(<FormattedMessage id="new" />)).to.equal(true);

  }); 

  it('click new button to call mkdirHandler', () => {
    sinon.spy(New.prototype, 'mkdir');
    const mkdirHandler = sinon.spy();
    const wapper = mount(<IntlProvider locale="en" messages={en} >
                          <New mkdirHandler={mkdirHandler} />
                         </ IntlProvider>);
    expect(New.prototype.mkdir.called).to.equal(false);
    expect(mkdirHandler.called).to.equal(false);                  
    wapper.find('.modal-footer').childAt(1).simulate('click');
    expect(New.prototype.mkdir.calledOnce).to.equal(true);
    expect(mkdirHandler.calledOnce).to.equal(true);

  })

})

