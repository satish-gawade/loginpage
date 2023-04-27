import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validationform';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup; //gropus the login form as a form group
  type: string = 'password'; //initialize type of password as string
  isText: boolean = false;  //give initial value of text as false
  eyeIcon: string = 'fa-eye-slash';  //give the eye font to eyeIcon and import it in html file

  //imported variables are imported in constructor method and at top of the code
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService
  ) {}

  //this block of code groups the login form and checks if it is validated or not
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],  //username is required 
      password: ['', Validators.required],  //password is required
    });
  }

  /*this block of code is the logic for password eye function,
  here it toggles the text in password field as either true or false and based on that toggles the eye button*/
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  flag:boolean=false;
  /* this block of code is used to show either if login form is valid or invalid*/
  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value); //sends the login object to the database
      this.auth.signIn(this.loginForm.value).subscribe({ //here the input from user is authenticated
        next: (res) => {
          console.log(res.message); //if success then display the message
          this.loginForm.reset(); //reset the form after details are submitted
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayload = this.auth.decodedToken();
          this.userStore.setFullNameForStore(tokenPayload.name);
          this.userStore.setRoleForStore(tokenPayload.role);
          this.toast.success({detail:"SUCCESS", summary:res.message, duration: 5000}); //shows the success message
          this.router.navigate(['dashboard'])
          this.flag=true;
        },
        error: (err) => {  //if any error occurs then display the error message
          this.toast.error({detail:"ERROR", summary:"Login details are incorrect!", duration: 5000}); //shows the error message
          console.log(err);
          this.flag=false;
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm); //throws the error with all the required fields
    }
  }
}
