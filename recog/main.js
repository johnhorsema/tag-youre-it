var imageLoader = document.getElementById('filePhoto');
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        $('.uploader img').attr('src',event.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
}

var apiai = require('apiai');
var app = apiai("a0e3d49509684e11a150e8afff2022e8");
function sendRequest(e){
    e.preventDefault();
    var text_req = $("#d1").value();
    var request = app.textRequest()
    
}




var request = app.textRequest('Spring', {
    sessionId: '2'
});

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();
