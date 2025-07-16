import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../common/models/member.model';
import { Category } from '../../common/enums/category.enum';
import { Status } from '../../common/enums/status.enum';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-member-card',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent {
  member = input.required<Member>();
  Category = Category;
  Status = Status;

  private memberStatus = signal<Status>(this.member().status);

  toggleContactStatus() {
    const currentStatus = this.memberStatus();
    this.memberStatus.set(
      currentStatus === Status.CONTACTED
        ? Status.NOT_CONTACTED
        : Status.CONTACTED
    );
  }

  get contactButtonClass(): string {
    return this.memberStatus() === Status.CONTACTED
      ? 'w-full h-full bg-secondary-500 text-primary-50 hover:bg-secondary-600'
      : 'w-full h-full bg-primary-500 text-primary-800 hover:bg-secondary-200';
  }

  get contactButtonText(): string {
    return this.memberStatus() === Status.CONTACTED ? 'Contacted' : 'Contact';
  }

  get currentStatus(): Status {
    return this.memberStatus();
  }
}
