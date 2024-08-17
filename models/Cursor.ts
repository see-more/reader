export class Cursor {
  private line;
  private column;
  constructor() {
    this.line = 0;
    this.column = 2;
  }
  getLine() {
    return this.line;
  }
  getColumn() {
    return this.column;
  }
  nextChar() {
    this.column = this.column + 1;
  }
  nextLine() {
    this.column = 0;
    this.line = this.line + 1;
  }
  nextParagraph() {
    this.column = 2;
    this.line = this.line + 1;
  }
  nextPage() {
    this.line = 0;
    this.column = 0;
  }
  nextChacpter() {
    this.line = 0;
    this.column = 2;
  }
}
