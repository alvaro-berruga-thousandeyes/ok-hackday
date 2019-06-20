const utils = require('./utils');

function findTestId(server, list) {
    const test = list.endpointTest.find(test => test.server === server);
    return test === undefined ? null : test.testId;
}

function ticksSinceEpoch(dateTime) {
    const d = new Date(dateTime);
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

                var toTicks = ticksSinceEpoch(agent.parameters.time);
                toTicks -= 86400000; // - 24 hours.. Hack because request times are one day ahead for some reason.
                const fromTicks = ticksSinceEpoch(toTicks - 300000); // + 5 minutes

                const detailsEndpoint = 'endpoint-data/tests/web/http-server/' + testId + '.json';
                const qs = {
                    'from': toIsoString(fromTicks),
                    'to': toIsoString(toTicks)
                };

                console.log(qs);

                return utils.createRequest(detailsEndpoint, 'GET', { qs })
                    .then(res => {
                        let cnt = res.endpointWeb.httpServer.length;
                        if (cnt == 0) {
                            agent.add(`No data available for ${server} in given time range`);
                        }
                        else {
                            let sum = res.endpointWeb.httpServer.reduce((acc, dp) => dp.totalTime ? acc + dp.totalTime : 0, 0);
                            let avg = sum / cnt;

                            agent.add(`${cnt} agents are testing ${server} with an average response time of ${avg} milliseconds`);
                        }
                    });
            });
    }
}

module.exports = scheduledTests;
