import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { LoaderComponent } from './components/loader/loader.component';
import { TwoOptionAlertComponent } from './components/two-option-alert/two-option-alert.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';

import { ApiService } from './services/api.service';
import { LottieModule } from 'ngx-lottie';
import { GenreButtonComponent } from './components/genre-button/genre-button.component';
import { GenreSelectorComponent } from './components/genre-selector/genre-selector.component';

export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    TwoOptionAlertComponent,
    LanguageSelectorComponent,
    GenreButtonComponent,
    GenreSelectorComponent,
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    LottieModule.forRoot({ player: playerFactory }),
    MatIconModule,
  ],
  providers: [
    ApiService,
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
