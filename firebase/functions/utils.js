const functions = require('firebase-functions');
const requestPromise = require('request-promise');

module.exports = {
    createRequest
};

function getToken() {
    return functions.config()['endpoint-home-demo'].basicauth;
}

function createRequest(endpoint, httpMethod = 'GET', { qs = {}, body = {}}){
    const token = getToken();

    const options = {
        url: `https://api.stg.thousandeyes.com/v6/${endpoint}`,
        method: httpMethod,
        headers: {
            'Authorization': `Basic ${token}`
        },

        qs: { ...qs },
        json: true
    };

    if (httpMethod === 'POST' && Object.entries(body).length > 0) {
        options.body = { ...body };
    }

    return requestPromise(options);
}
