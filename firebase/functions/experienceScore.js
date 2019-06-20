const utils = require('./utils');

const allowedRequestValues = ['lowest', 'highest']

module.exports = function experienceScore(agent, request){
    function getExperienceScore(experienceScoresForDomain, requestedValue) {
        if (requestedValue === 'lowest') {
            return Math.min(...experienceScoresForDomain);
        } else {
            return Math.max(...experienceScoresForDomain);
        }
    }

    return () => {
        const qs = { window: '6m' };
        const endpoint = 'endpoint-data/user-sessions.json';

        return utils.createRequest(endpoint,'GET', { qs })
            .then(res => {
                if (!res.userSessions) {
                    agent.add('There are no experience scores reported in the last few minutes');
                    return;
                }

                const visitedSite = request.body.queryResult.parameters.url;
                const requestedValue = request.body.queryResult.parameters.RequestedValue;

                if (!allowedRequestValues.includes(requestedValue)) {
                    agent.add('Sorry, I didn\'t understand your question, could you try again?');
                    return;
                }

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

                const requestedES = getExperienceScore(experienceScoresForDomain);

                agent.add(`The ${requestedValue} experience score seen by the agents in the last few minutes for ${visitedSite} is ${Math.round(requestedES * 100)}%`)
            });
    }
};
