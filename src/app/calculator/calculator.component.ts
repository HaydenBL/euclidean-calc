import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, fromEvent, combineLatest } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

function validInputValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const numRegex = /^[1-9]\d*(\.\d+)?$/;
    const valid = numRegex.test(control.value.trim());
    return valid ? null : {'invalidInput': {value: control.value}};
  };
}

function validNumber(input: string): boolean {
  const numRegex = /^[1-9]\d*(\.\d+)?$/;
  return numRegex.test(input);
}

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  @ViewChild('output') output: ElementRef;
  @ViewChild('input1') input1: ElementRef;
  @ViewChild('input2') input2: ElementRef;

  input1Control = new FormControl('', [
    Validators.required,
    validInputValidator()
  ]);
  input2Control = new FormControl('', [
    Validators.required,
    validInputValidator()
  ]);
  errorStateMatcher = new ErrorStateMatcher();

  ngOnInit() {
    const input1$: Observable<string> = fromEvent(this.input1.nativeElement, 'input').pipe(
      map((e: KeyboardEvent) => e.target['value'] || ''),
      map(input => input.trim()),
      distinctUntilChanged()
    );
    const input2$: Observable<string> = fromEvent(this.input2.nativeElement, 'input').pipe(
      map((e: KeyboardEvent) => e.target['value'] || ''),
      map(input => input.trim()),
      distinctUntilChanged()
    );

    combineLatest(input1$, input2$).pipe(
      debounceTime(700),
      filter(([input1, input2]: [string, string]) => validNumber(input1) && validNumber(input2)),
      map(([input1, input2]: [string, string]) => [Number(input1), Number(input2)])
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
