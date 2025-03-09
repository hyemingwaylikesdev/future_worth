// 숫자에 콤마 추가하는 함수
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 콤마 제거하는 함수
export const removeCommas = (str: string): string => {
  return str.replace(/,/g, '');
};

// 숫자를 한글 단위로 변환하는 함수
export const formatKoreanNumber = (num: number): string => {
  if (num === 0) return '0원';

  const units = ['', '만', '억', '조', '경'];
  let result = '';
  let unitIndex = 0;
  let tempNum = num;

  while (tempNum > 0) {
    const remainder = tempNum % 10000;
    if (remainder > 0) {
      result = `${remainder}${units[unitIndex]} ${result}`;
    }
    tempNum = Math.floor(tempNum / 10000);
    unitIndex++;
  }

  return result.trim() + '원';
};
