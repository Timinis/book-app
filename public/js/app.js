let maxResultLimit = 10;
let bookNumberArray = [];

for (let i = 0; i < maxResultLimit; i++) {
  bookNumberArray.push(i);
}
const showHide = number => {
  let x = document.getElementById(`form-toggle${number}`);
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
};

bookNumberArray.forEach(number => {
  let detail = document.getElementById(`detail-toggle${number}`);
  if (detail) {
    detail.style.display = 'none';
  }
  let form = document.getElementById(`form-toggle${number}`);
  if (form) {
    form.style.display = 'none';
  }
});

const showHideDetail = number => {
  let x = document.getElementById(`detail-toggle${number}`);
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
};

const hideSubmittedBooks = number => {
  let x = document.getElementById(`display-block-${number}`);
  console.log(x);
  x.style.display = 'none';
};
