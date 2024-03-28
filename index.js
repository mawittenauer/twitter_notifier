const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

app.post('/hook', (req, res) => {
    console.log(req.body);
    const { type } = req.body;

    if (type === 'like') {
        const { username } = req.body;
        console.log(`%c You liked a tweet posted by @${username}`);
    }

    if (type === 'follower') {
        const { username } = req.body;
        console.log(`You got a new follower! @${username}`);
    }

    res.status(200).end();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
