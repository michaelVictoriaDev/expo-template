import {
	FETCH_LOGIN_BEGIN, FETCH_LOGIN_SUCCESS, FETCH_LOGIN_FAIL, HANDLE_APPSTATE
  } from '../actions/types';

import { AppState } from 'react-native';

initialState = {
  userName: null,
  accountIds : {},
  userPersonId: null,
  isLoginLoading : false,
  loginError : null,
  accountId: {},
  globalAppState : AppState.currentState
}


const userState = ( state = initialState , action ) => {
  switch ( action.type ) {
    case FETCH_LOGIN_BEGIN :
      return {
        ...state,
        isLoginLoading : true,
        loginError : null
      };
    case FETCH_LOGIN_SUCCESS :
      return {
        ...state,
        isLoginLoading: false,
        accountIds: action.payload.accountIds,
        userPersonId: action.payload.userPersonId,
        accountId: action.payload.accountId,
        userName: action.payload.userName
      };
    case FETCH_LOGIN_FAIL :
      return {
        ...state,
        isLoginLoading : false,
        loginError : action.payload.error,
        accountIds : {},
        userPersonId: null,
        accountId: {},
        userName: null
      };
    case HANDLE_APPSTATE :
      return {
        ...state,
        globalAppState : action.globalAppState
      }
	  default:
		  return state;  
  }
}

export default userState;