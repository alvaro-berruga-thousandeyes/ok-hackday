var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var pageToVisit = "https://status.stg.thousandeyes.com";


module.exports = function(agent) {
    return () => {
      request(pageToVisit, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
           // Check status code (200 is HTTP OK)
           console.log("Status code: " + response.statusCode);
           if(response.statusCode === 200) {
             // Parse the document body
             var $ = cheerio.load(body);
            
             var word ='All systems are operationals'
             var bodyText = $('html > body').text();
             if(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
            
             agent.add("All systems are operational");
             }
             else
             {
                 agent.add("Issue is detected");    
             }
             
           }
        });     
    }
} 

