const utils = require('./utils');

module.exports = function experienceScore(agent, request){
    return () => {
        const qs = { window: '6m' };
        const endpoint = 'endpoint-data/user-sessions.json';

        return utils.createRequest(endpoint,'GET', { qs })
            .then(res => {
                if (!res.userSessions) {
                    agent.add('There are no experience scores reported in the last few minutes');
                    return;
                }

                const visitedSite = request.queryResult.parameters.url;
                if (!visitedSite) {
                    throw new Error('No visited site requested');
                }

                const experienceScoresForDomain = res.userSessions
                    .filter(s => s.visitedSite === visitedSite)
                    .filter(s => s.experienceScore !== undefined || s.experienceScore !== null)
                    .map(s => s.experienceScore);

                if (experienceScoresForDomain.length === 0) {
                    agent.add(`There are no experience scores reported in the last few minutes for ${visitedSite}`);
                    return;
                }

                const lowestExperienceScore = Math.min(...experienceScoresForDomain);

                agent.add(`The lowest experience score seen by the agents in the last few minutes for ${visitedSite} is ${Math.round(lowestExperienceScore * 100)}%`)
            });
    }
};
