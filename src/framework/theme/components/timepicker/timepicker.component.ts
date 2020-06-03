import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NbPortalDirective } from '../cdk/overlay/mapping';
import { NbSelectedTimeModel, NbSelectedTimePayload, TimepickerTypes } from './model';
import { NbDateService } from '../calendar-kit/services/date.service';
import { NbCalendarTimeModelService } from '../calendar-kit/services/calendar-time-model.service';

@Component({
  selector: 'nb-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  exportAs: 'nbTimepicker',
})
export class NbTimePickerComponent<D> implements OnInit {

  @Input() set isTwelveHoursFormat(isTwelveHoursFormat: boolean) {
    this._isTwelveHoursFormat = isTwelveHoursFormat;
  };
  @Output() onSelectTime: EventEmitter<NbSelectedTimePayload> = new EventEmitter<NbSelectedTimePayload>();

  get isTwelveHoursFormat(): boolean {
    return this._isTwelveHoursFormat;
  }

  set selectedTime(newValue: NbSelectedTimeModel) {
    this._selectedTime = newValue;
  }

  get getSelectedTime(): NbSelectedTimeModel {
    return this._selectedTime;
  }

  hoursColumnOptions: string[];
  minutesColumnOptions: string[];
  altColumnOptions: string[];

  _isTwelveHoursFormat: boolean;
  _selectedTime: NbSelectedTimeModel;

  readonly separator: string = ':';
  @ViewChild(NbPortalDirective, { static: true }) portal: NbPortalDirective;

  hour: TimepickerTypes = TimepickerTypes.HOUR;
  minute: TimepickerTypes = TimepickerTypes.MINUTE;
  alt: TimepickerTypes = TimepickerTypes.ALT;
  hostRef: ElementRef;

  constructor(protected cd: ChangeDetectorRef,
              protected nbCalendarTimeModelService: NbCalendarTimeModelService,
              protected dateService: NbDateService<D>) {
  }

  ngOnInit(): void {
    this.hoursColumnOptions =  this.nbCalendarTimeModelService.getHoursInDay(this.isTwelveHoursFormat);
    this.minutesColumnOptions = this.nbCalendarTimeModelService.getMinutesAndSeconds();
    this.altColumnOptions = this.isTwelveHoursFormat ? this.nbCalendarTimeModelService.ALT :
      this.nbCalendarTimeModelService.getMinutesAndSeconds();

    this.selectedTime = {
      hour: this.hoursColumnOptions[0],
      minute: this.minutesColumnOptions[0],
      alt: this.isTwelveHoursFormat ? this.nbCalendarTimeModelService.ALT[0] : this.minutesColumnOptions[0],
    };
  }

  setHost(hostRef: ElementRef) {
    this.hostRef = hostRef;
  }

  attach(hostRef: ElementRef) {
    this.hostRef = hostRef;
  }

  setCurrentTime() {
    const currentTime = this.dateService.getCurrentTime(
      this.isTwelveHoursFormat).split(this.separator);

    this.selectedTime = {
      hour: currentTime[0],
      minute: currentTime[1],
      alt: currentTime[2],
    };

    this.updateValue();
    this.saveValue();
  }

  select(newValue: NbSelectedTimeModel) {
    this.selectedTime = {...this.getSelectedTime, ...newValue};
    this.updateValue();
  }

  updateValue() {
    this.onSelectTime.emit(
      {time: this.getSelectedTime, twelveHourFormat: this.isTwelveHoursFormat});
  }

  saveValue() {
    this.onSelectTime.emit(
      {time: this.getSelectedTime, twelveHourFormat: this.isTwelveHoursFormat, save: true});
  }
}
