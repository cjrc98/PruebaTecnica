import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() color: string;
  @Input() title: string;
  @Input() data: string;
  colorCard: string = 'container__card';

  ngOnInit(): void {
    this.switch(this.color);
  }

  switch(value: string): void {
    switch (value) {
      case '1':
        this.colorCard = 'container__card red';
        break;
      case '2':
        this.colorCard = 'container__card green';
        break;
      case '3':
        this.colorCard = 'container__card purple';
        break;
      case '4':
        this.colorCard = 'container__card blue';
        break;
    }
  }
  changeColor(color) {
    console.log(color);
    const card = document.querySelector(".container__card");
    console.log(card);

    if (color) {
      card.className = '';
      card.classList.add('container__card');
      card.classList.add(color);
    }
  }
}
