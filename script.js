document.addEventListener("DOMContentLoaded", () => {
    const labelType = document.getElementById("labelType");
    const labelContent = document.getElementById("labelContent");

    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.addListener('scan', function (content) {
        // Giả sử loại tem và nội dung được phân tách bằng dấu ":", ví dụ: "Loại: Nội Dung"
        const [type, data] = content.split(":");
        labelType.value = type || "Không xác định";
        labelContent.value = data || content;
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            alert('Không tìm thấy camera!');
        }
    }).catch(function (e) {
        console.error(e);
    });
});
