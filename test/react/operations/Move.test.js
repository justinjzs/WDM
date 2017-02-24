import React from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import { IntlProvider } from 'react-intl'
import en from '../../../Frontend/asset/language/en-US'
import { FormattedMessage } from 'react-intl'
import sinon from 'sinon'
import Move from '../../../Frontend/app/components/operations/Move'

describe('<Move />', () => {
  
  it('default state', () => {
    const wapper = shallow( <Move tree={{ home: {} }} /> );
    expect(wapper.find('#moveto')).to.have.length(1);
    expect(wapper.state().selectedFolder).to.equal(0);
    expect(wapper.state().newPath).to.equal('/');
  });

  it('component static characteristics', () => {
    const wapper = shallow(<Move tree={{ home: {} }} id={'test'} />);
    expect(wapper.find('div#test')).to.have.length(1);
    expect(wapper.find('div#moveto')).to.have.length(0);
    expect(wapper.find('div.modal-dialog')).to.have.length(1);
    expect(wapper.contains(<FormattedMessage id="move_To" />)).to.equal(true);
    expect(wapper.contains(<FormattedMessage id="home" />)).to.equal(true);
    expect(wapper.contains(<FormattedMessage id="move" />)).to.equal(true);

  }); 

  it('click Move button to call renameHandler', () => {
    sinon.spy(Move.prototype, 'clickHandler');
    const moveHandler = sinon.spy();
    const wapper = shallow(<Move moveHandler={moveHandler} Move tree={{ home: {} }} />);

    expect(Move.prototype.clickHandler.called).to.equal(false);
    expect(moveHandler.called).to.equal(false);                  
    wapper.find('.modal-footer').childAt(1).simulate('click');
    expect(moveHandler.calledOnce).to.equal(true);
    wapper.find('a').simulate('click');
    expect(Move.prototype.clickHandler.calledOnce).to.equal(true);
    expect(Move.prototype.clickHandler.args[0]).to.deep.equal([0, '/']);
  })

})