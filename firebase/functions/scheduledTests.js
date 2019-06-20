const utils = require('./utils');

function findTestId(server, httpTestList) {
    return '9900916';
}

module.exports = function scheduledTests(agent) {
    return () => {
        const listEndpoint = 'endpoint-tests/http-server.json';

        const server = 'http.cat'; // TODO parameters

        return utils.createRequest(listEndpoint)
            .then(res => {
                const testId = findTestId(server, res);
                const detailsEndpoint = 'endpoint-data/tests/web/http-server/' + testId + '.json';
                const qs = { window: '5m' }; // TODO parameters

                return utils.createRequest(detailsEndpoint, 'GET', { qs })
                    .then(res => {
                        let sum = res.endpointWeb.httpServer.reduce((acc, dp) => acc + dp.totalTime, 0);
                        let cnt = res.endpointWeb.httpServer.length;
                        let avg = sum / cnt;

                        agent.add(`${cnt} agents are testing ${server} with an average response time of ${avg} milliseconds`);
                    });
            });
    }
};
