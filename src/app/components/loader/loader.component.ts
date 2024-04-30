import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { interval, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Constants } from 'src/app/app.constants';
import { Language } from 'src/app/models/language';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  @Input() language?: Language;
  options: AnimationOptions = { path: '/assets/story-loader.json', loop: true };

  currentLabelIndex = 0;
  label$: Observable<string>;

  selectedLanguage: Language = this.constants.languages[1];

  constructor(private constants: Constants) {
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

  get labels(): string[] {
    return [
      this.l18n('preparingYourLiteraryJourney'),
      this.l18n('generatingStoryline'),
      this.l18n('warmingUpTheNarrator'),
      this.l18n('generatingAudio'),
      this.l18n('sprinklingSomeFairyDust'),
      this.l18n('tuningIntoTheFrequencyOfAdventure'),
      this.l18n('brewingUpSomeEpicTales'),
      this.l18n('queuingTheSuspense'),
    ];
  }

  l18n(key: string): string {
    return this.constants.strings[key]?.[this.language?.name || 'English'];
  }
}
