var express = require('express');
var path = require('path');
var app = express();
app.listen(8080, function () {
    console.log('listening on 8080');
});
app.use(express.static(path.join(__dirname, 'react_project/build')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/react-project/build/index.html'));
});
