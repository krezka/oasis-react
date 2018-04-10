import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OasisWrapUnwrapUnwrap from '../components/OasisWrapUnwrapUnwrap';
import wrapUnwrap from '../store/selectors/wrapUnwrap';

const propTypes = PropTypes && {
  actions: PropTypes.object.isRequired
};

export class OasisWrapUnwrapUnwrapWrapper extends PureComponent {
  render() {
    const { activeWrappedToken, activeWrappedTokenBalance } = this.props;
    console.log({ activeWrappedTokenBalance })
    return (
      <OasisWrapUnwrapUnwrap
        activeWrappedToken={activeWrappedToken}
        activeWrappedTokenBalance={activeWrappedTokenBalance}
      />
    );
  }
}

export function mapStateToProps(state) {
  return {
    activeWrappedTokenBalance: wrapUnwrap.activeWrappedTokenBalance(state),
    activeWrappedToken: wrapUnwrap.activeWrappedToken(state)
  };
}
export function mapDispatchToProps(dispatch) {
  const actions = {};
  return { actions: bindActionCreators(actions, dispatch) };
}

OasisWrapUnwrapUnwrapWrapper.propTypes = propTypes;
OasisWrapUnwrapUnwrapWrapper.displayName = 'OasisWrapUnwrapUnwrap';
export default connect(mapStateToProps, mapDispatchToProps)(OasisWrapUnwrapUnwrapWrapper);
