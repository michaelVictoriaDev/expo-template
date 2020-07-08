import { PixelRatio } from 'react-native';
import * as Constants from 'expo-constants';
import RF from "react-native-responsive-fontsize";

export const colors = {
  PIGMENT_GREEN: '#008C48',
  WHITE: '#FFFFFF',
  LIGHT_GREEN: '#4caf50',
  BLACK: '#000000',
  RED: '#cc0000',
  GRAYISHRED: '#644848',
  PINK_400: '#EC407A',
  PINK_500: '#E91E63',
  PRIMARY_COLOR: '#1788c7',
  DARK_GRAY: '#AAAAAA',
  LINK_WATER: '#D0D1D3',
};


export const months = [
  {
    value: "01",
    name: "January"
  },
  {
    value: "02",
    name: "February"
  },
  {
    value: "03",
    name: "March"
  },
  {
    value: "04",
    name: "April"
  },
  {
    value: "05",
    name: "May"
  },
  {
    value: "06",
    name: "June"
  },
  {
    value: "07",
    name: "July"
  },
  {
    value: "08",
    name: "August"
  },
  {
    value: "09",
    name: "September"
  },
  {
    value: "10",
    name: "October"
  },
  {
    value: "11",
    name: "November"
  },
  {
    value: "12",
    name: "December"
  }
];

export const years = [
  {
    value: 20,
    year: '2020'
  },
  {
    value: 21,
    year: '2021'
  },
  {
    value: 22,
    year: '2022'
  },
  {
    value: 23,
    year: '2023'
  },
  {
    value: 24,
    year: '2024'
  },
  {
    value: 25,
    year: '2025'
  },
  {
    value: 26,
    year: '2026'
  },
  {
    value: 27,
    year: '2027'
  },
  {
    value: 28,
    year: '2028'
  },
  {
    value: 29,
    year: '2029'
  },
  {
    value: 30,
    year: '2030'
  },
  {
    value: 31,
    year: '2031'
  }, {
    value: 32,
    year: '2032'
  },
  {
    value: 33,
    year: '2033'
  },
  {
    value: 34,
    year: '2034'
  },
  {
    value: 35,
    year: '2035'
  },
  {
    value: 36,
    year: '2036'
  },
  {
    value: 37,
    year: '2037'
  },
  {
    value: 38,
    year: '2038'
  },
  {
    value: 39,
    year: '2039'
  },
  {
    value: 40,
    year: '2040'
  },
  {
    value: 41,
    year: '2041'
  }, 
  {
    value: 42,
    year: '2042'
  },
  {
    value: 43,
    year: '2043'
  },
  {
    value: 44,
    year: '2044'
  },
  {
    value: 45,
    year: '2045'
  },
  {
    value: 46,
    year: '2046'
  },
  {
    value: 47,
    year: '2047'
  },
  {
    value: 48,
    year: '2048'
  },
  {
    value: 49,
    year: '2049'
  },
  {
    value: 50,
    year: '2050'
  },
  {
    value: 51,
    year: '2051'
  }, 
  {
    value: 52,
    year: '2052'
  },
  {
    value: 53,
    year: '2053'
  },
  {
    value: 54,
    year: '2054'
  },
  {
    value: 55,
    year: '2055'
  },
  {
    value: 56,
    year: '2056'
  },
  {
    value: 57,
    year: '2057'
  },
  {
    value: 58,
    year: '2058'
  },
  {
    value: 59,
    year: '2059'
  },
  {
    value: 60,
    year: '2060'
  },
  {
    value: 61,
    year: '2061'
  }, {
    value: 62,
    year: '2062'
  },
  {
    value: 63,
    year: '2063'
  },
  {
    value: 64,
    year: '2064'
  },
  {
    value: 65,
    year: '2065'
  },
  {
    value: 66,
    year: '2066'
  },
  {
    value: 67,
    year: '2067'
  },
  {
    value: 68,
    year: '2068'
  },
  {
    value: 69,
    year: '2069'
  },
  {
    value: 70,
    year: '2070'
  },
  {
    value: 71,
    year: '2071'
  }, {
    value: 72,
    year: '2072'
  },
  {
    value: 73,
    year: '2073'
  },
  {
    value: 74,
    year: '2074'
  },
  {
    value: 75,
    year: '2075'
  },
  {
    value: 76,
    year: '2076'
  },
  {
    value: 77,
    year: '2077'
  },
  {
    value: 78,
    year: '2078'
  },
  {
    value: 79,
    year: '2079'
  },
  {
    value: 80,
    year: '2080'
  }, 
  {
    value: 81,
    year: '2081'
  }, 
  {
    value: 82,
    year: '2082'
  },
  {
    value: 83,
    year: '2083'
  },
  {
    value: 84,
    year: '2084'
  },
  {
    value: 85,
    year: '2085'
  },
  {
    value: 86,
    year: '2086'
  },
  {
    value: 87,
    year: '2087'
  },
  {
    value: 88,
    year: '2088'
  },
  {
    value: 89,
    year: '2089'
  },
  {
    value: 90,
    year: '2090'
  }, {
    value: 91,
    year: '2091'
  }, {
    value: 92,
    year: '2092'
  },
  {
    value: 93,
    year: '2093'
  },
  {
    value: 94,
    year: '2094'
  },
  {
    value: 95,
    year: '2095'
  },
  {
    value: 96,
    year: '2096'
  },
  {
    value: 97,
    year: '2097'
  },
  {
    value: 98,
    year: '2098'
  },
  {
    value: 99,
    year: '2099'
  }

];






export const timesPicker = [
  {
    label: '12:00 AM',
    time: '12:00 AM'
  },
  {
    label: '12:30 AM',
    time: '12:30 AM'
  },
  {
    label: '01:00 AM',
    time: '01:00 AM'
  },
  {
    label: '01:30 AM',
    time: '01:30 AM'
  },
  {
    label: '02:00 AM',
    time: '02:00 AM'
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
    label: '03:30 AM',
    time: '03:30 AM'
  },
  {
    label: '04:00 AM',
    time: '04:00 AM'
  },
  {
    label: '04:30 AM',
    time: '04:30 AM'
  },
  {
    label: '05:00 AM',
    time: '05:00 AM'
  },
  {
    label: '05:30 AM',
    time: '05:30 AM'
  },
  {
    label: '06:00 AM',
    time: '06:00 AM'
  },
  {
    label: '06:30 AM',
    time: '06:30 AM'
  },
  {
    label: '07:00 AM',
    time: '07:00 AM'
  },
  {
    label: '07:30 AM',
    time: '07:30 AM'
  },
  {
    label: '08:00 AM',
    time: '08:00 AM'
  },
  {
    label: '08:30 AM',
    time: '08:30 AM'
  },
  {
    label: '09:00 AM',
    time: '09:00 AM'
  },
  {
    label: '09:30 AM',
    time: '09:30 AM'
  },
  {
    label: '10:00 AM',
    time: '10:00 AM'
  },
  {
    label: '10:30 AM',
    time: '10:30 AM'
  },
  {
    label: '11:00 AM',
    time: '11:00 AM'
  },
  {
    label: '11:30 AM',
    time: '11:30 AM'
  },
  // PM
  {
    label: '12:00 PM',
    time: '12:00 PM'
  },
  {
    label: '12:30 PM',
    time: '12:30 PM'
  },
  {
    label: '01:00 PM',
    time: '01:00 PM'
  },
  {
    label: '01:30 PM',
    time: '01:30 PM'
  },
  {
    label: '02:00 PM',
    time: '02:00 PM'
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
    label: '03:30 PM',
    time: '03:30 PM'
  },
  {
    label: '04:00 PM',
    time: '04:00 PM'
  },
  {
    label: '04:30 PM',
    time: '04:30 PM'
  },
  {
    label: '05:00 PM',
    time: '05:00 PM'
  },
  {
    label: '05:30 PM',
    time: '05:30 PM'
  },
  {
    label: '06:00 PM',
    time: '06:00 PM'
  },
  {
    label: '06:30 PM',
    time: '06:30 PM'
  },
  {
    label: '07:00 PM',
    time: '07:00 PM'
  },
  {
    label: '07:30 PM',
    time: '07:30 PM'
  },
  {
    label: '08:00 PM',
    time: '08:00 PM'
  },
  {
    label: '08:30 PM',
    time: '08:30 PM'
  },
  {
    label: '09:00 PM',
    time: '09:00 PM'
  },
  {
    label: '09:30 PM',
    time: '09:30 PM'
  },
  {
    label: '10:00 PM',
    time: '10:00 PM'
  },
  {
    label: '10:30 PM',
    time: '10:30 PM'
  },
  {
    label: '11:00 PM',
    time: '11:00 PM'
  },
  {
    label: '11:30 PM',
    time: '11:30 PM'
  },
]

export function pRatioToFontSize(additionalSize = 0) {
  let pRatio = PixelRatio.get();
  switch (pRatio) {
    case pRatio >= 2 && pRatio < 3:
      // // console.log(Constants.deviceName + ` PR: ${pRatio} : `, RF(3+additionalSize) + ' ' + appliedComponent);
      return RF(3 + additionalSize)
    case pRatio >= 3 && pRatio < 4:
      // // console.log(Constants.deviceName + ` PR: ${pRatio} : `, RF(3.5+additionalSize) + ' ' + appliedComponent);
      return RF(3.2 + additionalSize)
    default:
      // // console.log(Constants.deviceName + ' [DEFAULT SIZE]', RF(3+additionalSize) + ' ' + appliedComponent);
      return RF(2.5 + additionalSize)
  }
}