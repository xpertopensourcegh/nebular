/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

export const enum TimepickerTypes {
  HOUR = 'hour',
  MINUTE = 'minute',
  ALT = 'alt',
}


export interface NbSelectedTimeModel {
  hour?: string;
  minute?: string;
  alt?: string;
}

export interface NbSelectedTimePayload {
  time: NbSelectedTimeModel,
  twelveHourFormat: boolean,
  save?: boolean,
}
