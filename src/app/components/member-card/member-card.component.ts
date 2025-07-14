import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../common/models/member.model';
import { Category } from '../../common/enums/category.enum';
import { Status } from '../../common/enums/status.enum';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-member-card',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent {
  @Input() member!: Member;
  Category = Category;
  Status = Status;

  toggleContactStatus(member: Member) {
    member.status =
      member.status === Status.CONTACTED
        ? Status.NOT_CONTACTED
        : Status.CONTACTED;
  }

  get contactButtonClass(): string {
    return this.member.status === Status.CONTACTED
      ? 'w-full h-full bg-secondary-500 text-primary-50 hover:bg-secondary-600'
      : 'w-full h-full bg-primary-500 text-primary-800 hover:bg-secondary-200';
  }

  get contactButtonText(): string {
    return this.member.status === Status.CONTACTED ? 'Contacted' : 'Contact';
  }
}
