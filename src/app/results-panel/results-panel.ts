import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-panel.html',
  styleUrls: ['./results-panel.scss'],
})
export class ResultsPanel {
  @Input() wpm: number = 0;
  @Input() accuracy: number = 0;
  @Input() visible: boolean = false;
  @Output() okPressed = new EventEmitter<void>();

  onOk() {
    this.okPressed.emit();
  }
}
