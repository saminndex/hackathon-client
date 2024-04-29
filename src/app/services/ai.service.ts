import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AIService {
  constructor(private api: ApiService) {}

  PATH = 'ai';

  generateChapter(previousChapters: string[], previousOption: string) {
    return this.api.post(`${this.PATH}/generate`, {
      previousChapters,
      previousOption,
    });
  }
}
