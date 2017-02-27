import React from 'react'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'
import { IntlProvider } from 'react-intl'
import en from '../../Frontend/asset/language/en-US'
import { FormattedMessage } from 'react-intl'
import sinon from 'sinon'
import UploadDir from '../../Frontend/app/components/operations/UploadDir'

describe('<UploadDir />', () => {

  it('component static characteristics', () => {
    const wapper = shallow(<UploadDir  />);
    expect(wapper.find('label#upload-dir')).to.have.length(1);
    expect(wapper.containsMatchingElement(<input id='dir' type="file" name='dir'  />) ).to.equal(true);
    expect(wapper.contains(<FormattedMessage id="upload_Folder" />)).to.equal(true);

  }); 

  it('input change to call uploadDirHandler', () => {
    const uploadDirHandler = sinon.spy();
    const wapper = shallow(<UploadDir uploadDirHandler={uploadDirHandler} />);

    expect(uploadDirHandler.called).to.equal(false);                  
    wapper.find('input').simulate('change');
    expect(uploadDirHandler.calledOnce).to.equal(true);
  })

})