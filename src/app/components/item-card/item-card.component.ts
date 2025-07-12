import { Component, Input } from '@angular/core';
import { Product } from '../../common/models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-card',
  imports: [CommonModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css',
})
export class ItemCardComponent {
  @Input() product!: Product;
  @Input() first!: boolean;
  @Input() last!: boolean;
}
