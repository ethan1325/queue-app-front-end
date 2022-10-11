import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/User';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    const credentials: User = {
      username: this.username,
      password: this.password
    } 
    // console.log(credentials);
    this.authService.login(credentials).subscribe((token)=>{
      if(token){
        Swal.fire({
          title: 'Login Success!',
          text: 'Welcome, ' + credentials.username,
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false
        })
        this.router.navigate(['/index']);
      }
      else{
        Swal.fire({
          title: 'Login Failed!',
          text: "Wrong Credentials!",
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false
        })
      }
    });
  }
}
