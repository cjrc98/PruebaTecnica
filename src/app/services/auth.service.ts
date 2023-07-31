import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data: any;

  constructor(private http: HttpClient) { }

  validationDataAccess(): any{
    const url = 'http://localhost:3000/perfil'; // Reemplaza esta URL con la de tu servidor JSON
   return this.http.get<any>(url);
  }
  
}
