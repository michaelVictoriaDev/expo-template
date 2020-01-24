import {
	FETCH_LOGIN_BEGIN, FETCH_LOGIN_SUCCESS, FETCH_LOGIN_FAIL, HANDLE_APPSTATE
  } from '../actions/types';

import { AppState } from 'react-native';

initialState = {
  userDetails : {},
  userPersonId: null,
  isLoginLoading : false,
  loginError : null,
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
        userDetails: action.payload.userDetails,
        userPersonId: action.payload.userPersonId
      };
    case FETCH_LOGIN_FAIL :
      return {
        ...state,
        isLoginLoading : false,
        loginError : action.payload.error,
        userDetails : {},
        userPersonId: null
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