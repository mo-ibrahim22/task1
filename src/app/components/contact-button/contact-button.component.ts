import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Status } from '../../common/enums/status.enum';

@Component({
  selector: 'app-contact-button',
  imports: [CommonModule],
  templateUrl: './contact-button.component.html',
  styleUrl: './contact-button.component.css',
})
export class ContactButtonComponent {
  @Input() status: Status = Status.NOT_CONTACTED;
  @Output() clicked = new EventEmitter<void>();
  public StatusEnum = Status;

  onClick() {
    this.clicked.emit();
  }
}
