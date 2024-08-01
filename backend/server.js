const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.PERSPECTIVE_API_KEY;
const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

app.post('/analyze', (req, res) => {
    const { text } = req.body;

    google.discoverAPI(DISCOVERY_URL).then(client => {
        const analyzeRequest = {
            comment: { text },
            requestedAttributes: { TOXICITY: {}, THREAT: {} },
        };

        client.comments.analyze(
            { key: API_KEY, resource: analyzeRequest },
            (err, response) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json(response.data);
            }
        );
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
