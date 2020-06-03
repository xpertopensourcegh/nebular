import { Injectable } from '@angular/core';
import { range } from '../helpers';


@Injectable()
export class NbCalendarTimeModelService {
  readonly HOURS_IN_DAY: number = 24;
  readonly HOURS_IN_DAY_ALT: number = 12;
  readonly MINUTES_AND_SECONDS: number = 60;
  readonly ALT = ['AM', 'PM'];

  getHoursInDay(isTwelveHoursFormat: boolean): string[] {
    return isTwelveHoursFormat ?
      range(this.HOURS_IN_DAY_ALT, i => this.formatToString(i))
      : range(this.HOURS_IN_DAY, i => this.formatToString(i));
  }

  getMinutesAndSeconds(): string[] {
    return range(this.MINUTES_AND_SECONDS, i => this.formatToString(i));
  }

  protected formatToString(n: number): string {
    return n < 10 ? `0${n.toString()}` : n.toString();
  }
}
