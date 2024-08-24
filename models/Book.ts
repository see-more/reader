import { BookChapter } from './BookChapter';

export class Book {
  #bookChapters: BookChapter[] = [];
  #single = 0;

  getBookChapters(): BookChapter[] {
    return this.#bookChapters;
  }
  constructor(text: string) {
    const content = text.trim();
    const pattern =
      /[第章回部节集卷] *[\d一二三四五六七八九十零〇百千两]+ *[第章回部节集卷]( |、)/g;
    const match = content.match(pattern);
    if (match === null) {
      this.#bookChapters.push(new BookChapter(content));
    } else {
      for (let index = 1; index <= match.length; index++) {
        const element = match[index];
        const id = content.indexOf(element, this.#single);
        const page = content.slice(this.#single, id).trim();
        this.#bookChapters.push(new BookChapter(page));
        this.#single = id;
      }
    }
  }
}
