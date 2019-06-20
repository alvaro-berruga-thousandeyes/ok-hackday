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


        /**
  [      {
          "networkProbes": [
              {
                  "networkProbeId": "07893:16502142325895738497:1561035300:dfe71494",
                  "agentId": "dfe71494-bce0-450c-8b44-22e5f56d4782",
                  "coordinates": {
                      "latitude": 51.5154317,
                      "longitude": -0.1037872,
                      "location": "City of London, United Kingdom"
                  }
              }
          ]
      },
      {
        "networkProbes": [
            {
                "networkProbeId": "07893:16502142325895738497:1561035300:dfe7149",
                "agentId": "dfe71494-bce0-450c-8b44-22e5f56d478",
                "coordinates": {
                    "latitude": 51.5154317,
                    "longitude": -0.1037872,
                    "location": "City of London, United Kingdom"
                }
            }
        ]
    }
  ]
         */
        const endpointDetails = 'endpoint-data/network-topology/';

        return utils.createRequest(endpoint, 'GET', { qs })
            .then(res => {
                return Promise.all(res.networkProbes.map(probe => utils.createRequest(endpointDetails + probe.networkProbeId, 'GET', {})));
            })
            .then(res => {
              let agentsCount = new Set(res.map(e => e.networkProbes[0]).filter(e => e.coordinates.location.includes('London')).map(e => e.agentId));
              agent.add(`The number of agents that are active in location : London is ${agentsCount}`);
            });
    }
};
