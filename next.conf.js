require('dotenv').config();

module.exports = {
    env: {
        REACT_APP_API_KEY: process.env.REACT_APP_API_KEY,
        REACT_APP_AUTH_DOMAIN: process.env.REACT_APP_AUTH_DOMAIN,
        REACT_APP_PROJECT_ID: process.env.REACT_APP_PROJECT_ID,
        REACT_APP_STORAGE_BUCKET: process.env.REACT_APP_STORAGE_BUCKET,
        REACT_APP_MESSAGING_SENDER_ID: process.env.REACT_APP_MESSAGING_SENDER_ID,
        REACT_APP_APP_ID: process.env.REACT_APP_APP_ID,
        REACT_APP_MEASUREMENT_ID: process.env.REACT_APP_MEASUREMENT_ID,
        REACT_APP_MSG_SPLIT_THINGY: process.env.REACT_APP_MSG_SPLIT_THINGY,
        REACT_APP_OMDB_API_KEY: process.env.REACT_APP_OMDB_API_KEY,
    },
};