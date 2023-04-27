import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validationform';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signUpForm!: FormGroup; //gropus the sign up form as a form group
  type: string = 'password'; //initialize type of password as string
  isText: boolean = false; //give initial value of text as false
  eyeIcon:string = "fa-eye-slash" //give the eye font to eyeIcon and import it in html file

  //imported variables are imported in constructor method and at top of the code
  constructor(private fb : FormBuilder, private auth: AuthService, private router: Router) { }

  //this block of code groups the sign up form and checks if it is validated or not
  ngOnInit() {
    this.signUpForm = this.fb.group({
      firstName:['', Validators.required], //first name is required
      lastName:['', Validators.required], //last name is required
      userName:['', Validators.required], //username is required
      email:['', Validators.required], //email is required
      password:['', Validators.required] //password is required
    })
  }

  /*this block of code is the logic for password eye function,
  here it toggles the text in password field as either true or false and based on that toggles the eye button*/
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash'
    this.isText ? this.type = 'text' : this.type = 'password'
  }

  /* this block of code is used to show either if sign up form is valid or invalid*/
  onSubmit() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value); //sends the sign up object to the database
      let signUpObj = {
        ...this.signUpForm.value,
        role:'',
        token:''
      }
      this.auth.signUp(signUpObj)
      .subscribe({ //here the input from user is authenticated
        next:(res=>{
          console.log(res.message); //if success then display the message
          this.signUpForm.reset(); //reset the form after details are submitted
          this.router.navigate(['login']);  //if sign up is success then route to the login page
          alert(res.message)
        }),
        error:(err=>{ //if any error occurs then display the error message
          alert(err?.error.message)
        })
      })
    } else {
      ValidateForm.validateAllFormFields(this.signUpForm); //throws the error with all the required fields
    }
  }

}
