import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NbSelectedTimeModel } from './model';

@Component({
  selector: 'nb-timepicker-cell',
  template: `
    <div #target (click)="scroll()" class="value">{{ value }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./timepicker-cell.component.scss'],

})
export class NbTimePickerCellComponent {
  @Input() selected: boolean;
  @Input() value: string;
  @Input() type: string;
  @ViewChild('target') element: ElementRef;

  @Output() select: EventEmitter<NbSelectedTimeModel> = new EventEmitter(true);

  @HostListener('click')
  onClick() {
    this.select.emit({ [this.type]: this.value });
  }

  scroll() {
    this.element.nativeElement.scrollIntoView({block: 'center'});
  }
}
