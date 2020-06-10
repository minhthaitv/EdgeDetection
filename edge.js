// Nguồn tham khảo: bạn Âu Dương Tấn Sang, MSSV: 1712145

function prewitt(imgData) {

    //Some image information
    var row = imgData.height;
    var col = imgData.width;

    var rowStep = col * 4;
    var colStep = 4;

    var data = imgData.data;

    var newImgData = new ImageData(col, row);

    //Loop for each pixel
    for (var i = 1; i < row - 1; i += 1)
        for (var j = 1; j < col - 1; j += 1) {

            //Current position
            var center = i * rowStep + j * colStep;

            var prewitt_dx = data[center + rowStep + colStep]* -1 +
                             data[center + rowStep - colStep]*1 +
                             data[center + colStep]*-1 +
                             data[center - colStep]*1+
                             data[center - rowStep + colStep]*-1+
                             data[center - rowStep - colStep]*1
            
            var prewitt_dy = data[center + rowStep + colStep]*1 +
                             data[center + rowStep]*1+
                             data[center + rowStep - colStep]*1 + 
                             data[center - rowStep + colStep]*-1+
                             data[center - rowStep]*-1 + 
                             data[center - rowStep - colStep]*-1

            //Thresholding
            if (Math.sqrt(prewitt_dx*prewitt_dx+prewitt_dy*prewitt_dy) >= 100)
                newImgData.data[center] = newImgData.data[center + 1] = newImgData.data[center + 2] = 255;
            else
                newImgData.data[center] = newImgData.data[center + 1] = newImgData.data[center + 2] = 0;

            newImgData.data[center + 3] = 255;
        }

    return newImgData;
}


window.onload = function () {

    //Get all necessary HTML elements
    var canvas1 = document.getElementById("myCanvas1");
    var context1 = canvas1.getContext("2d");

    var canvas2 = document.getElementById("myCanvas2");
    var context2 = canvas2.getContext("2d");

    var video = document.getElementById("myVideo");
    canvas1.width = canvas2.width = video.videoWidth;
    canvas1.height = canvas2.height = video.videoHeight;
    video.play();
    //Extract video frames and detect edge while video is playing
    video.onplay = function () {
        var vid = this;
        canvas1.width = canvas2.width = vid.videoWidth;
        canvas1.height = canvas2.height = vid.videoHeight;
        (function loop() {
            if (!vid.paused && !vid.ended) {

                //Draw original current frame on context1
                context1.drawImage(vid, 0, 0);

                //Get image data from context1 and detect edge
                var frameData = context1.getImageData(0, 0, vid.videoWidth, vid.videoHeight);
                var frameEdge = prewitt(frameData);

                //Draw edge image data on context2
                context2.putImageData(frameEdge, 0, 0);

                //Loop these things every 1000/30 miliseconds (30 fps)
                setTimeout(loop, 1000 / 30);
            }
        })();
    };
};

