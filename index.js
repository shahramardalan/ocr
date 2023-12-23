var webkam = {
  // (A) INITIALIZE
  worker: null, // tesseract worker
  hVid: null,
  hGo: null,
  hRes: null, // html elements
  init: () => {
    // (A1) GET HTML ELEMENTS
    (webkam.hVid = document.getElementById("vid")),
      (webkam.hGo = document.getElementById("go")),
      (webkam.hRes = document.getElementById("result"));

    // (A2) GET USER PERMISSION TO ACCESS CAMERA
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(async (stream) => {
        // (A2-1) CREATE ENGLISH WORKER
        webkam.worker = await Tesseract.createWorker();
        await webkam.worker.loadLanguage("eng");
        await webkam.worker.initialize("eng");

        // (A2-2) WEBCAM LIVE STREAM
        webkam.hVid.srcObject = stream;
        webkam.hGo.onclick = webkam.snap;
      })
      .catch((err) => console.error(err));
  },

  // (B) SNAP VIDEO FRAME TO TEXT
  snap: async () => {
    // (B1) CREATE NEW CANVAS
    let canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d"),
      vWidth = webkam.hVid.videoWidth,
      vHeight = webkam.hVid.videoHeight;

    // (B2) CAPTURE VIDEO FRAME TO CANVAS
    canvas.width = vWidth;
    canvas.height = vHeight;
    ctx.drawImage(webkam.hVid, 0, 0, vWidth, vHeight);

    // (B3) CANVAS TO IMAGE, IMAGE TO TEXT
    const res = await webkam.worker.recognize(canvas.toDataURL("image/png"));
    webkam.hRes.value = res.data.text;
  },
};
window.addEventListener("load", webkam.init);
