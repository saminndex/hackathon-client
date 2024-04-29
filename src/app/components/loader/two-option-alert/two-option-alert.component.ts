import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-two-option-alert',
  templateUrl: './two-option-alert.component.html',
  styleUrls: ['./two-option-alert.component.css'],
})
export class TwoOptionAlertComponent implements OnInit {
  constructor(
    public matDialogRef: MatDialogRef<TwoOptionAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {}

  buttonOne() {
    this.matDialogRef.close(0);
  }

  buttonTwo() {
    this.matDialogRef.close(1);
  }
}
