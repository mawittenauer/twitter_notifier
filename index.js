const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

app.post('/hook', (req, res) => {
    console.log(req);
    console.log(req.body);
    res.status(200).end();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
