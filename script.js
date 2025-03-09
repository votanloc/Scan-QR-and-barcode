// document.addEventListener("DOMContentLoaded", function () {
//     const video = document.getElementById("camera");
//     const canvas = document.getElementById("qr-canvas");
//     const ctx = canvas.getContext("2d");
//     const temType = document.getElementById("temType");
//     const temContent = document.getElementById("temContent");
//     const startBtn = document.getElementById("startBtn");

//     let scanning = false;
//     let stream = null;

//     function detectDevice() {
//         if (/Mobi|Android/i.test(navigator.userAgent)) {
//             console.log("Đang sử dụng điện thoại");
//         } else {
//             console.log("Đang sử dụng máy tính");
//         }
//     }

//     async function startCamera() {
//         try {
//             stream = await navigator.mediaDevices.getUserMedia({
//                 video: { facingMode: "environment" }
//             });
//             video.srcObject = stream;
//             scanning = true;
//             requestAnimationFrame(scanFrame);
//         } catch (err) {
//             alert("Không thể truy cập camera!");
//             console.error(err);
//         }
//     }

//     function scanFrame() {
//         if (!scanning) return;
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//         let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         let code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

//         if (code) {
//             temType.value = "QR Code";
//             temContent.value = code.data;
//             console.log("QR Code:", code.data);
//         }

//         requestAnimationFrame(scanFrame);
//     }

//     function startBarcodeScanner() {
//         Quagga.init({
//             inputStream: {
//                 name: "Live",
//                 type: "LiveStream",
//                 target: video
//             },
//             decoder: { readers: ["ean_reader", "code_128_reader"] }
//         }, function (err) {
//             if (err) {
//                 console.error(err);
//                 return;
//             }
//             Quagga.start();
//         });

//         Quagga.onDetected(function (result) {
//             temType.value = "Barcode";
//             temContent.value = result.codeResult.code;
//             console.log("Barcode:", result.codeResult.code);
//         });
//     }

//     startBtn.addEventListener("click", function () {
//         detectDevice();
//         startCamera();
//         startBarcodeScanner();
//     });
//     function showBarcode(text) {
//         JsBarcode("#barcode", text, {
//             format: "CODE128", // Hoặc "CODE39"
//             displayValue: true,
//             lineColor: "#000",
//             width: 2,
//             height: 50,
//             fontSize: 18
//         });
//     }
    
//     // Hàm nhấp nháy màu xanh
//     function flashHighlight(element) {
//         element.classList.add("highlight");
//         setTimeout(() => element.classList.remove("highlight"), 500);
//     }
    
//     // Khi quét được QR hoặc Barcode
//     function onScanSuccess(type, content) {
//         temType.value = type;
//         temContent.value = content;
//         showBarcode(content);  // Hiển thị mã vạch
//         flashHighlight(temContent); // Nhấp nháy màu xanh
//     }
    
//     // Khi phát hiện mã QR
//     if (code) {
//         onScanSuccess("QR Code", code.data);
//     }
    
//     // Khi phát hiện mã vạch
//     Quagga.onDetected(function (result) {
//         onScanSuccess("Barcode", result.codeResult.code);
//     });
    
// });


let videoElement = document.getElementById("video");
let temType = document.getElementById("temType");
let temContent = document.getElementById("temContent");
let isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

function startCamera() {
    let constraints = {
        video: {
            facingMode: isMobile ? "environment" : "user" // Chọn camera sau trên mobile, camera trước trên laptop
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            videoElement.srcObject = stream;
            videoElement.play();
        })
        .catch(function (error) {
            console.error("Lỗi mở camera: ", error);
        });

    startScanner();
}

function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoElement,
            constraints: {
                facingMode: isMobile ? "environment" : "user"
            }
        },
        decoder: {
            readers: ["code_128_reader", "code_39_reader", "ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader", "code_93_reader"]
        }
    }, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function (result) {
        let code = result.codeResult.code;
        temType.value = "Barcode";
        temContent.value = code;
        showBarcode(code);
        flashHighlight(temContent);
    });
}

// Hiển thị mã vạch
function showBarcode(text) {
    JsBarcode("#barcode", text, {
        format: "CODE128",
        displayValue: true,
        lineColor: "#000",
        width: 2,
        height: 50,
        fontSize: 18
    });
}

// Hiệu ứng nhấp nháy xanh
function flashHighlight(element) {
    element.classList.add("highlight");
    setTimeout(() => element.classList.remove("highlight"), 500);
}
