/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'redux';
import network from '../store/selectors/network';


function withTransactionWatchers (WrappedComponent) {

  return class WithTransactionWatchWrapper extends PureComponent {

    render() {
      return <WrappedComponent {...this.props}/>
    }

    componentWillUpdate() {}
  };
}


export function mapStateToProps(state) {
  return {
    latestBlockNumber: network.latestBlockNumber(state)
  };
}
export function mapDispatchToProps(dispatch) {
  const actions = {};
  return { subscribers: bindActionCreators(actions, dispatch) };
}
export default compose(connect(mapStateToProps, mapDispatchToProps), withTransactionWatchers);
