/**
 * Worklet 版本的分页计算
 * 使用 react-native-worklets 将计算移到后台线程，避免阻塞 UI
 */

import type { SkPoint } from '@shopify/react-native-skia';
// @ts-ignore - react-native-worklets-core 可能在某些环境未安装
import { makeMutable } from 'react-native-worklets-core';

export interface PageGlyph {
  id: number;
  pos: SkPoint;
}

/**
 * Worklet: 计算单章分页
 * 在后台线程运行，不会阻塞 UI
 */
export const calculateChapterWorklet = (
  chapterText: string,
  maxChar: number,
  maxLines: number,
  fontSize: number,
  top: number,
): PageGlyph[][] => {
  'worklet';

  const pages: PageGlyph[][] = [];
  let currentPage: PageGlyph[] = [];
  let line = 0;
  let column = 0;

  // 分割段落
  const paragraphs = chapterText.split('\n');

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    // 处理每个字符
    for (let i = 0; i < trimmedParagraph.length; i++) {
      const char = trimmedParagraph[i];
      if (!char) continue; // 添加 undefined 检查

      const charCode = char.charCodeAt(0);

      // 跳过特殊字符
      if (charCode === 0) continue;

      // 添加字形
      currentPage.push({
        id: charCode,
        pos: { x: column * fontSize, y: top + line * fontSize },
      });

      // 更新光标
      if (column < maxChar - 1) {
        column++;
      } else {
        column = 0;
        line++;
      }

      // 换页
      if (line >= maxLines) {
        pages.push(currentPage);
        currentPage = [];
        line = 0;
        column = 0;
      }
    }

    // 段落结束换行
    if (line > 0 && line < maxLines) {
      line++;
      column = 0;
    }

    // 页面已满
    if (line >= maxLines) {
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
      }
      line = 0;
      column = 0;
    }
  }

  // 最后一页
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

/**
 * Worklet: 合并多个章节的分页结果
 */
export const mergeChaptersWorklet = (
  chapters: PageGlyph[][],
): PageGlyph[] => {
  'worklet';

  return chapters.flat();
};

/**
 * 创建可变状态用于 worklet
 */
export const createMutableWorkletState = <T>(initial: T) => {
  return makeMutable(initial);
};
