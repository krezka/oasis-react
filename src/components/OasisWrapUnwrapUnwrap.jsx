import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import OasisTokenBalanceWrapper  from '../containers/OasisTokenBalance';

const propTypes = PropTypes && {
  activeWrappedToken: PropTypes.string.isRequired,
};
const defaultProps = {
};

class OasisWrapUnwrapUnwrap extends PureComponent {
  render() {
    const { activeWrappedToken } = this.props;
    return (
      <div>
        {<OasisTokenBalanceWrapper fromWei tokenName={activeWrappedToken}/>}
      </div>
    );
  }
}

OasisWrapUnwrapUnwrap.displayName = 'OasisWrapUnwrapUnwrap';
OasisWrapUnwrapUnwrap.propTypes = propTypes;
OasisWrapUnwrapUnwrap.defaultProps = defaultProps;
export default OasisWrapUnwrapUnwrap;
