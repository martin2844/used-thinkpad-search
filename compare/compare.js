const _ = require('lodash');
const fs = require('fs');
const axios = require('axios');
const mail = require('./mailer');


let compare = (term) => {

    //declaer empty array where we will push every thinkpad.
    let arrayToStore = [];
    //declare page variable, that will be the amount of pages based on the primary results
    let pages;
    //this is the Initial get request to calculate amount of iterations depending on result quantities.
    axios.get('https://api.mercadolibre.com/sites/MLA/search?q='+ term +'&condition=used&category=MLA1652&offset=' + 0)
    .then(function (response) {
     //begin calculation of pages
     let amount = response.data.paging.primary_results;
     //since we only care about the primary results, this is fine. Since there are 50 items per page, we divide
     //amount by 50, and round it up, since the last page can contain less than 50 items
     pages = Math.ceil(amount / 50);
     
     //here we begin the for loop.
     for(i = 0; i < pages; i++) {
        // So for each page we will do an axios request in order to get results
        //Since each page is 50 as offset, then i should be multiplied by 50.
        axios.get('https://api.mercadolibre.com/sites/MLA/search?q='+ term +'&condition=used&category=MLA1652&offset=' + i * 50)
        .then((response) => {
            const cleanUp = response.data.results.map((result) => {
                let image = result.thumbnail.replace("I.jpg", "O.jpg");
                 return importante = {
                    id: result.id,
                     title: result.title,
                     price: result.price,
                     link: result.permalink,
                     image: image,
                     state: result.address.state_name,
                     city: result.address.city_name
                }
            });
            arrayToStore.push(cleanUp);
            console.log(pages, i)
            if (i === pages) {
                let path = ('./compare/yesterday-' + term +'.json');
             
                    
                    if (fs.existsSync(path)) {
                        console.log("Loop Finished. Reading data from Yesterday")
                        fs.readFile('./compare/yesterday-' + term +'.json', (err, data) => {
                            if (err) throw err;
                            let rawDataFromYesterday = JSON.parse(data);
                            // test
                            //first convert both items to check to JSON strings in order to check them.
                            if(JSON.stringify(rawDataFromYesterday) !== JSON.stringify(arrayToStore)) {
                                //Then Check difference using id, otherwise it did not work. Using lodash to help.
                                let difference = _.differenceBy(arrayToStore[0], rawDataFromYesterday[0],'id');
                                fs.writeFileSync('./compare/NewThinkpads.json', JSON.stringify(difference));
                                //if they are different save the new file.
                                //Then send it via mail
                                console.log("different entries, wrote difference to JSON");
                                mail(difference, term);
                                fs.writeFileSync('./compare/yesterday-' + term +'.json', JSON.stringify(arrayToStore));
                            } else {
                                console.log("no new entries, cleaning up JSON"); 
                                fs.writeFileSync('./compare/NewThinkpads.json', []);
                            }
                          
                        });
                    } else {
                        console.error("error");
                        console.log("file did not exist, writing new file");
                        fs.writeFileSync('./compare/yesterday-' + term +'.json', JSON.stringify(arrayToStore));
    
                    }
                  
                    
                  
             
          
                
            }
           
        })
     }  
   

    }).catch(err => console.log(err));


    
}

module.exports = compare