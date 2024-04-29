import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { interval, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  @Input() loading = false;
  options: AnimationOptions = { path: '/assets/story-loader.json', loop: true };

  currentLabelIndex = 0;
  label$: Observable<string>;

  labels = [
    'Preparing your literary journey...',
    'Generating storyline...',
    'Warming up the narrator...',
    'Generating audio...',
    'Sprinkling some fairy dust...',
    'Tuning into the frequency of adventure...',
    'Brewing up some epic tales...',
    'Queuing the suspense...',
  ];

  constructor() {
    this.label$ = interval(3000).pipe(
      startWith(0),
      map(() => {
        const label = this.labels[this.currentLabelIndex];
        this.currentLabelIndex =
          (this.currentLabelIndex + 1) % this.labels.length;
        return label;
      })
    );
  }

  ngOnInit() {}
}
