import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take, switchMap, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.loading$.pipe(
      take(1),
      switchMap(loading => {
        if (loading) {
          // Wait for loading to complete
          return this.authService.loading$.pipe(
            filter(loading => !loading),
            take(1),
            switchMap(() => this.authService.user$)
          );
        } else {
          return this.authService.user$;
        }
      }),
      take(1),
      map(user => {
        if (user && (user.email === 'admin@gmail.com' )) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
