import { Book } from '../models/Book';
import { Cursor } from '../models/Cursor';
import { SkPoint, vec } from '@shopify/react-native-skia';

export interface bookPoints {
  allchacpterPoints: Array<Points>;
}
export interface Point {
  id: number;
  pos: SkPoint;
}
type Points = Point[];

export const caculateBook = (
  book: Book,
  getGlyphIDs: (str: string, numCodePoints?: number) => number[],
  maxChar: number,
  maxLines: number,
  fontSize: number,
  top: number
): Array<bookPoints> => {
  let bookPoints: Array<bookPoints> = [];
  const cursor = new Cursor();
  for (let chacpter = 0; chacpter < book.getBookChapters().length; chacpter++) {
    let currentChacpterPoints: Points[] = [];
    let currentPoints: Points = [];
    const currentChacpter = book.getBookChapters()[chacpter];
    const title = currentChacpter.getChapterName();
    getGlyphIDs(title).forEach((id, index) => {
      currentPoints.push({
        id,
        pos: vec(
          cursor.getColumn() * fontSize,
          top + cursor.getLine() * fontSize
        ),
      });
      cursor.nextChar();
    });
    cursor.nextParagraph();
    cursor.nextParagraph();
    const currentContent = currentChacpter.getChapterContent();
    for (let paragraph = 0; paragraph < currentContent.length; paragraph++) {
      const currentParagraph = currentContent[paragraph].trim();
      getGlyphIDs(currentParagraph).forEach((id, index) => {
        if (cursor.getColumn() < maxChar - 1) {
          if (cursor.getLine() < maxLines) {
            currentPoints.push({
              id,
              pos: vec(
                cursor.getColumn() * fontSize,
                top + cursor.getLine() * fontSize
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
                top + cursor.getLine() * fontSize
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
                top + cursor.getLine() * fontSize
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
                top + cursor.getLine() * fontSize
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
