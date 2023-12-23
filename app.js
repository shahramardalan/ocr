const fileBrowser = document.querySelector("input");
const convertBtn = document.querySelector("button");
const image = document.querySelector("img");
const progress = document.querySelector(".progress");
const textArea = document.querySelector("textarea");

fileBrowser.onchange = () => {
  let file = fileBrowser.files[0];
  let imageUrl = window.URL.createObjectURL(
    new Blob([file], { type: "image/jpg" })
  );
  image.src = imageUrl;
};

convertBtn.onclick = () => {
  textArea.innerHTML = "";
  const conv = new Tesseract.TesseractWorker();
  conv
    .recognize(fileBrowser.files[0])
    .progress((res) => {
      console.log(res);
    })
    .then((data) => {
      console.log(data);
    });
};
