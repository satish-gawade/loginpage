import { FormControl, FormGroup } from "@angular/forms";

/* here all form fields are validated and execution based on that is done,
also this is common code for the login and sign up components*/
export default class ValidateForm {
  static validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => { //this line checks all the keys and returns array of data
      const control = formGroup.get(field);
      if (control instanceof FormControl) { //if control shows that fields are used but not filled then error is displayed
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) { //else the control will validate all the form fields and return true
        this.validateAllFormFields(control);
      }
    });
  }
}
