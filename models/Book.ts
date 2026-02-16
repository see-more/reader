import { BookChapter } from './BookChapter';

export { BookChapter };

export class Book {
  #bookChapters: BookChapter[] = [];
  #single = 0;
  #chapterCache: Map<number, string[]> = new Map(); // 章节内容缓存

  getBookChapters(): BookChapter[] {
    return this.#bookChapters;
  }

  getChapterCount(): number {
    return this.#bookChapters.length;
  }

  constructor(text: string) {
    // 只解析章节标题，延迟解析内容
    const content = text.trim();
    const pattern =
      /[第章回部节集卷] *[\d一二三四五六七八九十零〇百千两]+ *[第章回部节集卷]( |、)/g;
    const match = content.match(pattern);

    if (match === null) {
      // 无章节结构，创建单一章节
      this.#bookChapters.push(new BookChapter('', 0, 0, content.length));
    } else {
      // 预创建章节对象，不解析内容
      for (let index = 0; index < match.length; index++) {
        const element = match[index];
        if (!element) continue;
        const id = content.indexOf(element, this.#single);
        const startPos = this.#single;
        const endPos = id === -1 ? content.length : id;

        this.#bookChapters.push(new BookChapter('', index, startPos, endPos));
        this.#single = id;
      }
    }
  }

  // 延迟加载章节内容
  loadChapterContent(chapterIndex: number, fullText: string): string[] {
    if (this.#chapterCache.has(chapterIndex)) {
      return this.#chapterCache.get(chapterIndex)!;
    }

    const chapter = this.#bookChapters[chapterIndex];
    if (!chapter) return [];

    // 解析内容并缓存
    const content = fullText.slice(chapter.startPos, chapter.endPos);
    const lines = content.split('\n').slice(1); // 跳过标题

    this.#chapterCache.set(chapterIndex, lines);
    return lines;
  }

  // 预加载指定范围章节
  preloadChapters(fullText: string, start: number, end: number): void {
    for (let i = start; i <= end && i < this.#bookChapters.length; i++) {
      if (!this.#chapterCache.has(i)) {
        this.loadChapterContent(i, fullText);
      }
    }
  }

  // 清除缓存
  clearCache(): void {
    this.#chapterCache.clear();
  }
}
