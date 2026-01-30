import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app">
      <app-navbar *ngIf="showNavbar"></app-navbar>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      background: #f9fafb;
    }

    main {
      min-height: calc(100vh - 72px);
    }
  `]
})
export class AppComponent {
  get showNavbar(): boolean {
    const hideNavbarRoutes = ['/login', '/register'];
    return !hideNavbarRoutes.includes(this.router.url);
  }

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
}

