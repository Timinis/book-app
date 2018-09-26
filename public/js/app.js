const showHide = () => {
  let x = document.getElementById('form-toggle');
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
};

let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

numbers.forEach(number => {
  let detail = document.getElementById(`detail-toggle${number}`);
  detail.style.display = 'none';
});

const showHideDetail = number => {
  let x = document.getElementById(`detail-toggle${number}`);
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
};
