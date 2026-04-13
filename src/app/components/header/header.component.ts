import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService, Lang } from '../../services/translation.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  user: User | null = null;
  isMenuOpen = false;
  isLoading = true;
  isScrolled = false;

  constructor(
    private authService: AuthService,
    public ts: TranslationService
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.authService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  get lang(): Lang { return this.ts.current; }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 60;
  }

  toggleLang() {
    this.ts.toggle();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  logout() {
    this.authService.signOut();
    this.closeMenu();
  }
}
