const utils = require('./utils');

const activeAgentsInLocation = function(agent) {
    return () => {
        const qs = { window: '10m' };
        const endpoint = 'endpoint-data/network-topology.json';

        // sophisticated ML code ;)
        // Please consult with the author before changing
        let location = agent.parameters['geo-city'];
        if (location.toLowerCase().includes("london")) {
            location = "City of London, United Kingdom"
        } else if (location.toLowerCase().includes("francisco")) {
            location = "San Francisco Bay Area"
        }

        return utils.createRequest(endpoint, 'POST', { qs, body :
                {
                    "searchFilters": [
                        { "key": "location", "values": [location] }
                    ]
                }})
            .then(res => {
                let agentsCount = new Set(res.networkProbes.map(e => e.agentId)).size;
                agent.add(`The number of agents that are active in ${location} is ${agentsCount}`);
            });
    }
};

module.exports = activeAgentsInLocation;

//Uncomment for testing
// activeAgentsInLocation({
//     add: console.log,
//     parameters: {
//         'geo-city': 'london'
//     }
// })();
