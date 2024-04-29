import { Component, ChangeDetectorRef } from '@angular/core';
import { AIService } from './services/ai.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chapter } from './models/chapter';
import { AnimationOptions } from 'ngx-lottie';
import { MatDialog } from '@angular/material/dialog';
import { TwoOptionAlertComponent } from './components/loader/two-option-alert/two-option-alert.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title?: string;
  genre?: string;

  currentChapter = 0;
  previousChapters: any[] = [];

  nextOptionAChapter?: Chapter;
  nextOptionBChapter?: Chapter;

  options: AnimationOptions = { path: '/assets/waves.json', loop: true };

  image?: string;

  private audioContext?: AudioContext;
  private audioSource?: AudioBufferSourceNode;
  private gainNode?: GainNode;

  loading = false;

  chapter?: Chapter;

  isPlaying = false;

  constructor(
    private aiService: AIService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let hasLaunched =
      window.localStorage.getItem('launched') === 'true' || false;

    if (!hasLaunched) {
      const dialogRef = this.dialog.open(TwoOptionAlertComponent, {
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
      });

      dialogRef.afterClosed().subscribe((option: number) => {
        window.localStorage.setItem('launched', 'true');
      });
    }
  }

  generate(option: string = ''): void {
    if (this.audioContext) {
      this.audioContext.close();
    }

    this.loading = true;
    this.aiService
      .generateChapter(this.previousChapters, option)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.chapter = res.data;
            this.title = this.chapter?.title || this.title;
            this.image = this.chapter?.image || this.image;
            this.genre = this.chapter?.genre || this.genre;

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
      .generateChapter(this.previousChapters, this.chapter?.optionA!)
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
      })
      .add(() => (this.loading = false));
  }

  generateNextOptionB() {
    this.aiService
      .generateChapter(this.previousChapters, this.chapter?.optionB!)
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
      })
      .add(() => (this.loading = false));
  }

  selectOption(option: number) {
    this.playAudio();

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
      return;
    }
    this.audioContext = new AudioContext();
    await this.createAudioSource();
  }

  async createAudioSource() {
    if (this.audioContext && this.chapter?.audio) {
      const buffer = await this.audioContext.decodeAudioData(
        this.chapter?.audio.slice(0)
      );
      this.audioSource = this.audioContext.createBufferSource();
      this.audioSource.buffer = buffer;
      this.gainNode = this.audioContext.createGain();
      this.audioSource.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      this.audioSource.onended = () => {
        this.isPlaying = false;
        this.cdr.detectChanges();
      };
    }
  }

  togglePlayPause() {
    if (this.audioContext) {
      if (this.audioContext.state === 'suspended') {
        this.audioContext
          .resume()
          .then(() => {
            console.log('AudioContext resumed successfully');
            this.isPlaying = true;
            this.playCurrentSource(); // Ensure this is a method that plays the current source
          })
          .catch((error) => {
            console.error('Error resuming AudioContext:', error);
          });
      } else if (!this.isPlaying) {
        this.createAudioSource().then(() => {
          this.audioSource?.start(0);
          this.isPlaying = true;
        });
      } else {
        this.audioContext.suspend();
        this.isPlaying = false;
      }
    }
  }

  playCurrentSource() {
    if (this.audioSource) {
      this.audioSource.start(0);
    }
  }

  playAudio() {
    let audio = new Audio();
    audio.src = '../assets/pageturn.mp3';
    audio.load();
    audio.play();
  }
}
