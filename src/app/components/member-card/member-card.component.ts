import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../common/models/member.model';
import { Category } from '../../common/enums/category.enum';
import { Status } from '../../common/enums/status.enum';
import { ContactButtonComponent } from "../contact-button/contact-button.component";
import { ProfileButtonComponent } from "../profile-button/profile-button.component";
@Component({
  selector: 'app-member-card',
  imports: [CommonModule, ContactButtonComponent, ProfileButtonComponent],
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
}
