export class BookChapter {
  #content: string;

  constructor(content: string) {
    this.#content = content;
  }
  getChapterName = (): string => {
    const title = this.#content.split('\n', 1);
    if (title === null) {
      return '标题';
    }
    return title[0];
  };
  getChapterContent = (): string[] => {
    return this.#content.split('\n').slice(1);
  };
}
