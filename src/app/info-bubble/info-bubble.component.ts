import {
  AfterViewInit,
  Component,
  Input,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'info-bubble',
  templateUrl: './info-bubble.component.html',
  styleUrls: ['./info-bubble.component.scss'],
})
export class InfoBubbleComponent implements AfterViewInit {
  @Input() tooltip: string;
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' =
    'bottom-right';
  @Output() closeTooltip: EventEmitter<void> = new EventEmitter<void>();
  showTooltip: boolean = false;
  tooltipWidth: string = 'auto';

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (this.showTooltip) {
      this.adjustTooltipWidth();
    }
  }

  get isTooltipString(): boolean {
    return this.tooltip !== undefined;
  }

  get positionClass(): string {
    return `tooltip-${this.position}`;
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.closeTooltip.emit();
      this.showTooltip = false;
    }
  }

  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
    if (this.showTooltip) {
      setTimeout(() => {
        this.adjustTooltipWidth();
      });
    }
  }

  private adjustTooltipWidth() {
    const tooltipContainer =
      this.elementRef.nativeElement.querySelector('.tooltip-container');
    const tooltipContent =
      this.elementRef.nativeElement.querySelector('.tooltip-content');
    if (tooltipContainer && tooltipContent) {
      const tooltipWidth = tooltipContent.offsetWidth;
      this.tooltipWidth = tooltipWidth + 'px';
    }
  }
}
