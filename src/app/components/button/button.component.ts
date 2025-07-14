import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ContentChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconPosition = 'left' | 'right' | 'center' | 'between';
export type TextAlign = 'left' | 'center' | 'right';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() customClass: string = '';
  @Input() size: ButtonSize = 'md';

  // Text content
  @Input() text: string = '';
  @Input() textAlign: TextAlign = 'center';

  // Icon configuration - only using icon files now
  @Input() iconSrc: string = ''; // Image source for icon
  @Input() iconPosition: IconPosition = 'left';
  @Input() iconClass: string = 'w-5 h-5';

  // Secondary icon (for between position)
  @Input() secondaryIconSrc: string = '';
  @Input() secondaryIconClass: string = 'w-5 h-5';

  // Loading icon
  @Input() loadingIconSrc: string = '';
  @Input() loadingIconClass: string = 'w-5 h-5 animate-spin';

  // Badge/Counter
  @Input() badge: string | number = '';
  @Input() badgeClass: string =
    'absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center';

  // Events
  @Output() clicked = new EventEmitter<Event>();

  // Content projection for custom content
  @ContentChild('customContent') customContent?: TemplateRef<any>;

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  get baseClasses(): string {
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm',
      md: 'px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm',
      lg: 'px-4 py-2 text-sm md:px-6 md:py-3 md:text-base',
      xl: 'px-6 py-3 text-base md:px-8 md:py-4 md:text-lg',
    };

    const textAlignClasses = {
      left: 'text-left justify-start',
      center: 'text-center justify-center',
      right: 'text-right justify-end',
    };

    const baseClass =
      'inline-flex items-center font-medium rounded-lg transition-all duration-200  disabled:opacity-50 disabled:cursor-not-allowed relative';

    return `${baseClass} ${sizeClasses[this.size]} ${
      textAlignClasses[this.textAlign]
    } ${this.customClass}`;
  }

  get shouldShowText(): boolean {
    return !!this.text && !this.loading;
  }

  get shouldShowIcon(): boolean {
    return !!this.iconSrc && !this.loading;
  }

  get shouldShowSecondaryIcon(): boolean {
    return (
      !!this.secondaryIconSrc &&
      this.iconPosition === 'between' &&
      !this.loading
    );
  }

  get shouldShowBadge(): boolean {
    return !!this.badge;
  }

  get shouldShowLoading(): boolean {
    return this.loading;
  }

  get iconGap(): string {
    if (!this.shouldShowText) return '';

    switch (this.iconPosition) {
      case 'left':
        return 'gap-1 md:gap-2';
      case 'right':
        return 'gap-1 md:gap-2 flex-row-reverse';
      case 'between':
        return 'gap-1 md:gap-2';
      case 'center':
        return '';
      default:
        return 'gap-1 md:gap-2';
    }
  }
}
