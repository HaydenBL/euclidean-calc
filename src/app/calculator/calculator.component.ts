import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, fromEvent, combineLatest } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  @ViewChild('output') output: ElementRef;
  @ViewChild('input1') input1: ElementRef;
  @ViewChild('input2') input2: ElementRef;

  ngOnInit() {
    const input1$: Observable<number> = fromEvent(this.input1.nativeElement, 'input').pipe(
      map((e: KeyboardEvent) => e.target['value']),
      filter(val => !isNaN(Number(val)) && val >= 0 && val !== ''),
      distinctUntilChanged()
    );
    const input2$: Observable<number> = fromEvent(this.input2.nativeElement, 'input').pipe(
      map((e: KeyboardEvent) => e.target['value']),
      filter(val => !isNaN(Number(val)) && val >= 0 && val !== ''),
      distinctUntilChanged()
    );

    combineLatest(input1$, input2$).pipe(
      debounceTime(700)
    ).subscribe(([num1, num2]: [number, number]) => {
      this.output.nativeElement.innerHTML = '';
      this.log(`Solution: ${this.getGcd(num1, num2)}`);
    });
  }

  log(text: string): void {
    const newItem = document.createElement('li');
    newItem.appendChild(document.createTextNode(text));
    this.output.nativeElement.appendChild(newItem);
  }

  getGcd(num1: number, num2: number): number {
    const largerNum: number = num1 > num2 ? num1 : num2;
    const smallerNum: number = num1 > num2 ? num2 : num1;

    if (smallerNum === 0) {
      return largerNum;
    }

    const quotient = Math.floor(largerNum / smallerNum);
    const remainder = largerNum % smallerNum;

    this.log(`${largerNum} = ${quotient} x ${smallerNum} + ${remainder}`);
    this.log(`GCD(${num1}, ${num2}) = GCD(${smallerNum}, ${remainder})`);

    return this.getGcd(smallerNum, remainder);
  }

}
