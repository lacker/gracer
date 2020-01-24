export function pairs(list: number[]): number[][] {
  let answer: number[][] = [];
  for (let i = 1; i < list.length; i++) {
    answer.push([list[i - 1], list[i]]);
  }
  if (list.length > 1) {
    answer.push([list[list.length - 1], list[0]]);
  }
  return answer;
}
