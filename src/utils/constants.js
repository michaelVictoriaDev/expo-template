import { PixelRatio } from 'react-native';
import * as Constants from 'expo-constants';
import RF from "react-native-responsive-fontsize";

export const colors = {
  WHITE: '#FFFFFF',
  LIGHT_GREEN: '#4caf50',
  BLACK: '#000000',
  PINK_200: '#F48FB1',
  PINK_300: '#F06292',
  PINK_400: '#EC407A',
  PINK_500: '#E91E63',
  PRIMARY_COLOR: '#1788c7',
};

export const timesPicker = [
  {
    label : '12:00 AM',
    time : '12:00 AM'
  },
  {
    label : '12:30 AM',
    time : '12:30 AM'
  },
  {
    label : '01:00 AM',
    time : '01:00 AM'
  },
  {
    label : '01:30 AM',
    time : '01:30 AM'
  },
  {
    label : '02:00 AM',
    time : '02:00 AM'
  },
  {
    label: '02:30 AM',
    time: '02:30 AM'
  },
  {
    label: '03:00 AM',
    time: '03:00 AM'
  },
  {
    label : '03:30 AM',
    time : '03:30 AM'
  },
  {
    label : '04:00 AM',
    time : '04:00 AM'
  },
  {
    label : '04:30 AM',
    time : '04:30 AM'
  },
  {
    label : '05:00 AM',
    time : '05:00 AM'
  },
  {
    label : '05:30 AM',
    time : '05:30 AM'
  },
  {
    label : '06:00 AM',
    time : '06:00 AM'
  },
  {
    label : '06:30 AM',
    time : '06:30 AM'
  },
  {
    label : '07:00 AM',
    time : '07:00 AM'
  },
  {
    label : '07:30 AM',
    time : '07:30 AM'
  },
  {
    label : '08:00 AM',
    time : '08:00 AM'
  },
  {
    label : '08:30 AM',
    time : '08:30 AM'
  },
  {
    label : '09:00 AM',
    time : '09:00 AM'
  },
  {
    label : '09:30 AM',
    time : '09:30 AM'
  },
  {
    label : '10:00 AM',
    time : '10:00 AM'
  },
  {
    label : '10:30 AM',
    time : '10:30 AM'
  },
  {
    label : '11:00 AM',
    time : '11:00 AM'
  },
  {
    label : '11:30 AM',
    time : '11:30 AM'
  },
  // PM
  {
    label : '12:00 PM',
    time : '12:00 PM'
  },
  {
    label : '12:30 PM',
    time : '12:30 PM'
  }, 
  {
    label : '01:00 PM',
    time : '01:00 PM'
  },
  {
    label : '01:30 PM',
    time : '01:30 PM'
  },
  {
    label : '02:00 PM',
    time : '02:00 PM'
  },
  {
    label: '02:30 PM',
    time: '02:30 PM'
  },
  {
    label: '03:00 PM',
    time: '03:00 PM'
  },
  {
    label : '03:30 PM',
    time : '03:30 PM'
  },
  {
    label : '04:00 PM',
    time : '04:00 PM'
  },
  {
    label : '04:30 PM',
    time : '04:30 PM'
  },
  {
    label : '05:00 PM',
    time : '05:00 PM'
  },
  {
    label : '05:30 PM',
    time : '05:30 PM'
  },
  {
    label : '06:00 PM',
    time : '06:00 PM'
  },
  {
    label : '06:30 PM',
    time : '06:30 PM'
  },
  {
    label : '07:00 PM',
    time : '07:00 PM'
  },
  {
    label : '07:30 PM',
    time : '07:30 PM'
  },
  {
    label : '08:00 PM',
    time : '08:00 PM'
  },
  {
    label : '08:30 PM',
    time : '08:30 PM'
  },
  {
    label : '09:00 PM',
    time : '09:00 PM'
  },
  {
    label : '09:30 PM',
    time : '09:30 PM'
  },
  {
    label : '10:00 PM',
    time : '10:00 PM'
  },
  {
    label : '10:30 PM',
    time : '10:30 PM'
  },
  {
    label : '11:00 PM',
    time : '11:00 PM'
  },
  {
    label : '11:30 PM',
    time : '11:30 PM'
  },
]

export function pRatioToFontSize  ( additionalSize = 0 ) {
  let pRatio = PixelRatio.get();
  switch(pRatio) {
    case pRatio >= 2 && pRatio < 3  :
      // // console.log(Constants.deviceName + ` PR: ${pRatio} : `, RF(3+additionalSize) + ' ' + appliedComponent);
      return RF(3 + additionalSize)
    case pRatio >= 3 && pRatio < 4 :
    // // console.log(Constants.deviceName + ` PR: ${pRatio} : `, RF(3.5+additionalSize) + ' ' + appliedComponent);
      return RF(3.2 + additionalSize )
    default :
      // // console.log(Constants.deviceName + ' [DEFAULT SIZE]', RF(3+additionalSize) + ' ' + appliedComponent);
      return RF(2.5 + additionalSize )
  }
}