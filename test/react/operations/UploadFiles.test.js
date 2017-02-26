import React from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import { IntlProvider } from 'react-intl'
import en from '../../../Frontend/asset/language/en-US'
import { FormattedMessage } from 'react-intl'
import sinon from 'sinon'
import UploadFiles from '../../../Frontend/app/components/operations/UploadFiles'

describe('<UploadFiles />', () => {

  it('component static characteristics', () => {
    const wapper = shallow(<UploadFiles  />);
    expect(wapper.find('label#upload-files')).to.have.length(1);
    expect(wapper.containsMatchingElement(<input id='file' type="file" name='files'  />) ).to.equal(true);
    expect(wapper.contains(<FormattedMessage id="upload_Files" />)).to.equal(true);

  }); 

  it('input change to call uploadHandler', () => {
    const uploadHandler = sinon.spy();
    const wapper = shallow(<UploadFiles uploadHandler={uploadHandler} />);

    expect(uploadHandler.called).to.equal(false);                  
    wapper.find('input').simulate('change');
    expect(uploadHandler.calledOnce).to.equal(true);
  })

})