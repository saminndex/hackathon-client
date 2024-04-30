import { Component, ChangeDetectorRef } from '@angular/core';
import { AIService } from './services/ai.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chapter } from './models/chapter';
import { AnimationOptions } from 'ngx-lottie';
import { MatDialog } from '@angular/material/dialog';
import { TwoOptionAlertComponent } from './components/loader/two-option-alert/two-option-alert.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Language } from './models/language';
import { Constants } from './app.constants';
import { LanguageSelectorComponent } from './components/loader/language-selector/language-selector.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title?: string;

  currentChapter = 0;
  previousChapters: any[] = [];

  nextOptionAChapter?: Chapter;
  nextOptionBChapter?: Chapter;

  options: AnimationOptions = { path: '/assets/waves.json', loop: true };

  image?: string;

  // image?: string =
  //   'https://plus.unsplash.com/premium_photo-1711508491462-5567bb2f1e33?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  private audioContext!: AudioContext;
  private audioBuffer?: AudioBuffer;

  loading = false;

  chapter?: Chapter;
  // chapter?: Chapter = {
  //   title: 'Title',
  //   content:
  //     'The wind whipped your hair as you stood at the precipice of the ancient stone bridge. Below, a raging torrent churned, threatening to pull you into its depths with each crashing wave. Your heart hammered against your ribs, keeping time with the rhythm of the treacherous current. Before you, a weathered signpost stood sentinel, its weathered wood splintering at the edges. Two arrows pointed in opposite directions, each carved with an inscription worn smooth by time and countless hands.',
  //   optionA:
  //     'Follow the arrow that points towards the towering mountain shrouded in mist, its peak hidden from view.',
  //   optionB:
  //     'Turn and follow the arrow that leads into the whispering woods, shadows dancing among the ancient trees.',
  // };

  isPlaying = false;
  selectedLanguage: Language = this.constants.languages[0];
  hasPlayedAudio = false;

  constructor(
    private aiService: AIService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    public constants: Constants
  ) {}

  ngOnInit(): void {
    const storedLanguage = window.localStorage.getItem('language');

    this.selectedLanguage =
      this.constants.languages.find((l) => l.name === storedLanguage) ||
      this.selectedLanguage;

    this.checkLaunchDialog();
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

  generate(option: string = ''): void {
    this.loading = true;
    this.aiService
      .generateChapter(
        this.previousChapters,
        option,
        this.selectedLanguage.name
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.chapter = res.data;
            this.title = this.chapter?.title || this.title;
            this.image = this.chapter?.image || this.image;
            this.chapter!.audio = new Uint8Array(res.data.audio.data).buffer;

            this.refresh();
          }
        },
        error: (res: HttpErrorResponse) => {
          this.showError(res.error.message);
        },
      })
      .add(() => (this.loading = false));
  }

  generateNextOptionA() {
    this.aiService
      .generateChapter(
        this.previousChapters,
        this.chapter?.optionA!,
        this.selectedLanguage.name
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.nextOptionAChapter = res.data;

            this.nextOptionAChapter!.audio = new Uint8Array(
              res.data.audio.data
            ).buffer;
          }
        },
        error: (res: HttpErrorResponse) => {
          this.showError(res.error.message);
        },
      });
  }

  generateNextOptionB() {
    this.aiService
      .generateChapter(
        this.previousChapters,
        this.chapter?.optionB!,
        this.selectedLanguage.name
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.nextOptionBChapter = res.data;

            this.nextOptionBChapter!.audio = new Uint8Array(
              res.data.audio.data
            ).buffer;
          }
        },
        error: (res: HttpErrorResponse) => {
          this.showError(res.error.message);
        },
      });
  }

  selectOption(option: number) {
    if (!this.canSelectOption) {
      return;
    }

    if (option === 0) {
      this.chapter = this.nextOptionAChapter;
    } else {
      this.chapter = this.nextOptionBChapter;
    }

    this.nextOptionAChapter = undefined;
    this.nextOptionBChapter = undefined;

    this.refresh();
  }

  refresh() {
    this.currentChapter++;

    this.cdr.detectChanges();

    this.previousChapters.push({
      [`chapter${this.currentChapter}`]: this.chapter!.content,
    });

    this.setupAudio();

    this.generateNextOptionA();
    this.generateNextOptionB();
  }

  showError(message: string): void {
    this.snackBar.open(message, '', {
      duration: 5000,
    });
  }

  async setupAudio() {
    if (!this.chapter?.audio) {
      console.error('No audio data available');
      return;
    }

    this.audioContext = new AudioContext();
    await this.loadAudioBuffer(this.chapter.audio);
  }

  async loadAudioBuffer(audioData: any) {
    try {
      this.audioBuffer = await this.audioContext!.decodeAudioData(audioData);
    } catch (error) {
      console.error('Error decoding audio data:', error);
    }
  }

  togglePlayPause() {
    if (this.isPlaying) {
      return;
      // this.audioContext.suspend().then(() => {
      //   this.isPlaying = false;
      //   this.cdr.detectChanges();
      // });
    } else {
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
        width: '350px',
        disableClose: true,
        panelClass: 'custom-dialog',
      })
      .afterClosed()
      .subscribe((language: Language) => {
        this.selectedLanguage = language;
        window.localStorage.setItem('language', language.name);
      });
  }

  l18n(key: string): string {
    return this.constants.strings[key]?.[this.selectedLanguage.name];
  }
}
