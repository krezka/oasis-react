import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const propTypes = PropTypes && {
  actions: PropTypes.object.isRequired
};

export class OasisTokenUnwrapFormWrapper extends PureComponent {
  render() {
    return (
      <div></div>
    );
  }
}

export function mapStateToProps(state) {
  return {};
}
export function mapDispatchToProps(dispatch) {
  const actions = {};
  return { actions: bindActionCreators(actions, dispatch) };
}

OasisTokenUnwrapFormWrapper.propTypes = propTypes;
OasisTokenUnwrapFormWrapper.displayName = 'OasisTokenUnwrapForm';
export default connect(mapStateToProps, mapDispatchToProps)(OasisTokenUnwrapFormWrapper);
