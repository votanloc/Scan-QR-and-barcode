let videoElement = document.getElementById("video");
let barcodeValue = document.getElementById("barcodeValue");
let isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

function startCamera() {
    let constraints = {
        video: {
            facingMode: isMobile ? "environment" : "user" // Mobile dùng camera sau, laptop dùng camera trước
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
            readers: [
                "code_128_reader", "code_39_reader", "ean_reader", "ean_8_reader", 
                "upc_reader", "upc_e_reader", "code_93_reader"
            ]
        }
    }, function (err) {
        if (err) {
            console.error("Lỗi QuaggaJS: ", err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function (result) {
        let code = result.codeResult.code;
        barcodeValue.value = code;
        flashHighlight(barcodeValue);
        showBarcode(code);
    });
}

// Hiển thị Barcode dạng hình ảnh
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

// Hiệu ứng nhấp nháy xanh khi quét được
function flashHighlight(element) {
    element.classList.add("highlight");
    setTimeout(() => element.classList.remove("highlight"), 1000);
}
