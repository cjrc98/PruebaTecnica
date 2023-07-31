import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  ValidationFormUSer!: FormGroup;
  loadFinished = false;
  loginFalse = false;
  isLoading = false;
  check = true;
  noLogin = false;
  alertMsg='';

  validationMessages = {
    email: [
      { type: 'required', message: 'Ingresa un correo electronico' },
      {
        type: 'pattern',
        message: 'El correo electronico es incorrecto, intentalo de nuevo',
      },
    ],
    password: [
      { type: 'required', message: 'Ingresa una contraseña' },
      {
        type: 'minlength',
        message: 'La contraseña debe tener minimo 6 caracteres',
      },
      {
        type: 'maxlength',
        message: 'La contraseña debe tener maximo 15 caracteres',
      },
    ],
  };

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
  }
  ngOnInit(): void {
    this.ValidationFormUSer = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9_-]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}'),
        ])
      ),

      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ])
      ),
    });
  }

  save(event: Event) {

  }
  simulateAsyncTask() {
    this.isLoading = true;
    this.loadFinished = false;
    this.check = true;

    setTimeout(() => {
      this.isLoading = false;
      this.login(); 
      this.check = false;
      this.simulateAsyncTaskTwo();
    }, 1500);
  }

  simulateAsyncTaskTwo() {
    setTimeout(() => {
      if( this.loadFinished==true){
        this.router.navigate(['dashboard']);
      }
    }, 500);
  }

   login() {
    let resp = this.auth.validationDataAccess().subscribe(
      (response) => {
        let cnt=0;
        response.forEach(element => {
          cnt++;
          if (element.email == this.ValidationFormUSer.value.email && element.password == this.ValidationFormUSer.value.password) {
            this.noLogin=false;
            this.loadFinished=true;
            const userInfo = JSON.stringify(element);
            localStorage.setItem('userData',userInfo);
            
          }else if(cnt<response.length){
            this.noLogin=true;
            this.loginFalse=true;
            this.alertMsg="!Datos de inicio de sesion incorrectos!";
          }
        })
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
      }
    );
  }

  exitAlert(value){
    if (!value){
      this.noLogin= false;
      this.loginFalse=false;
      this.isLoading=false;
      this.check=true;
    }
  }

}
