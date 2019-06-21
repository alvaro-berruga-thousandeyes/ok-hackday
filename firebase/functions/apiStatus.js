const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const pageToVisit = "https://status.stg.thousandeyes.com";

const successSoundUrl = 'https://c-4tvylwolbz97x24nhtlwlkphx2ejbyzljkux2ejvt.g00.gamepedia.com/g00/3_c-4glskh.nhtlwlkph.jvt_/c-4TVYLWOLBZ97x24oaawzx3ax2fx2fnhtlwlkph.jbyzljku.jvtx2fglskh_nhtlwlkph_lux2f1x2f10x2f803_-_Nla_Palt.vnnx3fclyzpvux3d3j60k6h9kklj4mi4495580ii9026h046_$/$/$/$/$?i10c.ua=1&i10c.dv=16';

const apiStatus = function(agent) {
    return () => {
        return requestPromise({
            method: 'GET',
            url: pageToVisit,
            resolveWithFullResponse: true
        }).then(response => {
            try {
                if(response.statusCode === 200) {
                    // Parse the document body
                    const $ = cheerio.load(response.body);

                    const allSystemsAreOperational = 'All systems are operational';

                    const bodyText = $('html > body').text();
                    console.log('Getting body text');

                    if (bodyText.toLowerCase().indexOf(allSystemsAreOperational.toLowerCase()) !== -1) {
                        agent.add(allSystemsAreOperational);
                    } else {
                        agent.add("Some of our services are not working correctly. We are working on fixing them!");
                    }
                } else {
                    agent.add("The status service is currently offline");
                }
            } catch (err) {
                agent.add("The status service is currently offline");
            }
        }).catch(error => {
            agent.add("There was an error getting the status. Try again later");
        });
    }
};

module.exports = apiStatus;

// Uncomment for local testing
// apiStatus({
//     add: console.log
// })();
