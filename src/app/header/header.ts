import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  @Output() typeChange = new EventEmitter<'time' | 'words'>();
  @Output() includeNumbersChange = new EventEmitter<boolean>();
  @Output() includePunctuationChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<number>();
  @Output() reset = new EventEmitter<void>();

  currentType: 'time' | 'words' = 'time';
  includeNumbers = false;
  includePunctuation = false;

  selectedValues = { time: 15, words: 25 };
  durationsMap = { time: [15, 30, 60], words: [25, 50, 100] };

  get durations() {
    return this.durationsMap[this.currentType];
  }
  get currentValue() {
    return this.selectedValues[this.currentType];
  }

  changeType(type: 'time' | 'words') {
    this.currentType = type;
    this.typeChange.emit(type);
  }
  changeValue(value: number) {
    this.selectedValues[this.currentType] = value;
    this.valueChange.emit(value);
  }
  toggleNumbers() {
    this.includeNumbers = !this.includeNumbers;
    this.includeNumbersChange.emit(this.includeNumbers);
  }
  togglePunctuation() {
    this.includePunctuation = !this.includePunctuation;
    this.includePunctuationChange.emit(this.includePunctuation);
  }
  resetTest() {
    this.reset.emit();
  }
}
