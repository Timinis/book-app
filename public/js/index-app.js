let maxBookLimit = 9;
let bookNumberArray = [];
let secondArray = [];

for (let i = 0; i < maxBookLimit; i++) {
  bookNumberArray.push(i);
  secondArray = [];
}

const showHideDetail = (number, number2) => {
  let x = document.getElementById(`detail-toggle-index${number}${number2}`);
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
};
