import React from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import { IntlProvider } from 'react-intl'
import en from '../../../Frontend/asset/language/en-US'
import { FormattedMessage } from 'react-intl'
import sinon from 'sinon'
import AddShare from '../../../Frontend/app/components/operations/AddShare'

describe('<AddShare />', () => {


    it('component static characteristics', () => {
        const wapper = shallow(<AddShare addShareLink={{}} />);
        expect(wapper.find('div#addshare')).to.have.length(1);
        expect(wapper.find('div.modal-dialog')).to.have.length(1);
        expect(wapper.find('div.modal-content')).to.have.length(1);
        expect(wapper.find('div.modal-header')).to.have.length(1);
        expect(wapper.find('div.modal-body')).to.have.length(1);
        expect(wapper.find('div.modal-footer')).to.have.length(1);
        expect(wapper.find('button')).to.have.length(4)
        expect(wapper.contains(<FormattedMessage id="create_Share_Link" />)).to.equal(true);
        expect(wapper.contains(<FormattedMessage id="create_Secret_Link" />)).to.equal(true);
        expect(wapper.contains(<FormattedMessage id="create_Public_Link" />)).to.equal(true);
        expect(wapper.contains(<FormattedMessage id="public_Link_Description" />)).to.equal(true);
        expect(wapper.contains(<FormattedMessage id="secret_Link_Description" />)).to.equal(true);
        expect(wapper.contains(<FormattedMessage id="close" />)).to.equal(true);


    });

    it('click " create " button to call addShareHandler', () => {
        const addShareHandler = sinon.spy();
        const wapper = shallow(<AddShare addShareHandler={addShareHandler} addShareLink={{}} />);

        expect(addShareHandler.called).to.equal(false);
        wapper.find('.modal-body').childAt(0).find('button').simulate('click');
        expect(addShareHandler.calledOnce).to.equal(true);
        expect(addShareHandler.args[0]).to.deep.equal([false])
        wapper.find('.modal-body').childAt(1).find('button').simulate('click');
        expect(addShareHandler.callCount).to.equal(2);
        expect(addShareHandler.args[1]).to.deep.equal([true])
    })


    it('click " close " button to call resetHandler', () => {
        const resetHandler = sinon.spy();
        const wapper = shallow(<AddShare resetHandler={resetHandler} addShareLink={{}} />);

        expect(resetHandler.called).to.equal(false);
        wapper.find('.modal-footer button').simulate('click');
        expect(resetHandler.calledOnce).to.equal(true);
        wapper.find('.modal-header button').simulate('click');
        expect(resetHandler.callCount).to.equal(2);
    })

    it('has id  and addShareLink props', () => {
        const wapper = shallow(<AddShare id='123' addShareLink={{ link: 'link' }} />);
        expect(wapper.find('div#addshare')).to.have.length(0);
        expect(wapper.find('div#123')).to.have.length(1);
        expect(wapper.find('a')).to.have.length(1);
        expect(wapper.find('button')).to.have.length(2);
    })

})