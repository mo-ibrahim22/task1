import { Routes } from '@angular/router';
import { ShopComponent } from './pages/shop/shop.component';
import { authGuard } from './common/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/shop', pathMatch: 'full' },

  // Eagerly loaded
  { path: 'shop', component: ShopComponent },

  // Lazy-loaded with route guards
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/auth/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/auth/signin/signin.component').then(
        (m) => m.SigninComponent
      ),
  },

  { path: '**', redirectTo: '/shop' },
];
