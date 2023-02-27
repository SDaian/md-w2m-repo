import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUpperCase]',
})
export class UpperCaseInputDirective {
  constructor(public ref: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: { target: { value: string } }) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }
}
