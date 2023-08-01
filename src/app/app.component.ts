import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pruebaTecnica';

  constructor(private router: Router){
    this.routeInitial();
  }
  routeInitial(){
    if(localStorage.getItem('userData')){
      this.router.navigate(['dashboard']);
    }else{
      this.router.navigate(['login']);
    }
    
  }
}
