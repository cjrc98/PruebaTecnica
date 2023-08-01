import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('myCanvas') myCanvas!: ElementRef;
  @ViewChild('myCanvas2') myCanvas2!: ElementRef;
  private context!: CanvasRenderingContext2D | null;
  private context2!: CanvasRenderingContext2D | null;
  
  csvFile: File;
  csvData: any[][] = [];
  hola: any;
  state = {
    poblation: [],
    infected: [],
    states: [],
    percentage: []
  };
  selectedOption: string;
  myChart;
  myChart2;
  valueStatesAffected: number = 0;
  statesAffected: number = 0;
  indexMaxInfected: number;
  indexMinInfected: number;
  saveinfo:boolean = false;
  activeCanvas: boolean = false;

  constructor(){
    Chart.register(...registerables);
  }

  ngOnInit(): void {

    if (this.getInfoLocalstorage()) {
      this.state = this.getInfoLocalstorage();
      this.calcStatesAffected(this.state);
    }else{
      this.saveinfo=true;
    }
    if (this.activeCanvas) {
      const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
      canvas.width = 400;
      canvas.height = 200;
    }
  
  }


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
        this.saveinfo=false;
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

    this.insertDataStateObject(this.state, jsonData);
    this.calcStatesAffected(this.state);
    this.setInfoLocalstorage(this.state,jsonData);
  }

  calcStatesAffected(state) {
    let maxinfected = -Infinity;
    let mininfected = Infinity;
    for (let index = 0; index < state.states.length; index++) {
      const infected = state.infected[index];
      const poblation = state.poblation[index];

      state.percentage[index] = (infected * 100) / poblation;

      if (state.percentage[index] > this.valueStatesAffected) {
        this.valueStatesAffected = state.percentage[index];
        this.statesAffected = index;
      }

      if (!Number.isNaN(infected) && infected!=null) {
        if (maxinfected < state.infected[index]) {
          maxinfected = state.infected[index];
          this.indexMaxInfected = index;
        }
        if (mininfected > state.infected[index]) {
          mininfected = state.infected[index];
          this.indexMinInfected = index;
        }

      }
    }

    console.log('states mas Affected con un porcentaje de infeccion de: ', this.valueStatesAffected, ' es el estado de:', this.statesAffected);
    console.log('Valor más alto de infected:', maxinfected);
    console.log('Valor más bajo de infected:', mininfected);
    // console.log(state);

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

  createChart(index) {
    this.activeCanvas=true;
    setTimeout(() => {
      this.context = this.myCanvas.nativeElement.getContext('2d');
    const colors = this.generateRandomColors(this.state.poblation.length);
    // this.destroyChart();
    if (this.myChart) {
      this.myChart.destroy();
    }
    this.myChart = new Chart(this.context, {
      type: 'pie',
      data: {
        labels: ['Poblacion', 'Muertes'],
        datasets: [  
          { data: [ this.state.poblation[index], this.state.infected[index] ], label: '', backgroundColor: colors, borderColor: 'rgba(0, 93, 82, 1)', borderWidth: 0.5 },
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

 
    }, 200);
    

  }

  createChartBar(index) {
   
    this.context = this.myCanvas2.nativeElement.getContext('2d');
    const colors = this.generateRandomColors(this.state.poblation.length);

    if (this.myChart2) {
      this.myChart2.destroy();
    }
    this.myChart2 = new Chart(this.context, {
      type: 'bar',
      data: {
        labels: this.state.states,
        datasets: [  
          // { data:this.state.poblation, label: '', backgroundColor: colors, borderColor: 'rgba(0, 93, 82, 1)', borderWidth: 0.5 },
          { data: this.state.infected, label: 'Muertes por estado', backgroundColor: colors, borderColor: 'rgba(0, 93, 82, 1)', borderWidth: 0.5 },
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  generateRandomColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const color = this.randomColor();
      colors.push(color);
    }
    return colors;
  }

  randomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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

  onOptionSelected(event: any) {
    this.selectedOption = event.target.value;
    console.log(event);
    
    const index = this.state.states.findIndex((element) => element === this.selectedOption);
    this.createChart(index);
    console.log(index);
    console.log('Índice seleccionado:', this.selectedOption);
    this.createChartBar(index);
  }

  setInfoLocalstorage(state,jsonData){
    this.saveinfo = true;
    const stateJSON = JSON.stringify(state);
    localStorage.setItem('staks', stateJSON);
  
  }
  getInfoLocalstorage(){
    const state = localStorage.getItem('staks');
    return JSON.parse(state) ; 
  }

  
}