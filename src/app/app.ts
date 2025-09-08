import { Component, ViewChild } from '@angular/core';   // 👈 زدت ViewChild
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { WordDisplayComponent } from './word-display/word-display';
import { ResultsPanel } from './results-panel/results-panel';
import { TypingAreaComponent } from './typing-area/typing-area';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    Header,
    WordDisplayComponent,
    ResultsPanel,
    TypingAreaComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  mode: 'time' | 'words' = 'time';
  durationOrCount: number = 15;
  includeNumbers = false;
  includePunctuation = false;

  wpm = 0;
  accuracy = 0;
  showResults = false;
  typingLocked = false;

  @ViewChild(WordDisplayComponent) wordDisplay!: WordDisplayComponent;  // 👈 هنا

  startTest() {
    this.showResults = false;
  }

  onFinished(result: { wpm: number; accuracy: number }) {
    this.wpm = result.wpm;
    this.accuracy = result.accuracy;
    this.showResults = true;
    this.typingLocked = true; // 🔒 block typing
  }

  onOkPressed() {
    this.showResults = false;
    this.typingLocked = false; // 🔓 allow typing again
    this.resetTest();
  }

  resetTest() {
    this.showResults = false;
    this.typingLocked = false;
    if (this.wordDisplay) {
      this.wordDisplay.reset(); 
    }
  }
}
