import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertshowComponent } from './alertshow/alertshow.component';
import { CardComponent } from './card/card.component';
import { TitleComponent } from './title/title.component';



@NgModule({
  declarations: [
    LoginComponent,
    AlertshowComponent,
    CardComponent,
    TitleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
  ],
  exports: [
    AlertshowComponent,
    CardComponent,
    TitleComponent
  ]
})
export class ComponentsModule { }