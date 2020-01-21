import { NavigationActions, StackActions } from 'react-navigation';
//THIS IS FOR NAVIGATING WITHOUT PROPS ( USE THIS IN ACTIONS )

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function goBack(keyName) {
    _navigator.dispatch(
      NavigationActions.back()
    )
}

// add other navigation functions here that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  goBack
};