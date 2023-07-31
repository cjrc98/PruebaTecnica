import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertshowComponent } from './alertshow/alertshow.component';



@NgModule({
  declarations: [
    LoginComponent,
    AlertshowComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
  ],
  exports: [
    AlertshowComponent,
  ]
})
export class ComponentsModule { }