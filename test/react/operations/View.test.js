import React from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import { IntlProvider } from 'react-intl'
import en from '../../../Frontend/asset/language/en-US'
import { FormattedMessage } from 'react-intl'
import sinon from 'sinon'
import View from '../../../Frontend/app/components/operations/View'

describe('<View />', () => {

  it('component static characteristics', () => {
    const wapper = shallow(<View  />);
    expect(wapper.find('div.collapse')).to.have.length(1);
    expect(wapper.find('div.view')).to.have.length(0);
  }); 

  it('with folders props', () => {
    const wapper = shallow(<View folders={[{}, {}]} />);              
    expect(wapper.find('div.view')).to.have.length(2);
    expect(wapper.containsMatchingElement(<View />)).to.equal(true);
  })

})