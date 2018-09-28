
/*
 * 
 * * Details Toggle View
 *  Book Array
 * 
 */

let maxResultLimit = 10;
let bookNumberArray = [];

for (let i = 0; i < maxResultLimit; i++) {
  bookNumberArray.push(i);
}

/*
 *
 * * Detailes Toggle View
 * Hide/Show Functionaility
 * 
 */

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

const showHideForm = number => {
  let x = document.getElementById(`form-toggle${number}`);
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';    
  }
};


const showHideDetail = number => {
  // let x = document.getElementById(`detail-toggle${number}`);
  // if (x.style.display === 'block') {
  //   x.style.display = 'none';
  // } else {
  //   x.style.display = 'block';
    // x.style.position= 'fixed';
    // x.style.backgroundColor = '#D8C3A5';
    // x.style.minheight = "25vh";
    // x.style.minwidth = "32vw";
    // x.style.borderWidth = "5px";
    // x.style.borderStyle = "solid";
    // x.style.borderColor ="#E98074";
    // y.style.background= rgba(100,100,100,0.6);
  }
  


const hideSubmittedBooks = number => {
  let x = document.getElementById(`display-block-${number}`);
  x.style.display = 'none';
};

