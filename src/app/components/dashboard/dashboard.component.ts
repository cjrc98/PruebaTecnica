import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  csvFile: File;
  csvData: any[][] = [];
  hola: any;

  onFileSelected(event: any) {
    this.csvFile = event.target.files[0];
  }

  processCSV() {
    if (this.csvFile) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const csvData = event.target.result;
        this.csvData = this.CSVToArray(csvData);
        this.csvData[0].splice(11, 0, "Province", "Country");
        this.calcData(this.matrizToJson(this.csvData));
        return this.csvData;
      };

      reader.readAsText(this.csvFile);
    }
  }

  private CSVToArray(strData: string): any[][] {
    const arrData: any[][] = [];
    const lines = strData.split('\n');
    for (const line of lines) {
      const data = line.split(',');
      arrData.push(data);
    }
    return arrData;
  }

  readArray(data: any) {
    data.forEach(element => {
      console.log(element[0]);
    });
  }

  matrizToJson(matriz: any[][]): any[] {
    const keys = matriz[0];
    const jsonData: any[] = [];

    for (let i = 1; i < matriz.length; i++) {
      const objeto: any = {};
      for (let j = 0; j < keys.length; j++) {
        objeto[keys[j]] = matriz[i][j];
      }
      jsonData.push(objeto);
    }

    return jsonData;
  }

  calcData(jsonData) {
    const state = {
      poblation: [],
      infected: [],
      states: []
    };
    this.insertDataStateObject(state, jsonData);
    this.calcStatesAffected(state);

  }

  calcStatesAffected(state) {

    let valueStatesAffected = 0, statesAffected = '';
    let maxinfected = -Infinity;
    let mininfected = Infinity;
    for (let index = 0; index < state.states.length; index++) {
      const infected = state.infected[index];
      const poblation = state.poblation[index];

      const percentageInfected = (infected * 100) / poblation;

      if (percentageInfected > valueStatesAffected) {
        valueStatesAffected = percentageInfected;
        statesAffected = state.states[index];
      }

      if (!Number.isNaN(infected)) {
        maxinfected = Math.max(maxinfected, infected);
        mininfected = Math.min(mininfected, infected);
      }
    }

    console.log('states mas Affected con un porcentaje de infeccion de: ', valueStatesAffected, ' es el states de:', statesAffected);
    console.log('Valor más alto de infected:', maxinfected);
    console.log('Valor más bajo de infected:', mininfected);
    console.log(state);
  }

  insertDataStateObject(state, jsonData) {
    const keyss = Object.keys(jsonData[0]);
    const lastKey = keyss[keyss.length - 1];
    let provinceState: string;
    let variable = 0, poblation = 0;
    let control: number = 0, control2: number = 0, control3: number = 0, controlp: number = 0;

    for (let k = 0; k < jsonData.length; k++) {

      provinceState = jsonData[k].Province_State;
      provinceState = provinceState.replace(/\s+/g, '');
      if (!state.states.includes(provinceState)) {
        state.states.push(provinceState);
      }

    }

    for (let k = 0; k < jsonData.length; k++) {

      for (let i = 0; i < state.states.length; i++) {
        const element = state.states[i];
        let stateJson;
        stateJson = jsonData[k].Province_State;
        stateJson = stateJson.replace(/\s+/g, '');
        if (element == stateJson && stateJson != "US\"") {
          if (i !== control) {
            variable = 0;
            control2 = 1
          }
          if (i !== controlp) {
            poblation = 0;
            control3 = 1
          }
          variable = variable + parseInt(jsonData[k][lastKey]);
          poblation = poblation + parseInt(jsonData[k].Population);
          state.infected[i] = variable;
          state.poblation[i] = poblation;
        }
        if (variable != 0 && control2 == 1) {
          control = i;
          control2 = 0;
        }
        if (poblation != 0 && control3 == 1) {
          controlp = i;
          control3 = 0;
        }

      }
    }
  }



  async enviarDatosAlServidor(data: any) {
    try {
      const response = await fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      console.log(responseData); // Respuesta del servidor (opcional)
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
    }
  }

}