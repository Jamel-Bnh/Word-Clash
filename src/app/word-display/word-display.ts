import {
  Component,
  Input,
  OnInit,
  HostListener,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-display.html',
  styleUrls: ['./word-display.scss'],
})
export class WordDisplayComponent implements OnInit, OnChanges {
  @Input() mode: 'time' | 'words' = 'time';
  @Input() durationOrCount: number = 15;
  @Input() includeNumbers = false;
  @Input() includePunctuation = false;
  @Input() typingLocked = false;

  @Output() finished = new EventEmitter<{ wpm: number; accuracy: number }>();

  words: string[] = [];
  typedChars: string[][] = [];
  currentWord = 0;
  currentChar = 0;

  started = false;
  typingStarted = false;
  timeLeft = 0;
  timer: any;
  private timerStart: number | null = null;

  totalTyped = 0;
  errors = 0;

  ngOnInit() {
    this.generateWords();
    if (this.mode === 'time') {
      this.timeLeft = this.durationOrCount; // don’t start timer yet
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['durationOrCount'] ||
      changes['mode'] ||
      changes['includeNumbers'] ||
      changes['includePunctuation']
    ) {
      this.generateWords();

      if (this.mode === 'time') {
        this.timeLeft = this.durationOrCount;
        this.clearTimer();
        this.typingStarted = false;
        this.started = false;
        this.timerStart = null;
      }
    }
  }

  generateWords() {
    const baseWords = [
      'package', 'dog', 'hello', 'world', 'type', 'fast', 'apple', 'banana', 'jump', 'tree', 'india', 'tunisia', 'english', 'sopranos', 'school',
      'underground', 'better', 'soul', 'monkey', 'what', 'webcam', 'zebra', 'spoon', 'eat', 'work', 'developer', 'hoverboard', 'volleyball', 'driver',
      'penguin', 'watermelon', 'fearful', 'house', 'drugs', 'lawyer', 'frisbee', 'sugar', 'umberlla', 'colleague', 'weightlifting', 'golf', 'hurricane',
      'guava', 'discovery', 'dishwasher', 'sing', 'surfing', 'pencilcase', 'lover', 'nyc', 'often', 'thursday', 'russian', 'painting', 'slaves', 'relax',
      'surf', 'onboard', 'song', 'toys', 'frenchmontana', 'nectarine', 'hedgehog', 'peach', 'journalist', 'airport', 'yoga', 'huging', 'eminem',
      'resentful', 'microwave', 'leopard', 'sixteen', 'earthquake', 'grandson', 'chicken', 'wings', 'assassin', 'rocky', 'specter', 'cream', 'edrien',
      'gallet', 'worldcup', 'year', 'mastering', 'footballer', 'lime', 'pc', 'gamer', 'pakistan', 'mouse', 'water', 'free', 'tate', 'music', 'missing',
      'error', 'headphones', 'language', 'scrool', 'bar', 'claud', 'sparta', 'rome', 'launchpad', 'false', 'angular', 'twohundredthounseend', 'miracleous',
      'wordrobe', 'calsh', 'palmer', 'authentification', 'linclen', 'sassy', 'henessy', 'disck', 'rayzen', 'pilot', 'cricket', 'volcano', 'ironman',
      'basic', 'washington', 'chat', 'live', 'quokka', 'prettier', 'filter', 'gymnastics', 'dew', 'liberation', 'whisper', 'hermanos', 'crowd', 'clown',
      'circumstances', 'important', 'spoon', 'crab', 'bully', 'artist', 'rumor', 'bus', 'answer', 'host', 'honey', 'hotel', 'salad', 'milk', 'apartment',
      'eleven', 'engineer', 'lake', 'powerbank', 'theater', 'wearhouse', 'hallowen', 'usb'
    ];
    const numbers = ['1', '22', '345', '67', '48', '8', '15', '852', '956', '1999', '2004'];
    const punct = ['.', ',', '?', '!', '@', ')', '(', '=', '+', '*', '/'];

    this.words = [];
    const count = this.mode === 'time' ? 200 : this.durationOrCount;

    for (let i = 0; i < count; i++) {
      let pool = [...baseWords];
      if (i > 0) pool = pool.filter((w) => w !== this.words[i - 1]);

      let word = pool[Math.floor(Math.random() * pool.length)];

      if (this.includeNumbers && Math.random() < 0.2) {
        word += numbers[Math.floor(Math.random() * numbers.length)];
      }
      if (this.includePunctuation && Math.random() < 0.2) {
        word += punct[Math.floor(Math.random() * punct.length)];
      }

      this.words.push(word);
    }

    this.typedChars = this.words.map((w) => new Array(w.length).fill(''));
  }


  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  startTimer() {
    if (this.timer) return;
    this.timerStart = Date.now();

    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endTest();
      }
    }, 1000);
  }

  @HostListener('document:keydown', ['$event'])
handleTyping(event: KeyboardEvent) {
  if (this.typingLocked) return;

  event.preventDefault(); // 👈 يمنع المتصفح من يحط الكارسر

  if (!this.started) this.started = true;

  if (!this.typingStarted) {
    this.typingStarted = true;
    this.startTimer();
  }

  const word = this.words[this.currentWord];
  if (!word) return;

  if (
    (event.key.length === 1 || /[0-9!@#$%^&*(),.?":{}|<>]/.test(event.key)) &&
    this.currentChar < word.length
  ) {
    this.typedChars[this.currentWord][this.currentChar] = event.key;
    if (event.key !== word[this.currentChar]) this.errors++;
    this.currentChar++;
    this.totalTyped++;
  }

  if (event.key === ' ') {
    this.currentWord++;
    this.currentChar = 0;
  }

  if (this.mode === 'words' && this.currentWord >= this.durationOrCount) {
    this.endTest();
  }

  if (event.key === 'Backspace') {
  if (this.currentChar > 0) {
    this.currentChar--;
    this.typedChars[this.currentWord][this.currentChar] = '';
    this.totalTyped = Math.max(0, this.totalTyped - 1);
  } else if (this.currentWord > 0) {
    // نرجع للكلمة السابقة
    this.currentWord--;
    this.currentChar = this.words[this.currentWord].length;
  }
  return;
}

}

  // 👇 Pause when tab loses focus
  @HostListener('window:blur')
  onBlur() {
    this.clearTimer();
  }


  endTest() {
    this.clearTimer();
    this.started = false;

    const timeMinutes =
      this.mode === 'time'
        ? this.durationOrCount / 60
        : (Date.now() - (this.timerStart || Date.now())) / 60000;

    const wpm = Math.round(this.totalTyped / 5 / timeMinutes);
    const accuracy =
      this.totalTyped > 0
        ? Math.max(0, Math.round(((this.totalTyped - this.errors) / this.totalTyped) * 100))
        : 0;

    this.finished.emit({ wpm, accuracy });

    this.timerStart = null;
  }

  reset() {
    this.clearTimer();
    this.generateWords();

    this.currentWord = 0;
    this.currentChar = 0;
    this.totalTyped = 0;
    this.errors = 0;

    this.started = false;
    this.typingStarted = false;

    this.timeLeft = this.mode === 'time' ? this.durationOrCount : 0;
    this.timerStart = null;          // 👈 reset the start timestamp
  }

}
