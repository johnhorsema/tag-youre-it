var apiai = require('apiai');

var app = apiai("<your client access token>");

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


