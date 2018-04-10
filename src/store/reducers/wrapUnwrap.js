import { createAction, handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { reset, formValueSelector } from 'redux-form/immutable';

import {
ETH_UNIT_ETHER,
TOKEN_ETHER,
TOKEN_GNOSIS,
TOKEN_WRAPPED_ETH,
TOKEN_WRAPPED_GNT,
} from '../../constants';
import wrapUnwrap from '../selectors/wrapUnwrap';
import accounts from '../selectors/accounts';
import { fulfilled } from '../../utils/store';
import getTokenContractInstance from '../../utils/contracts/getContractInstance';
import web3 from '../../bootstrap/web3';
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from './transactions';
import { createPromiseActions } from '../../utils/createPromiseActions';



export const ADDRESS_HAS_NO_BROKER = 'ADDRESS_HAS_NO_BROKER';

const initialState = fromJS({
  wrapperTokenPairs: [
    {
      unwrapped: TOKEN_ETHER,
      wrapper: TOKEN_WRAPPED_ETH
    },
    {
      unwrapped: TOKEN_GNOSIS,
      wrapper: TOKEN_WRAPPED_GNT
    }
  ],
  activeUnwrappedToken: TOKEN_ETHER,
  loadedBrokerContracts: [],
  brokerAddresses: {
    [TOKEN_GNOSIS]: null
  },
  activeTokenWrapStatus: null,
  activeTokenUnwrapStatus: null,
});

const INIT = 'WRAP_UNWRAP/INIT';
const WRAP_ETHER = 'WRAP_UNWRAP/WRAP_ETHER';
const UNWRAP_ETHER = 'WRAP_UNWRAP/UNWRAP_ETHER';

const WRAP_GNT_TOKEN = 'WRAP_UNWRAP/WRAP_GNT_TOKEN';
const UNWRAP_GNT_TOKEN = 'WRAP_UNWRAP/UNWRAP_GNT_TOKEN';



const getWrapAmount = (rootState) =>
  web3.toWei(formValueSelector('wrapToken')(rootState, 'amount'), ETH_UNIT_ETHER);

const getUnwrapAmount = (rootState) =>
  web3.toWei(formValueSelector('unwrapToken')(rootState,'amount'), ETH_UNIT_ETHER);

const Init = createAction(INIT, () => null);


const setActiveWrapUnwrappedToken = createAction(
  'WRAP_UNWRAP/SET_ACTIVE_UNWRAPPED_TOKEN',
  token => token
);


const loadGNTBrokerAddress = createAction(
  'WRAP_UNWRAP/LOAD_GNT_TOKEN_ADDRESS',
  (address) => new Promise((resolve, reject) =>
    window.contracts.WGNTNoProxy.getBroker.call(
      address,
      (e, address)=> { if (e)  { reject(e); } else { resolve(address) } }
    )
  )
);
const loadGNTBrokerAddressEpic = () => async (dispatch, getState) => (
    dispatch(
      loadGNTBrokerAddress(
        accounts.defaultAccount(getState())
      )
    )
  ).then(({ value }) => value);

const createGNTDepositBroker = createAction(
  'WRAP_UNWRAP/CREATE_DEPOSIT_BROKER',
  () => getTokenContractInstance(TOKEN_WRAPPED_GNT).createBroker()
);
const createDepositBrokerEpic = (tokenName) => (dispatch) => {
  switch (tokenName) {
    case TOKEN_GNOSIS: {
      dispatch(createGNTDepositBroker());
    }break
  }
};

const wrapEther = createAction(
  WRAP_ETHER,
  ({ gas, amountInWei }) =>
    getTokenContractInstance(TOKEN_WRAPPED_ETH).deposit({ gas: gas || DEFAULT_GAS_PRICE, value: amountInWei })
);

const wrapEther$ = createPromiseActions('WRAP_UNWRAP/WRAP_ETHER');
const wrapETHTokenEpic = () => (dispatch, getState) => {
  dispatch(wrapEther$.pending());
  const wrapAmount = getWrapAmount(getState());
  dispatch(
    wrapEther({ amountInWei: wrapAmount })
  );
  dispatch(wrapEther$.fulfilled());
  dispatch(resetActiveWrapForm());
};


const unwrapEther = createAction(
  UNWRAP_ETHER,
  async (amountInWei, gas) =>
    getTokenContractInstance(TOKEN_WRAPPED_ETH).withdraw({ gas: gas || DEFAULT_GAS_PRICE, value: amountInWei })
);

const unwrapEther$ = createPromiseActions('WRAP_UNWRAP/UNWRAP_ETHER');
const unwrapEtherEpic = () => (dispatch, getState) => {
  dispatch(unwrapEther$.pending());
  dispatch(
    unwrapEther({ amountInWei: getUnwrapAmount(getState()) })
  );
  dispatch(unwrapEther$.fulfilled());
  dispatch(resetActiveUnwrapForm());
};


const wrapGNTToken = createAction(
  WRAP_GNT_TOKEN,
  async ({ brokerAddress, amountInWei }) =>
    getTokenContractInstance(TOKEN_GNOSIS).transfer(brokerAddress, amountInWei)
);


const wrapGNTToken$ = createPromiseActions('WRAP_UNWRAP/WRAP_GNT_TOKEN');
const wrapGNTTokenEpic = () => async (dispatch, getState) => {
  dispatch(wrapGNTToken$.pending());
  const depositBrokerAddress = wrapUnwrap.getBrokerAddress(getState(), TOKEN_GNOSIS);
  const wrapAmount = getWrapAmount(getState());
  if (!wrapUnwrap.isTokenBrokerInitiallyLoaded(getState(), TOKEN_GNOSIS)) {
    await dispatch(loadGNTBrokerAddressEpic());
  }

  if (wrapUnwrap.hasTokenBroker(getState(), TOKEN_GNOSIS)) {
    await dispatch(
      wrapGNTToken({ brokerAddress: depositBrokerAddress, amountInWei: wrapAmount })
    );
    await dispatch(
      loadDepositBrokerContractEpic(TOKEN_GNOSIS)
    );
    dispatch(clearDepositBrokerEpic(TOKEN_GNOSIS));

  } else {
    await dispatch(createDepositBrokerEpic(TOKEN_GNOSIS));
    await dispatch(
      loadDepositBrokerContractEpic(TOKEN_GNOSIS)
    );

    await dispatch(
      wrapGNTToken({ brokerAddress: depositBrokerAddress, amountInWei: wrapAmount })
    );

    dispatch(clearDepositBrokerEpic(TOKEN_GNOSIS));
  }

  dispatch(wrapGNTToken$.fulfilled());
  dispatch(resetActiveWrapForm());
};

const addressHasNoBrokerForToken = createAction(
  'WRAP_UNWRAP/ADDRESS_HAS_NO_BROKER_FOR_TOKEN',
  tokenName => tokenName

);

const loadDepositBrokerContractEpic = (tokenName = TOKEN_GNOSIS) => (dispatch, getState) => {
  const depositBrokerAddress = wrapUnwrap.getBrokerAddress(getState(), TOKEN_GNOSIS);
  if (!web3.isAddress(depositBrokerAddress)) {
    dispatch(
      addressHasNoBrokerForToken(tokenName)
    );
  } else {
    window.contracts.initDepositBrokerContract(tokenName, depositBrokerAddress);
  }
};

const clearDepositBroker = createAction(
  'WRAP_UNWRAP/CLEAR_DEPOSIT_BROKER',
  tokenName => window.contracts.getDepositBrokerContractInstance(tokenName).clear()
);

const clearDepositBrokerEpic = (tokenName) => (dispatch) => {
  dispatch(clearDepositBroker(tokenName));
};


const unwrapGNTToken = createAction(
  UNWRAP_GNT_TOKEN,
  async ({ gas, amountInWei }) =>
    getTokenContractInstance(WRAP_GNT_TOKEN).withdraw(amountInWei, { gas: gas|| DEFAULT_GAS_PRICE })
);

const unwrapGNTToken$ = createPromiseActions('WRAP_UNWRAP/UNWRAP_GNT_TOKEN');
const unwrapGNTTokenEpic = () => (dispatch, getState) => {
  dispatch(unwrapGNTToken$.pending());
  dispatch(
    unwrapGNTToken({ amountInWei: getUnwrapAmount(getState()) })
  );
  dispatch(unwrapGNTToken$.fulfilled());
  dispatch(resetActiveUnwrapForm());
};



const wrapTokenEpic = () => (dispatch, getState) => {
  switch (wrapUnwrap.activeUnwrappedToken(getState())) {
    case TOKEN_ETHER : {
      dispatch(wrapETHTokenEpic());
    } break;
    case TOKEN_GNOSIS : {
      dispatch(wrapGNTTokenEpic());
    } break;
  }
};


const unwrapTokenEpic = () => (dispatch, getState) => {
  switch (wrapUnwrap.activeUnwrappedToken(getState())) {
    case TOKEN_ETHER : {
      dispatch(unwrapEtherEpic());
    } break;
    case TOKEN_GNOSIS : {
      dispatch(unwrapGNTTokenEpic());
    } break;
  }
};


const setActiveWrapStatus = createAction('WRAP_UNWRAP/SET_WRAP_STATUS');
const resetActiveWrapStatus = createAction('WRAP_UNWRAP/SET_WRAP_STATUS');

const resetActiveWrapForm = createAction('WRAP_UNWRAP/SET_WRAP_FORM', () => reset('wrapToken'));

const setActiveUnwrapStatus = createAction('WRAP_UNWRAP/SET_UNWRAP_STATUS');
const resetActiveUnwrapStatus = createAction('WRAP_UNWRAP/SET_UNWRAP_STATUS');
const resetActiveUnwrapForm = createAction('WRAP_UNWRAP/SET_UNWRAP_FORM', () => reset('unwrapToken'));

const actions = {
  loadGNTBrokerAddressEpic,
  wrapTokenEpic,
  unwrapTokenEpic,
  setActiveWrapUnwrappedToken
};

const reducer = handleActions({
  [fulfilled(loadGNTBrokerAddress)]: (state, { payload }) => state.setIn(['brokerAddresses', TOKEN_GNOSIS], payload),
  [setActiveWrapUnwrappedToken]: (state, { payload }) => {
    return state.set('activeUnwrappedToken', payload);
  },
  [setActiveWrapStatus]: (state, payload) => state.set('activeWrapStatus', payload),
  [resetActiveWrapStatus]: state => state.set('activeWrapStatus', null),
  [setActiveUnwrapStatus]: (state, payload) => state.set('activeUnwrapStatus', payload),
  [resetActiveUnwrapStatus]: state => state.set('activeUnwrapStatus', null),
  [addressHasNoBrokerForToken]: (state, payload) => state.setIn(['brokerAddresses', payload], ADDRESS_HAS_NO_BROKER)
}, initialState);

export default {
  actions,
  reducer,
};
