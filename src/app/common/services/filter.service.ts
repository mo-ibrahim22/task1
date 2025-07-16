import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private searchTermSignal = signal<string>('');

  searchTerm = this.searchTermSignal.asReadonly();

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }
}
