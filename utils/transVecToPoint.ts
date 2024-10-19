export const transVecToPoint = (
  vec: number[],
  fontSize: number,
  top: number,
) => {
  const points: number[][] = [];
  for (let i = 0; i < vec.length; i += 2) {
    points.push([vec[i] * fontSize, (vec[i + 1] + top) * fontSize]);
  }
  return points;
};
