import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  validationLogin: FormGroup;
  loadFinished = false;
  isLoading = false;
  check = true;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
  ) {
  }

  save(event: Event) {

  }
  simulateAsyncTask() {
    this.isLoading = true;
    this.loadFinished = false;
    this.check = true;
   
    setTimeout(() => {
      this.isLoading = false;
      this.loadFinished = true;
      this.check = false;
      this.simulateAsyncTaskTwo();    
    }, 1500);
  }

  simulateAsyncTaskTwo(){
    setTimeout(() => {
      console.log("redirigiendo........");
    }, 1500);
  }


}
