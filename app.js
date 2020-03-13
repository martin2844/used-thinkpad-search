const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

/* offset se pasa parametro por Url, ofsset es 0 en la primera pagina.
En la segunda es 1, etc..

Primary results son los resultads posta que vuelven de la busquedas lo demas son falopa.
Entonces si el limite es 50, y tenemos 405 primary results
la primera pagina,
    la pagina 0: va tener del 1-50, 
    la pagina 1: va tener del 50-100, 
    la pagina 2: va tener del 100-150,
    etc
    
Habria que dividir, primary results por limit, osea 405/50
Despues hacer math.Roof creo que era para redondear para arriba, con eso obtenemos la cantidad de paginas a hacer,
generas el item de paginacion, y que cada pagina le de el offset

Paginacion abajo:
-- 1 -- 2 -- 3 -- 4 -- 5 --

offset a poner en el axios de llamada para cada pagina via req.params.id:
-- 0 -- 1 -- 2 -- 3 -- etc..




*/
app.get('/api/', (req, res) => {
    console.log("works")
    
    
    axios.get('https://api.mercadolibre.com/sites/MLA/search?q=thinkpad%20w540&condition=used&category=MLA1652')
    .then(function (response) {
      // handle success
      let {results} = response.data
    const whatMatters = results.map((result) => {
        let image = result.thumbnail.replace("I.jpg", "O.jpg");
         return importante = {
             titulo: result.title,
             precio: result.price,
             link: result.permalink,
             image: image,
             provincia: result.address.state_name,
             ciudad: result.address.city_name
         }
     })
     
    // res.json(whatMatters);
    //res.json(results)
    res.json(response.data.paging)
    });
})


//this could be a route for the apicall

app.get('/api/:searchTerm/:id', (req, res) => {
    console.log("calling API");
    let pageNo = parseInt(req.params.id);
    let offset = "&offset=" + pageNo;
    let { searchTerm } = req.params;  
    
    axios.get('https://api.mercadolibre.com/sites/MLA/search?q='+ searchTerm +'&condition=used&category=MLA1652' + offset)
    .then(function (response) {
     // handle success
     let {results} = response.data;
     //begin calculation of pages
     let amount = response.data.paging.primary_results;
     console.log(amount);
     let pagination = Math.ceil(amount / 50);


     //Object of things that I want to see.
     const whatMatters = results.map((result) => {
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
     })
     console.log("Sending Results", "\ntotalpages:", pagination);
     res.json({
         totalPages: pagination,
         actualPage: pageNo,
         articles: whatMatters});

      
    });
    
})


app.get("/test", (req, res) => {
    const start = new Date();

    const replace = () => {
   
            let url = 'http://mla-s1-p.mlstatic.com/761559-MLA40491634097_012020-I.jpg'
            let newURL = url.replace("I.jpg", "O.jpg");
            console.log(newURL);
            console.log(Date.now() - start);
       
       
    }

    const length = () => {

        let url = 'http://mla-s1-p.mlstatic.com/761559-MLA40491634097_012020-I.jpg'
        let newURL = url.slice(url.length - 4) + "O.jpg"
        console.log(newURL);
        console.log(Date.now() - start);
        
   
    }
    for (var i = 1; i < 100; i++) length();
    console.log("done",Date.now() - start);
    res.send("done");
})



let compare = () => {
    //declaer empty array where we will push every thinkpad.
    let arrayToStore = [];
    //declare page variable, that will be the amount of pages based on the primary results
    let pages;
    //this is the Initial get request to calculate amount of iterations depending on result quantities.
    axios.get('https://api.mercadolibre.com/sites/MLA/search?q='+ "thinkpad W540" +'&condition=used&category=MLA1652&offset=' + 0)
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
        axios.get('https://api.mercadolibre.com/sites/MLA/search?q='+ "thinkpad W540" +'&condition=used&category=MLA1652&offset=' + i * 50)
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
                console.log("Loop Finished. Reading data from Yesterday")
                fs.readFile('test.json', (err, data) => {
                    if (err) throw err;
                    let rawDataFromYesterday = JSON.parse(data);
                    fs.writeFileSync('test2.json', rawDataFromYesterday);
                    // test
                    //first convert both items to check to JSON strings in order to check them.
                    if(JSON.stringify(rawDataFromYesterday) !== JSON.stringify(arrayToStore)) {
                        let difference = rawDataFromYesterday.filter(x => !arrayToStore.includes(x))
                        fs.writeFileSync('test2.json', JSON.stringify(difference));
                        //if they are different save the new file.
                        //Then send it via mail
                        console.log("different entries");
                        fs.writeFileSync('test.json', JSON.stringify(arrayToStore));
                    } else {
                        console.log("no new entries")
                    }
                 
                });
                
            }
           
        })
     }  
   

    }).catch(err => console.log(err));


    
}

compare()


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
    console.log("Server started @ port" + PORT);
});