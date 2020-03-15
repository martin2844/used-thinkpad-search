const _ = require('lodash');
const fs = require('fs');
const axios = require('axios');
const util = require('util');
const mail = require('./mailer');


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
                    console.log(pages, i)
                }
                )
        )
    }

    return await Promise.all(promises).then(() => {
        return arrayToStore
    });
}


const processData = async (term, arrayToStore) => {
    //Define path to save JSON Files
    let path = ('./compare/yesterday-' + term + '.json');
    let DATA;
    //returns true if file exists..
    const checkFile = async () => {
        return await fs.existsSync(path);
        
    }

    const readJSON = async () => {
      return readFile('./compare/yesterday-' + term + '.json');
    }   

    let rawDataFromYesterday = await readJSON();
    let difference = _.differenceBy(arrayToStore[0], rawDataFromYesterday[0], 'id');
    //must fix differences;
    console.log(difference);

    if (checkFile()) {
        if (difference.length) {
            return "differences!";
        } else {
            return "no difference";
        }


        
    } else {
        return "File does not exists" 
    }
    
    //so, if file exists, call async function ReadJSON.


 // if (fs.existsSync(path)) {
    //     console.log("file exists, reading data from yesterday")
    //         fs.readFile('./compare/yesterday-' + term + '.json', (err, data) => {
    //         let rawDataFromYesterday = JSON.parse(data);
    //         if (JSON.stringify(rawDataFromYesterday) !== JSON.stringify(arrayToStore)) {
    //             //Then Check difference using id, otherwise it did not work. Using lodash to help.
    //             let difference = _.differenceBy(arrayToStore[0], rawDataFromYesterday[0], 'id');
    //             fs.writeFileSync('./compare/New' + term + '.json', JSON.stringify(difference));
    //             //if they are different save the new file.
    //             //Then send it via mail
    //             console.log("different entries, wrote difference to JSON");
    //             // let newMail = mail(difference, term);
    //             fs.writeFileSync('./compare/yesterday-' + term + '.json', JSON.stringify(arrayToStore));
    //             DATA = {
    //                 content: difference,
    //                 message: "These were the differences, items could be new or deleted.",
    //                 info: "an email was sent, details are the following:"
    //             }
    //             return DATA;
    //         } else {
    //             console.log("no new entries, cleaning up JSON");
    //             fs.writeFileSync('./compare/New' + term + '.json', []);
    //             DATA = {
    //                 content: null,
    //                 message: "There were no difference from last consultation",
    //                 info: "The file" + './compare/New' + term + '.json' + ' was cleaned'
    //             }
                
    //             return DATA;
    //         }
    //     })
        
    // }

    //             console.log("Loop Finished. Reading data from Yesterday")
    //             fs.readFile('./compare/yesterday-' + term +'.json', (err, data) => {
    //                 if (err) throw err;
    //                 let rawDataFromYesterday = JSON.parse(data);
    //                 // test
    //                 //first convert both items to check to JSON strings in order to check them.
    //                 if(JSON.stringify(rawDataFromYesterday) !== JSON.stringify(arrayToStore)) {
    //                     //Then Check difference using id, otherwise it did not work. Using lodash to help.
    //                     let difference = _.differenceBy(arrayToStore[0], rawDataFromYesterday[0],'id');
    //                     fs.writeFileSync('./compare/New'+ term + '.json', JSON.stringify(difference));
    //                     //if they are different save the new file.
    //                     //Then send it via mail
    //                     console.log("different entries, wrote difference to JSON");
    //                     let newMail = mail(difference, term);
    //                     fs.writeFileSync('./compare/yesterday-' + term +'.json', JSON.stringify(arrayToStore));
    //                     DATA = {
    //                         content: difference,
    //                         message: "These were the differences, items could be new or deleted.",
    //                         info: "an email was sent, details are the following:"
    //                     }
    //                     return DATA;
    //                 } else {
    //                     console.log("no new entries, cleaning up JSON"); 
    //                     fs.writeFileSync('./compare/New'+ term + '.json', []);
    //                     DATA = {
    //                         content: null,
    //                         message: "There were no difference from last consultation",
    //                         info: "The file" + './compare/New'+ term + '.json' + ' was cleaned'
    //                     }
    //                     console.log(DATA, "data2");
    //                     return DATA;
    //                 }

    //           
    //         } else {
    //             console.error("error");
    //             console.log("file did not exist, writing new file");
    //             fs.writeFileSync('./compare/yesterday-' + term +'.json', JSON.stringify(arrayToStore));
    //             DATA = {
    //                 content: arrayToStore,
    //                 message: "There were no registries of the consultation",
    //                 info: "Writing new file to ' " +  path + "'"
    //             }
    //             console.log(DATA, "data2");
    //             return DATA;

    //         }






    // }

  return DATA;

}


module.exports.compare = compare;
module.exports.getPages = getPages;
module.exports.processData = processData;