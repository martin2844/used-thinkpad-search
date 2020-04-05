const _ = require('lodash');
const fs = require('fs');
const axios = require('axios');
const util = require('util');
const mail = require('./mailer');

const Compare = require("../models/Compare");






const readFile = util.promisify(fs.readFile);

let getPages = async (term) => {

    try {
        // fetch data from a url endpoint
        const response = await axios.get('https://api.mercadolibre.com/sites/MLA/search?q=' + term + '&condition=used&category=MLA1652&offset=' + 0)
        const amount = await response.data.paging.primary_results;
        const pages = Math.ceil(amount / 50);
        return pages;
    } catch (error) {
        console.log(error); // catches both errors
    }
}


let compare = async (term, pages) => {
    let arrayToStore = [];
    let promises = [];
    //here we begin the for loop.
    for (i = 0; i < pages; i++) {
        // So for each page we will do an axios request in order to get results
        //Since each page is 50 as offset, then i should be multiplied by 50.
        promises.push(
            axios.get('https://api.mercadolibre.com/sites/MLA/search?q=' + term + '&condition=used&category=MLA1652&offset=' + i * 50)
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
                    
                }
                )
        )
    }
    
    return await Promise.all(promises).then(() => {
        return arrayToStore
    });
}


const processData = async (term, arrayToStore) => {
    // //Define path to save JSON Files
    // let path = ('./compare/yesterday-' + term + '.json');
    // let DATA;
    // //returns true if file exists..
    
    // const checkFile = async () => {
    //     try {
    //         return await fs.existsSync(path);
    //     } catch (error) {
    //         return error;
    //     }
        
        
    // }

    const checkDB = async () => {
        try {
            const query = await Compare.findOne({query: term }, (err, query) => {
                return query;
            });
            
            if(query) {return true} else {return false}
            
            // if the query has been done, await checkDB returns true, else false.
      
        } catch (error) {
            return error;
        }
    }

    //We should make a new function to read the DB with that query.

    const readDB = async () => {
        try {
            const query = await Compare.findOne({query: term }, (err, query) => {
                return query;
            });
            return query;
        } catch (error) {
         return error; 
        }
    }

    // const readJSON = async () => {
    //     try {
    //         console.log("entered try")
    //         let data = readFile('./compare/yesterday-' + term + '.json');
    //         return data;
    //     } catch (error) {
    //         console.log(error, "catch")
    //         return error;
    //     }
      
    // }   
   
    if (await checkDB()) {
        let rawDataFromYesterday = await readDB();
        let difference = _.differenceBy(arrayToStore[0], rawDataFromYesterday.data[0], 'id');
        console.log(difference);
        // difference variable return the new laptops, or the deleted ones. Differences...
        // @@@ We are here now. If there are differences should try this out.
        if (difference.length) {
            
            //Write difference to files
            fs.writeFileSync('./compare/New' + term + '.json', JSON.stringify(difference));
            //send New Mail with differences found.
            // let newMail = mail(difference, term);
            //Finally write over yesterday's file to compare for tomorrow
            fs.writeFileSync('./compare/yesterday-' + term +'.json', JSON.stringify(arrayToStore));
            //Finally Return Status
            return {
                content: difference,
                message: "These were the differences, items could be new or deleted.",
                info: "an email was sent, details are the following:"
            }
      
            // aca devolver diferencias pero guardar igual para futuras comps.
        } else {
            return {
                content: null,
                message: "There were no difference from last consultation",
                info: "The file" + './compare/New'+ term + '.json' + ' was cleaned'
               }
            }
    }
     else {
        console.error("error");
        console.log("file did not exist, writing new file");
        fs.writeFileSync('./compare/yesterday-' + term +'.json', JSON.stringify(arrayToStore));
        const newFile = new Compare({
            query: term,
            type: "scratch",
            data: arrayToStore
        })
        const newLog = await newFile.save();
        // console.log(newLog, "save");
        return {
            content: arrayToStore,
            message: "There were no registries of the consultation",
            info: "Writing new file to ' " +  path + "'"
        }
       
    }
    

  return DATA;

}


module.exports.compare2 = compare;
module.exports.getPages2 = getPages;
module.exports.processData2 = processData;