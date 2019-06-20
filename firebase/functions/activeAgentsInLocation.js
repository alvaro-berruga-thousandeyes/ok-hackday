const utils = require('./utils');

module.exports = function activeAgentsInLocation(agent){
    return () => {
        const qs = { window: '10m' };

        /*
        {
            "from": "2019-06-20 13:12:06",
            "to": "2019-06-20 13:17:06",
            "pages": {
                "current": 1
            },
            "networkProbes": [
                {
                    "networkProbeId": "07893:11878536218964422064:1561036500:90134d49",
                    "agentId": "90134d49-16d4-42dd-bc45-440d1c07dddd",
                    "date": "2019-06-20 13:16:32",
                    "roundId": 1561036500,
                    "icmpBlocked": false
                }
            ]
        }
        */
        const endpoint = 'endpoint-data/network-topology.json';

        return utils.createRequest(endpoint, 'GET', { qs, body :
          {
            "searchFilters": [
              { "key": "location", "values": ["London"] }
            ]
          }})
            .then(res => {
                const alreadyHandled = {};
                const agentsCount = new Set(res.networkProbes.reduce((acc, elem) => {
                    if(alreadyHandled[elem.agentId]) {
                        return acc;
                    }

                    alreadyHandled[elem.agentId] = true;
                    return acc + 1;
                },0));

                agent.add(`The number of agents that are active in location : London is ${agentsCount}`);
            });
    }
};
