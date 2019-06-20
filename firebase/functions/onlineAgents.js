const utils = require('./utils');

module.exports = function onlineAgents(agent){
    return () => {
        const qs = { window: '6m' };
        const endpoint = 'endpoint-data/network-topology.json';

        return utils.createRequest(endpoint,'GET', { qs })
            .then(res => {
                agent.add(`The number of agents connected is ${res.networkProbes.length}`)
            });
    }
};
