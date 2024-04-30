import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from 'src/app/app.constants';
import { Language } from 'src/app/models/language';

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
})
export class LanguageSelectorComponent implements OnInit {
  constructor(
    public constants: Constants,
    public matDialogRef: MatDialogRef<LanguageSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {}

  buttonOne() {
    this.matDialogRef.close(0);
  }

  buttonTwo() {
    this.matDialogRef.close(1);
  }

  languageSelected(language: Language): void {
    this.matDialogRef.close(language);
  }
}
