import { Component, ChangeDetectorRef } from '@angular/core';
import { AIService } from './services/ai.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chapter } from './models/chapter';
import { AnimationOptions } from 'ngx-lottie';
import { MatDialog } from '@angular/material/dialog';
import { TwoOptionAlertComponent } from './components/two-option-alert/two-option-alert.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Language } from './models/language';
import { Constants } from './app.constants';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('out => in', animate('600ms ease-in')),
      transition('in => out', animate('600ms ease-out')),
    ]),
  ],
})
export class AppComponent {
  [key: string]: any;

  title?: string;
  currentChapter = 0;
  previousChapters: any[] = [];
  nextOptionAChapter?: Chapter;
  nextOptionBChapter?: Chapter;
  options: AnimationOptions = { path: '/assets/waves.json', loop: true };
  image?: string;
  audioContext!: AudioContext;
  audioBuffer?: AudioBuffer;
  loading = false;
  chapter?: Chapter;
  isPlaying = false;
  selectedLanguage: Language = this.constants.languages[1];
  hasPlayedAudio = false;

  constructor(
    private aiService: AIService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    public constants: Constants
  ) {}

  ngOnInit(): void {
    this.initLanguage();
    this.checkLaunchDialog();
  }

  initLanguage(): void {
    const storedLanguage = window.localStorage.getItem('language');

    this.selectedLanguage =
      this.constants.languages.find((l) => l.name === storedLanguage) ||
      this.selectedLanguage;
  }

  checkLaunchDialog() {
    const hasLaunched = window.localStorage.getItem('launched') === 'true';
    if (!hasLaunched) {
      this.dialog
        .open(TwoOptionAlertComponent, {
          data: {
            title: 'Welcome',
            body: `
            The Infinite Story is a project built by <a target="_blank" href="https://www.linkedin.com/in/addadahine">Sam Addadahine</a> as part of <a target="_blank" href="https://googleai.devpost.com/">Google\'s AI Hackathon 2024</a>
            <br><br>
            Made possible thanks to the incredible Text Prompt and TTS APIs by <a target="_blank" href="https://cloud.google.com/vertex-ai">Google Vertex AI</a> & <a target="_blank" href="https://openai.com/">OpenAI</a>, respectively.
            `,
            buttonOne: 'Close',
          },
          scrollStrategy: new NoopScrollStrategy(),
          autoFocus: false,
          width: '350px',
          disableClose: true,
          panelClass: 'custom-dialog',
        })
        .afterClosed()
        .subscribe(() => {
          window.localStorage.setItem('launched', 'true');
        });
    }
  }

  generate(option: string = '') {
    this.loading = true;

    this.aiService
      .generateChapter(
        this.previousChapters,
        option,
        this.selectedLanguage.name
      )
      .subscribe({
        next: async (res: any) => {
          if (res) {
            this.chapter = res.data;
            this.title = this.chapter?.title || this.title;
            this.image = this.chapter?.image || this.image;
            this.chapter!.audio = new Uint8Array(res.data.audio.data).buffer;

            await this.refresh();
          }
        },
        error: (res: HttpErrorResponse) => {
          this.showError(res.error.message);
        },
      })
      .add(() => (this.loading = false));
  }

  selectOption(option: number) {
    if (!this.canSelectOption) {
      return;
    }

    if (this.previousChapters.length >= 20) {
      this.showError(
        'This is free demo product, the maximum number of chapters created, please refresh your browser for a new story'
      );
      return;
    }

    if (option === 0) {
      this.chapter = this.nextOptionAChapter;
    } else {
      this.chapter = this.nextOptionBChapter;
    }

    this.nextOptionAChapter = undefined;
    this.nextOptionBChapter = undefined;

    this.playAudio();

    this.refresh(true);
  }

  async refresh(autoPlay: boolean = false) {
    this.currentChapter++;
    this.cdr.detectChanges();
    this.previousChapters.push({
      [`chapter${this.currentChapter}`]: this.chapter!.content,
    });

    const setupComplete = await this.setupAudio();
    if (setupComplete && autoPlay) {
      this.hasPlayedAudio = false;
      this.togglePlayPause();
    }

    this.generateOption(this.chapter?.optionA, 'A');
    this.generateOption(this.chapter?.optionB, 'B');
  }

  generateOption(option: string | undefined, optionLabel: 'A' | 'B') {
    if (!option) return;

    this.aiService
      .generateChapter(
        this.previousChapters,
        option,
        this.selectedLanguage.name
      )
      .subscribe({
        next: (res: any) => {
          const targetChapter = `nextOption${optionLabel}Chapter`;
          this[targetChapter] = res.data;
          this[targetChapter]!.audio = new Uint8Array(
            res.data.audio.data
          ).buffer;
        },
        error: (res: HttpErrorResponse) => this.showError(res.error.message),
      });
  }

  showError(message: string): void {
    this.snackBar.open(message, '', {
      duration: 5000,
    });
  }

  async setupAudio(): Promise<boolean> {
    if (!this.chapter?.audio) {
      console.error('No audio data available');
      return false;
    }

    this.audioContext = new AudioContext();
    await this.loadAudioBuffer(this.chapter.audio);

    return true;
  }

  async loadAudioBuffer(audioData: any) {
    try {
      this.audioBuffer = await this.audioContext!.decodeAudioData(audioData);
    } catch (error) {
      console.error('Error decoding audio data:', error);
    }
  }

  togglePlayPause() {
    if (!this.isPlaying) {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      this.playCurrentSource();
    }
  }

  playCurrentSource() {
    if (!this.audioBuffer) {
      console.error('Audio buffer not available');
      return;
    }
    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.audioContext.destination);
    source.onended = () => {
      this.hasPlayedAudio = true;
      this.isPlaying = false;
      this.cdr.detectChanges();
    };
    source.start();
    this.isPlaying = true;
  }

  playAudio() {
    let audio = new Audio();
    audio.src = '../assets/pageturn.mp3';
    audio.load();
    audio.play();
  }

  get canSelectOption(): boolean {
    return (
      this.nextOptionAChapter !== undefined &&
      this.nextOptionBChapter !== undefined &&
      !this.isPlaying &&
      !this.loading &&
      this.hasPlayedAudio
    );
  }

  openLanguageSelector(): void {
    this.dialog
      .open(LanguageSelectorComponent, {
        data: {
          selectedLanguage: this.selectedLanguage.name,
        },
        scrollStrategy: new NoopScrollStrategy(),
        autoFocus: false,
        width: '450px',
        height: '400px',
        disableClose: true,
        panelClass: 'custom-dialog',
      })
      .afterClosed()
      .subscribe((language?: Language) => {
        if (language) {
          this.selectedLanguage = language;
          window.localStorage.setItem('language', language.name);
        }
      });
  }

  l18n(key: string): string {
    return this.constants.strings[key]?.[this.selectedLanguage.name];
  }

  reload(): void {
    window.location.reload();
  }
}
