import React from 'react';

const pitagoMap = {
  'A': 1, 'J': 1, 'S': 1,
  'B': 2, 'K': 2, 'T': 2,
  'C': 3, 'L': 3, 'U': 3,
  'D': 4, 'M': 4, 'V': 4,
  'E': 5, 'N': 5, 'W': 5,
  'F': 6, 'O': 6, 'X': 6,
  'G': 7, 'P': 7, 'Y': 7,
  'H': 8, 'Q': 8, 'Z': 8,
  'I': 9, 'R': 9
};

function reduceToSingleDigit(number) {
  while (number > 9) {
    number = number.toString().split('').reduce((sum, digit) => sum + Number(digit), 0);
  }
  return number;
} // Hàm rút gọn số về 1 chữ số, không có trường hợp đặc biệt (22 , 11)

// Hàm rút gọn số, có trường hợp đặc biệt 11 và 22
function reduceWithMasterNumbers(number) {
  while (number > 9 && number !== 11 && number !== 22) {
    number = number.toString().split('').reduce((sum, digit) => sum + Number(digit), 0);
  }
  return number;
}

// 1. Tính số chủ đạo (Life Path Number) - Có trường hợp đặc biệt 11 và 22
export function calculateLifePathNumber(dateOfBirth) {
  const [day, month, year] = dateOfBirth.split('/').map(Number);
  
  const reducedDay = reduceToSingleDigit(day);  // Không cần Master Numbers ở bước này
  const reducedMonth = reduceToSingleDigit(month);
  const reducedYear = reduceToSingleDigit(year);
  
  const total = reducedDay + reducedMonth + reducedYear;
  return reduceWithMasterNumbers(total);  // Áp dụng Master Numbers ở bước cuối
}

// 2. Tính chỉ số định mệnh (Destiny Number)Có trường hợp đặc biệt 11 và 22
export function calculateDestinyNumber(fullName) {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const total = letters.reduce((sum, letter) => sum + (pitagoMap[letter] || 0), 0);
  return reduceWithMasterNumbers(total);
}
 
// 3. Tính chỉ số linh hồn (Soul Urge Number) 11,22
export function calculateSoulUrgeNumber(fullName) {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  // Lọc các nguyên âm và tính tổng
  const total = letters
    .filter(letter => vowels.includes(letter))
    .reduce((sum, letter) => sum + (pitagoMap[letter] || 0), 0);
  
  return reduceWithMasterNumbers(total);
}

// 4. Tính chỉ số nhân cách (Personality Number)
export function calculatePersonalityNumber(fullName) {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const total = letters
    .filter(letter => !vowels.includes(letter))
    .reduce((sum, letter) => sum + (pitagoMap[letter] || 0), 0);

  return reduceWithMasterNumbers(total);
}

// 5. Tính chỉ số năng lực tự nhiên (Natural Ability Number)
export function calculateNaturalAbilityNumber(dayOfBirth) {
  const day = Number(dayOfBirth.split('/')[0]);
  return reduceWithMasterNumbers(day);
}

// 6. Tính con số trưởng thành (Maturity Number)
export function calculateMaturityNumber(lifePathNumber, destinyNumber) {
  const total = lifePathNumber + destinyNumber;
  return reduceWithMasterNumbers(total);
}

// 7. Tính số thái độ (Attitude Number) - Không có trường hợp đặc biệt
export function calculateAttitudeNumber(dateOfBirth) {
  const [day, month] = dateOfBirth.split('/').map(Number);
  const reducedDay = reduceToSingleDigit(day);
  const reducedMonth = reduceToSingleDigit(month);
  return reduceToSingleDigit(reducedDay + reducedMonth);
}

export function calculateChallengeNumbers(dateOfBirth) {
  const [day, month, year] = dateOfBirth.split('/').map(Number);
  
  const reducedDay = reduceToSingleDigit(day);
  const reducedMonth = reduceToSingleDigit(month);
  const reducedYear = reduceToSingleDigit(year);
  
  const challenge1 = reduceToSingleDigit(Math.abs(reducedMonth - reducedDay));
  const challenge2 = reduceToSingleDigit(Math.abs(reducedDay - reducedYear));
  const challenge3 = reduceToSingleDigit(Math.abs(challenge1 - challenge2));
  const challenge4 = reduceToSingleDigit(Math.abs(reducedMonth - reducedYear));
  
  return {
    challenge1,
    challenge2,
    challenge3,
    challenge4
  };
}

// React component để sử dụng các hàm tính toán
const ResultCalculate = ({ dateOfBirth, fullName }) => {
  if (!dateOfBirth || !fullName) {
    return <div>Vui lòng nhập đầy đủ thông tin ngày sinh và họ tên</div>;
  }

  const lifePathNumber = calculateLifePathNumber(dateOfBirth);
  const destinyNumber = calculateDestinyNumber(fullName);
  const soulUrgeNumber = calculateSoulUrgeNumber(fullName);
  const personalityNumber = calculatePersonalityNumber(fullName);
  const naturalAbilityNumber = calculateNaturalAbilityNumber(dateOfBirth);
  const maturityNumber = calculateMaturityNumber(lifePathNumber, destinyNumber);
  const attitudeNumber = calculateAttitudeNumber(dateOfBirth);
  const challengeNumbers = calculateChallengeNumbers(dateOfBirth);

  return (
    <div className="numerology-results">
      <h2>Kết quả tính toán thần số học</h2>
      <div className="result-item">
        <strong>Số chủ đạo (Life Path Number):</strong> {lifePathNumber}
      </div>
      <div className="result-item">
        <strong>Chỉ số định mệnh (Destiny Number):</strong> {destinyNumber}
      </div>
      <div className="result-item">
        <strong>Chỉ số linh hồn (Soul Urge Number):</strong> {soulUrgeNumber}
      </div>
      <div className="result-item">
        <strong>Chỉ số nhân cách (Personality Number):</strong> {personalityNumber}
      </div>
      <div className="result-item">
        <strong>Chỉ số năng lực tự nhiên (Natural Ability Number):</strong> {naturalAbilityNumber}
      </div>
      <div className="result-item">
        <strong>Con số trưởng thành (Maturity Number):</strong> {maturityNumber}
      </div>
      <div className="result-item">
        <strong>Số thái độ (Attitude Number):</strong> {attitudeNumber}
      </div>
      <div className="challenge-numbers">
        <h3>Các số thách thức (Challenge Numbers):</h3>
        <div>Thách thức 1: {challengeNumbers.challenge1}</div>
        <div>Thách thức 2: {challengeNumbers.challenge2}</div>
        <div>Thách thức 3: {challengeNumbers.challenge3}</div>
        <div>Thách thức 4: {challengeNumbers.challenge4}</div>
      </div>
    </div>
  );
};

export default ResultCalculate;