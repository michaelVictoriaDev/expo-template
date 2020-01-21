import { combineReducers } from 'redux';

import Auth from './auth';
import Language from './language';
// import Navigator from './navigation';
import userState from './userstate';

export default combineReducers({
	Auth,
	Language,
	userState,
});
