const express = require("express")
const Api = require('./src/api/urls.api');

const app = express()

const PORT = process.env.PORT || 8080

app.use(express.json())

app.use('/api/v1', Api);

app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
});