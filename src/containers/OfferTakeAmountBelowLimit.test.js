/* global shallow describe it expect */
/* eslint-disable import/first */
import React from 'react';
import Immutable from 'immutable';

import {
  OfferTakeAmountBelowLimitWrapper,
  mapStateToProps,
  mapDispatchToProps
} from './OfferTakeAmountBelowLimit';
import { shallow } from 'enzyme';

describe('(Container) OfferTakeAmountBelowLimit', () => {
  const state = Immutable.fromJS(global.storeMock);
  const initialProps = mapStateToProps(state);
  const initialActions = mapDispatchToProps(x => x);
  const props = {
    ...initialActions,
    ...initialProps
  };

  it('will receive right props', () => {
    expect(initialProps).toMatchSnapshot();
  });


  it('will receive right actions', () => {
    expect(initialActions).toMatchSnapshot();
  });

  it('should render', () => {
    const wrapper = shallow(
      <OfferTakeAmountBelowLimitWrapper {...props}/>
    );
    expect(wrapper).toMatchSnapshot();
  });

});
