import { Component, Input } from '@angular/core';
import { Constants } from 'src/app/app.constants';
import { Language } from 'src/app/models/language';
import { GenreSelectorComponent } from '../genre-selector/genre-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'genre-button',
  templateUrl: './genre-button.component.html',
  styleUrls: ['./genre-button.component.css'],
})
export class GenreButtonComponent {
  @Input() language?: Language;
  @Input() genre: string = 'fantasy';
  @Input() loading = false;

  constructor(private constants: Constants, private dialog: MatDialog) {}

  ngOnInit() {}

  get selectedGenre(): string {
    return this.constants.strings[this.genre]?.[
      this.language?.name || 'English'
    ];
  }

  get selectedEmoji(): string {
    return (
      this.constants.genres.find((el) => el.name === this.genre)?.emoji || ''
    );
  }

  openGenreSelector(): void {
    if (this.loading) {
      return;
    }

    this.dialog
      .open(GenreSelectorComponent, {
        data: {
          selectedGenre: this.genre,
          language: this.language?.name,
        },
        scrollStrategy: new NoopScrollStrategy(),
        autoFocus: false,
        width: '450px',
        height: '400px',
        disableClose: true,
        panelClass: 'custom-dialog',
      })
      .afterClosed()
      .subscribe((genre?: string) => {
        if (genre) {
          this.genre = genre;
          window.localStorage.setItem('genre', genre);
        }
      });
  }
}
