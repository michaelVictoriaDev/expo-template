import * as Amplitude from 'expo-analytics-amplitude';
import { AMPLITUDE_API_KEY } from 'react-native-dotenv';
import { Platform } from 'react-native';
import * as events from './AnalyticsConstants';

function initializeAmplitude () {
  Amplitude.initialize(AMPLITUDE_API_KEY);
}

function logEvent (eventName) {
  Amplitude.logEvent(eventName);
}

function logEventWithProperties (eventName, properties) {
  Amplitude.logEventWithProperties(eventName, properties);
}

function setUserIdAndProperties (userId, userProperties) {
  Amplitude.setUserId(userId);
  Amplitude.setUserProperties(userProperties);
}

function setAnalyticsGroup (groupType,groupNames) {
  Amplitude.setGroup(groupType, groupNames);
}

export default {
  initializeAmplitude,
  logEvent,
  logEventWithProperties,
  setUserIdAndProperties,
  setAnalyticsGroup,
  events
}