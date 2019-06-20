const request = require('request');
const cheerio = require('cheerio');
const pageToVisit = "https://status.stg.thousandeyes.com";

const apiStatus = function(agent) {
    return () => {
        request(pageToVisit, function(error, response, body) {
            if(error) {
                console.log("Error: " + error);
            }

            console.log("Status code: " + response.statusCode);
            if(response.statusCode === 200) {
                // Parse the document body
                const $ = cheerio.load(body);

                const allSystemsAreOperational ='All systems are operational';

                const bodyText = $('html > body').text();

                if(bodyText.toLowerCase().indexOf(allSystemsAreOperational.toLowerCase()) !== -1) {
                    agent.add(allSystemsAreOperational);
                }
                else {
                    agent.add("Issue is detected");
                }
            }
        });
    }
};

module.exports = apiStatus;
