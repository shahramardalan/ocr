var webcam = {
  // (A) INITIALIZE
  worker: null, // tesseract worker
  hVid: null,
  hGo: null,
  hRes: null, // html elements
  init: () => {
    // (A1) GET HTML ELEMENTS
    (webcam.hVid = document.getElementById("vid")),
      (webcam.hGo = document.getElementById("go")),
      (webcam.hRes = document.getElementById("result"));

    // (A2) GET USER PERMISSION TO ACCESS CAMERA
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(async (stream) => {
        // (A2-1) CREATE ENGLISH WORKER
        webcam.worker = await Tesseract.createWorker();
        await webcam.worker.loadLanguage("fas");
        await webcam.worker.initialize("fas");

        // (A2-2) WEBCAM LIVE STREAM
        webcam.hVid.srcObject = stream;
        webcam.hGo.onclick = webcam.snap;
      })
      .catch((err) => console.error(err));
  },

  // (B) SNAP VIDEO FRAME TO TEXT
  snap: async () => {
    // (B1) CREATE NEW CANVAS
    let canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d"),
      vWidth = webcam.hVid.videoWidth,
      vHeight = webcam.hVid.videoHeight;

    // (B2) CAPTURE VIDEO FRAME TO CANVAS
    canvas.width = vWidth;
    canvas.height = vHeight;
    ctx.drawImage(webcam.hVid, 0, 0, vWidth, vHeight);

    // (B3) CANVAS TO IMAGE, IMAGE TO TEXT
    const res = await webcam.worker.recognize(canvas.toDataURL("image/png"));
    webcam.hRes.value = res.data.text;
  },
};
window.addEventListener("load", webcam.init);
