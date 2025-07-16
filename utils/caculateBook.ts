import { Book } from '../models/Book';
import { Cursor } from '../models/Cursor';
import { SkFont, SkPoint, vec } from '@shopify/react-native-skia';

export interface bookPoints {
  allchacpterPoints: Points[];
}
export interface Point {
  id: number;
  pos: SkPoint;
}
type Points = Point[];
/**
 * 计算书籍的排版点
 * @param book 书籍对象，包含章节内容
 * @param font 字体对象
 * @param maxChar 每行最大字符数
 * @param maxLines 每页最大行数
 * @param fontSize 字体大小
 * @param top 顶部偏移量
 * @returns 书籍的排版点数组
 */
export const caculateBook = (
  book: Book,
  font: SkFont | null,
  maxChar: number,
  maxLines: number,
  fontSize: number,
  top: number,
): bookPoints[] => {
  if (font === null) {
    return [];
  }
  const bookPoints: bookPoints[] = [];
  const cursor = new Cursor();
  for (let chacpter = 0; chacpter < book.getBookChapters().length; chacpter++) {
    const currentChacpterPoints: Points[] = [];
    let currentPoints: Points = [];
    const currentChacpter = book.getBookChapters()[chacpter];
    const title = currentChacpter.getChapterName();
    font?.getGlyphIDs(title).forEach((id: any) => {
      currentPoints.push({
        id,
        pos: vec(
          cursor.getColumn() * fontSize,
          top + cursor.getLine() * fontSize,
        ),
      });
      cursor.nextChar();
    });
    cursor.nextParagraph();
    cursor.nextParagraph();
    const currentContent = currentChacpter.getChapterContent();
    for (let paragraph = 0; paragraph < currentContent.length; paragraph++) {
      const currentParagraph = currentContent[paragraph].trim();
      font
        ?.getGlyphIDs(currentParagraph)
        .forEach((id: number, index: number) => {
          if (id === 0) {
            return;
          }
          if (cursor.getColumn() < maxChar - 1) {
            if (cursor.getLine() < maxLines) {
              currentPoints.push({
                id,
                pos: vec(
                  cursor.getColumn() * fontSize,
                  top + cursor.getLine() * fontSize,
                ),
              });
              cursor.nextChar();
            } else {
              currentChacpterPoints.push(currentPoints);
              currentPoints = [];
              cursor.nextPage();
              currentPoints.push({
                id,
                pos: vec(
                  cursor.getColumn() * fontSize,
                  top + cursor.getLine() * fontSize,
                ),
              });
              cursor.nextChar();
            }
          } else {
            if (cursor.getLine() < maxLines) {
              currentPoints.push({
                id,
                pos: vec(
                  cursor.getColumn() * fontSize,
                  top + cursor.getLine() * fontSize,
                ),
              });
              cursor.nextLine();
            } else {
              currentChacpterPoints.push(currentPoints);
              currentPoints = [];
              cursor.nextPage();
              currentPoints.push({
                id,
                pos: vec(
                  cursor.getColumn() * fontSize,
                  top + cursor.getLine() * fontSize,
                ),
              });
              cursor.nextChar();
            }
          }
          if (index === currentParagraph.length - 1) {
            if (cursor.getLine() < maxLines) {
              cursor.nextParagraph();
            } else {
              cursor.nextChacpter();
              currentChacpterPoints.push(currentPoints);
              currentPoints = [];
            }
          }
        });
    }
    currentChacpterPoints.push(currentPoints);
    bookPoints.push({
      allchacpterPoints: currentChacpterPoints,
    });
    cursor.nextChacpter();
  }
  return bookPoints;
};
