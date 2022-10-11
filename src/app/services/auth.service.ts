import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Token } from '../Token';
import { User } from '../User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private loggedUser?: String | null;

  constructor(private http: HttpClient, private router: Router) { }

  login(user: User) {
    return this.http.post<any>('http://localhost:8080/authenticate', user).pipe(
      tap(token => this.doLoginUser(user.username, token)),
      map(() => true),
      catchError( 
        error => {
          return of(false);
        }
      )
    );
  }

  isLoggedIn() {
    if(this.getToken() !== "undefined" && this.getToken() !== null){
      console.log(this.getToken());
      return true;
    }else {
      return false;
    }
  }

  doLoginUser(username: string, token: Token) {
    console.log(token.jwtToken);
    this.loggedUser = username;
    this.storeToken(token);
    console.log(this.getToken());
  }

  storeToken(token: Token){
    localStorage.setItem(this.JWT_TOKEN, token.jwtToken);
  }

  logout(){
    if(this.isLoggedIn()){
      this.loggedUser = null;
      this.removeToken();
      Swal.fire({
        title: 'Log Out Success',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false
      })
    } else {
      Swal.fire({
        title: 'You are not logged in!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      })
    }
    this.router.navigate(['/login']);
  }

  removeToken(){
    localStorage.removeItem(this.JWT_TOKEN);
  }

  getToken(){
    return localStorage.getItem(this.JWT_TOKEN);
  }
}
