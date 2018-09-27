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
    x.style.position= 'fixed';
    
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

// const showHideDetail = number => {
  // let x = document.getElementById(`detail-toggle${number}`);
  // let y = document.getElementById(`.main`);
  // if (x.style.display === 'block') {
  //   x.style.display = 'none';
  // } else {
  //   x.style.display = 'block';
  //   x.style.position= 'fixed';
  //   x.style.backgroundColor = '#D8C3A5';
  //   x.style.minheight = "25vh";
  //   x.style.minwidth = "32vw";
  //   x.style.borderWidth = "5px";
  //   x.style.borderStyle = "solid";
  //   x.style.borderColor ="#E98074";
    // y.style.background= rgba(100,100,100,0.6);
  //}
  
// };

$(document).ready(function(){

  $(".show").click(function() {
      $(this).parents("book-card").removeClass("hide_description");
  });
  $(".hide").click(function() {
      $(this).parents(".book-card").addClass("hide_description");
  });

});



const hideSubmittedBooks = number => {
  let x = document.getElementById(`display-block-${number}`);
  console.log(x);
  x.style.display = 'none';
};
