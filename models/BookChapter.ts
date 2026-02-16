export class BookChapter {
  #content: string;
  #index: number;
  #startPos: number;
  #endPos: number;

  constructor(content: string, index: number, startPos: number = 0, endPos: number = 0) {
    this.#content = content;
    this.#index = index;
    this.#startPos = startPos;
    this.#endPos = endPos;
  }

  get index(): number { return this.#index; }
  get startPos(): number { return this.#startPos; }
  get endPos(): number { return this.#endPos; }

  getChapterName = (): string => {
    const lines = this.#content.split('\n');
    const firstLine = lines[0];
    if (!firstLine || firstLine.trim() === '') {
      return `第${this.#index + 1}章`;
    }
    return firstLine;
  };

  getChapterContent = (): string[] => {
    return this.#content.split('\n').slice(1);
  };
}
