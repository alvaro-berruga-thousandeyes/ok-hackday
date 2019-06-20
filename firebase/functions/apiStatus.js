const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const pageToVisit = "https://status.stg.thousandeyes.com";

const apiStatus = function(agent) {
    return () => {
        return requestPromise({
            method: 'GET',
            url: pageToVisit,
            resolveWithFullResponse: true
        }).then(response => {
            if(response.statusCode === 200) {
                // Parse the document body
                const $ = cheerio.load(response.body);

                const allSystemsAreOperational = 'All systems are operational';

                const bodyText = $('html > body').text();

                if (bodyText.toLowerCase().indexOf(allSystemsAreOperational.toLowerCase()) !== -1) {
                    agent.add(allSystemsAreOperational);
                } else {
                    agent.add("Issue is detected");
                }
            }
        });
    }
};

module.exports = apiStatus;
