
import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OasisWrapUnwrapBalances from '../components/OasisWrapUnwrapBalances';
import wrapUnwrap from '../store/selectors/wrapUnwrap';
import platformReducer from '../store/reducers/platform';
import wrapUnwrapReducer from '../store/reducers/wrapUnwrap';

const propTypes = PropTypes && {
  actions: PropTypes.object.isRequired
};

export class OasisWrapUnwrapBalancesWrapper extends PureComponent {
  render() {
    const { wrapUnwrapBalances, actions: { changeRoute, setActiveWrapUnwrappedToken } } = this.props;
    return (
      <OasisWrapUnwrapBalances
        changeRoute={changeRoute}
        setActiveWrapUnwrappedToken={setActiveWrapUnwrappedToken}
        wrapUnwrapBalances={wrapUnwrapBalances}
      />
    );
  }
}

export function mapStateToProps(state) {
  return {
    wrapUnwrapBalances: wrapUnwrap.wrapUnwrapBalances(state)
  };
}
export function mapDispatchToProps(dispatch) {
  const actions = {
    changeRoute: platformReducer.actions.changeRouteEpic,
    setActiveWrapUnwrappedToken: wrapUnwrapReducer.actions.setActiveWrapUnwrappedToken
  };
  return { actions: bindActionCreators(actions, dispatch) };
}

OasisWrapUnwrapBalancesWrapper.propTypes = propTypes;
OasisWrapUnwrapBalancesWrapper.displayName = 'OasisWrapUnwrapBalances';
export default connect(mapStateToProps, mapDispatchToProps)(OasisWrapUnwrapBalancesWrapper);
