import {
  AfterViewInit,
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  forwardRef,
  Input,
} from '@angular/core';
import { NbTimePickerComponent } from './timepicker.component';
import { NbOverlayRef, NbScrollStrategy } from '../cdk/overlay/mapping';
import { filter } from 'rxjs/operators';
import {
  NbAdjustableConnectedPositionStrategy,
  NbAdjustment,
  NbPosition,
  NbPositionBuilderService,
} from '../cdk/overlay/overlay-position';
import { Subject } from 'rxjs';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NbOverlayService } from '../cdk/overlay/overlay-service';
import { NbTrigger, NbTriggerStrategy, NbTriggerStrategyBuilderService } from '../cdk/overlay/overlay-trigger';
import { NbSelectedTimePayload } from './model';

@Directive({
  selector: 'input[nbTimepicker]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NbTimePickerDirective),
    multi: true,
  }],
})
export class NbTimePickerDirective implements AfterViewInit {
  /**
   * NbTimePickerComponent instance passed via input.
   * */
  protected _timePickerComponent: NbTimePickerComponent<Date>;

  protected overlayRef: NbOverlayRef;

  protected overlayOffset = 8;

  protected positionStrategy: NbAdjustableConnectedPositionStrategy;

  protected destroy$: Subject<void> = new Subject<void>();

  /**
   * Provides timepicker component.
   * */
  @Input('nbTimepicker')
  get timepicker(): NbTimePickerComponent<Date> {
    return this._timePickerComponent;
  }

  set timepicker(timePicker: NbTimePickerComponent<Date>) {
    this._timePickerComponent = timePicker;
  }

  /**
   * Determines is timepicker overlay opened.
   * */
  get isOpen(): boolean {
    return this.overlayRef && this.overlayRef.hasAttached();
  }

  /**
   * Trigger strategy used by overlay.
   * @docs-private
   * */
  protected triggerStrategy: NbTriggerStrategy;

  /**
   * Returns html input element.
   * */
  get input(): HTMLInputElement {
    return this.hostRef.nativeElement;
  }

  /**
   * Determines is timepicker overlay closed.
   * */
  get isClosed(): boolean {
    return !this.isOpen;
  }

  constructor(protected positionBuilder: NbPositionBuilderService,
              protected hostRef: ElementRef,
              protected triggerStrategyBuilder: NbTriggerStrategyBuilderService,
              protected overlay: NbOverlayService,
              protected cd: ChangeDetectorRef,
  ) {
  }

  ngAfterViewInit() {
    this.triggerStrategy = this.createTriggerStrategy();
    this.subscribeOnTriggers();
  }

  show() {
    if (this.isClosed) {
      this.attachToOverlay();
    }
  }

  hide() {
    if (this.isOpen) {
      this.overlayRef.detach();
      this.cd.markForCheck();
    }
  }

  protected attachToOverlay() {
    if (!this.overlayRef) {
      this.setupTimepicker();
      this.initOverlay();
    }
    this.overlayRef.attach(this.timepicker.portal);
  }

  setupTimepicker() {
    this.timepicker.setHost(this.hostRef);
  }

  protected initOverlay() {
    this.positionStrategy = this.createPositionStrategy();
    this.subscribeOnApplyClick();
    this.createOverlay();
  }

  protected subscribeOnApplyClick() {
    this.timepicker.onSelectTime.subscribe((value: NbSelectedTimePayload) => {
      this.input.value = value.twelveHourFormat ? `${value.time.hour}:${value.time.minute} ${value.time.alt}` :
        `${value.time.hour}:${value.time.minute}:${value.time.alt}`;
      if (value.save) {
        this.hide();
      }
    });
  }

  protected createOverlay() {
    const scrollStrategy = this.createScrollStrategy();
    this.overlayRef = this.overlay.create(
      {positionStrategy: this.positionStrategy, scrollStrategy});
  }

  protected subscribeOnTriggers() {
    this.triggerStrategy.show$
    .pipe(filter(() => this.isClosed))
    .subscribe(() => this.show());

    this.triggerStrategy.hide$
    .pipe(filter(() => this.isOpen))
    .subscribe(() => this.hide());
  }

  protected createTriggerStrategy(): NbTriggerStrategy {
    return this.triggerStrategyBuilder
    .trigger(NbTrigger.FOCUS)
    .host(this.hostRef.nativeElement)
    .container(() => this.getContainer())
    .build();
  }

  protected createPositionStrategy(): NbAdjustableConnectedPositionStrategy {
    return this.positionBuilder
    .connectedTo(this.hostRef)
    .position(NbPosition.BOTTOM)
    .offset(this.overlayOffset)
    .adjustment(NbAdjustment.VERTICAL);
  }

  protected getContainer() {
    return this.overlayRef && this.isOpen && <ComponentRef<any>>{
      location: {
        nativeElement: this.overlayRef.overlayElement,
      },
    };
  }

  protected createScrollStrategy(): NbScrollStrategy {
    return this.overlay.scrollStrategies.block();
  }
}
