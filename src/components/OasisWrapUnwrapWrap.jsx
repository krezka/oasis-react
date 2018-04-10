import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import OasisTokenWrapFormWrapper from '../containers/OasisTokenWrapForm';
import OasisTokenBalanceWrapper  from '../containers/OasisTokenBalance';
import { TOKEN_ETHER } from '../constants';

const propTypes = PropTypes && {
  activeUnwrappedToken: PropTypes.string,
  onSubmit: PropTypes.func.isRequired
};
const defaultProps = {};

class OasisWrapUnwrapWrap extends PureComponent {
  render() {
    const { activeUnwrappedToken } = this.props;
    return (
      <div>
        <div>
          <b>Wallet </b>
          <OasisTokenBalanceWrapper
            fromWei={activeUnwrappedToken===TOKEN_ETHER}
            tokenName={activeUnwrappedToken}
          />
        </div>
        <OasisTokenWrapFormWrapper
          activeUnwrappedtoken={activeUnwrappedToken}
          onSubmit={this.props.onSubmit}
        />
      </div>
    );
  }
}

OasisWrapUnwrapWrap.displayName = 'OasisWrapUnwrapWrap';
OasisWrapUnwrapWrap.propTypes = propTypes;
OasisWrapUnwrapWrap.defaultProps = defaultProps;
export default OasisWrapUnwrapWrap;
