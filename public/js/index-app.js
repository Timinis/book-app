let maxBookLimit = 40;
let bookNumberArray = [];

for (let i = 0; i < maxBookLimit; i++) {
  bookNumberArray.push(i);
}
bookNumberArray.forEach(number => {
  let detail = document.getElementById(`detail-toggle-index${number}`);
  if (detail) {
    detail.style.display = 'none';
  }
});

const showHideDetail = number => {
  let x = document.getElementById(`detail-toggle-index${number}`);
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
};
