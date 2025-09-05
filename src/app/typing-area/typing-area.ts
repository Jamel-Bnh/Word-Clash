import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typing-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing-area.html',
  styleUrls: ['./typing-area.scss']
})
export class TypingAreaComponent {
  @Output() finished = new EventEmitter<{ wpm: number; accuracy: number }>();

  inputText = '';
  startTime: number | null = null;
  typedChars = 0;
  errors = 0;

  onInput(event: any) {
    if (!this.startTime) {
      this.startTime = Date.now();
    }

    this.inputText = event.target.value;
    this.typedChars++;

    // 🔥 Example: stop after 20 chars → emit results
    if (this.typedChars >= 20) {
      const timeMinutes = (Date.now() - (this.startTime || 0)) / 60000;
      const wpm = Math.round(this.typedChars / 5 / timeMinutes);
      const accuracy = Math.max(0, Math.round(((this.typedChars - this.errors) / this.typedChars) * 100));

      this.finished.emit({ wpm, accuracy });
    }
  }
}
