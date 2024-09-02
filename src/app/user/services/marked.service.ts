import { Injectable } from '@angular/core';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor() {}

  //Método que convierte el mensaje a markdown
  convert(markdown: string): any {
    return marked(markdown);
  }
}