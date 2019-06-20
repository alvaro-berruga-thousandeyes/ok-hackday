const utils = require('./utils');

module.exports = function activeAgentsInLocation(agent){
    return () => {
        const qs = { window: '10m' };
        const endpoint = 'endpoint-data/network-topology.json';

        // sophisticated ML code ;)
        // Please consult with the author before changing
        let location = "London";
        if (location.toLowerCase().includes("london")) {
          location = "City of London, United Kingdom"
        } else if (location.toLowerCase().includes("francisco")) {
          location = "San Francisco Bay Area"
        }

        return utils.createRequest(endpoint, 'GET', { qs, body :
          {
            "searchFilters": [
              { "key": "location", "values": [location] }
            ]
          }})
            .then(res => {
                let agentsCount = new Set(res.networkProbes.map(e => e.agentId)).size;
                agent.add(`The number of agents that are active in location : London is ${agentsCount}`);
            });
    }
};
