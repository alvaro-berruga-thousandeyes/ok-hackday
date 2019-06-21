const utils = require('./utils');
const {Card, Suggestion} = require('dialogflow-fulfillment');

function findTestId(server, list) {
    const test = list.endpointTest.find(test => test.server === server);
    return test === undefined ? null : test.testId;
}

function ticksSinceEpoch(dateTime) {
    if(!dateTime) {
        return new Date().getTime();
    }

    const d = new Date(dateTime);
    const now = new Date();

    if(d.getUTCFullYear() > now.getUTCFullYear()) {
        d.setUTCFullYear(now.getUTCFullYear());
    }

    return d.getTime();
}

function toIsoString(ticks) {
    const d = new Date(ticks);
    return d.toISOString().split('.')[0];
}

const scheduledTests = function(agent) {
    return () => {
        const listEndpoint = 'endpoint-tests/http-server.json';

        return utils.createRequest(listEndpoint, 'GET', { })
            .then(res => {
                const server = agent.parameters.url;
                const testId = findTestId(server, res);

                if (testId === null) {
                    agent.add(`Unable to find scheduled tests for URL ${server}`);
                    return;
                }

                const toTicks = ticksSinceEpoch(agent.parameters.date_time);
                const fromTicks = ticksSinceEpoch(toTicks - 300000); // + 5 minutes

                const detailsEndpoint = 'endpoint-data/tests/web/http-server/' + testId + '.json';
                const qs = {
                    'from': toIsoString(fromTicks),
                    'to': toIsoString(toTicks)
                };

                return utils.createRequest(detailsEndpoint, 'GET', { qs })
                    .then(res => {
                        let cnt = res.endpointWeb.httpServer.length;
                        if (cnt == 0) {
                            agent.add(`No data available for ${server} in given time range`);
                        }
                        else {
                            let sum = res.endpointWeb.httpServer.reduce((acc, dp) => dp.totalTime ? acc + dp.totalTime : 0, 0);
                            let avg = Math.round(sum / cnt);

                            const results = `${cnt} agents are testing ${server} with an average response time of ${avg} milliseconds`;

                            if(server !== 'http.cat') {
                                agent.add(results);
                            } else {
                                const text = `Meow meow ${avg} miliseconds... Meow meow`;

                                agent.add(new Card({
                                    title: `Meow meow`,
                                    imageUrl: 'https://pbs.twimg.com/profile_images/1080545769034108928/CEzHCTpI_400x400.jpg',
                                }));

                                agent.add(text);
                            }
                        }
                    });
            });
    }
};

module.exports = scheduledTests;

// Uncomment for local testing
// scheduledTests({
//     add: console.log,
//     parameters: {
//         url: 'google.com',
//         date_time: '',
//     },
//     // parameters: {
//     //     url: 'http.cat',
//     //     date_time: '',
//     // }
// })();
