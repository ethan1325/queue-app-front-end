import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }
  canActivate() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    return this.authService.isLoggedIn();
  }
  
}
