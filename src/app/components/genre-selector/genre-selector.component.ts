import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from 'src/app/app.constants';
import { Language } from 'src/app/models/language';

@Component({
  selector: 'genre-selector',
  templateUrl: './genre-selector.component.html',
  styleUrls: ['./genre-selector.component.css'],
})
export class GenreSelectorComponent implements OnInit {
  constructor(
    public constants: Constants,
    public matDialogRef: MatDialogRef<GenreSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {}

  buttonOne() {
    this.matDialogRef.close(0);
  }

  buttonTwo() {
    this.matDialogRef.close(1);
  }

  genreSelected(genre: string): void {
    this.matDialogRef.close(genre);
  }

  l18n(key: string): string {
    return this.constants.strings[key]?.[this.data?.language || 'English'];
  }
}
