document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("qr-canvas");
    const ctx = canvas.getContext("2d");
    const temType = document.getElementById("temType");
    const temContent = document.getElementById("temContent");
    const startBtn = document.getElementById("startBtn");

    let scanning = false;
    let stream = null;

    function detectDevice() {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            console.log("Đang sử dụng điện thoại");
        } else {
            console.log("Đang sử dụng máy tính");
        }
    }

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            video.srcObject = stream;
            scanning = true;
            requestAnimationFrame(scanFrame);
        } catch (err) {
            alert("Không thể truy cập camera!");
            console.error(err);
        }
    }

    function scanFrame() {
        if (!scanning) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

        if (code) {
            temType.value = "QR Code";
            temContent.value = code.data;
            console.log("QR Code:", code.data);
        }

        requestAnimationFrame(scanFrame);
    }

    function startBarcodeScanner() {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: video
            },
            decoder: { readers: ["ean_reader", "code_128_reader"] }
        }, function (err) {
            if (err) {
                console.error(err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected(function (result) {
            temType.value = "Barcode";
            temContent.value = result.codeResult.code;
            console.log("Barcode:", result.codeResult.code);
        });
    }

    startBtn.addEventListener("click", function () {
        detectDevice();
        startCamera();
        startBarcodeScanner();
    });
});
