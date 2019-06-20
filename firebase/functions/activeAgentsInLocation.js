const utils = require('./utils');

const activeAgentsInLocation = function(agent){
    return () => {
        const qs = { window: '10m' };
        const endpoint = 'endpoint-data/network-topology.json';

        return utils.createRequest(endpoint, 'GET', { qs, body :
                {
                    "searchFilters": [
                        { "key": "location", "values": ["London"] }
                    ]
                }})
            .then(res => {
                const alreadyHandled = {};
                const agentsCount = res.networkProbes.reduce((acc, elem) => {
                    if(alreadyHandled[elem.agentId]) {
                        return acc;
                    }

                    alreadyHandled[elem.agentId] = true;
                    return acc + 1;
                },0);

                agent.add(`The number of agents that are active in location : London is ${agentsCount}`);
            });
    }
};

module.exports = activeAgentsInLocation; 
