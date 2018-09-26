const showHide = () => {
    console.log('anymessage');
    let x = document.getElementById("form-toggle");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

const showHideDetail = () => {
    let x = document.getElementById("detail-toggle");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}