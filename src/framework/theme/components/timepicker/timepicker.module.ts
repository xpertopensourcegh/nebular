/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbOverlayModule } from '../cdk/overlay/overlay.module';
import { NbListModule } from '../list/list.module';
import { NbCardModule } from '../card/card.module';
import { NbLayoutModule } from '../layout/layout.module';
import { NbButtonModule } from '../button/button.module';
import { NbRadioModule } from '../radio/radio.module';
import { NbTimePickerDirective } from './timepicker.directive';
import { NbTimePickerComponent } from './timepicker.component';
import { NbTimePickerCellComponent } from './timepicker-cell.component';
import { NbDateService } from '../calendar-kit/services/date.service';
import { NbNativeDateService } from '../calendar-kit/services/native-date.service';
import { NbCalendarTimeModelService } from '../calendar-kit/services/calendar-time-model.service';

@NgModule({
  imports: [
    CommonModule,
    NbLayoutModule,
    NbButtonModule,
    NbOverlayModule,
    NbRadioModule,
    NbListModule,
    NbCardModule,
  ],
  providers: [NbCalendarTimeModelService],
  exports: [NbTimePickerComponent, NbTimePickerCellComponent, NbTimePickerDirective],
  declarations: [NbTimePickerComponent, NbTimePickerCellComponent, NbTimePickerDirective],
})
export class NbTimepickerModule {
  static forRoot(): ModuleWithProviders<NbTimepickerModule> {
    return {
      ngModule: NbTimepickerModule,
      providers: [{provide: NbDateService, useClass: NbNativeDateService},
      ],
    };
  }
}
