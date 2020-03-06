import { combineReducers } from 'redux';

// import Auth from './auth';
// import Language from './language';
// import Navigator from './navigation';
import userState from './userstate';
import dashboard from './userMyAccounts'
import users from './userSignUp'

export default combineReducers({
	userState,
	dashboard,
	// user in sign up
	users,
});
