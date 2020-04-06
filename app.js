const express = require('express');
const path = require('path');
const app = express();
const {compare, getPages, processData} = require('./compare/compare');
const {compare2, getPages2, processData2} = require('./compare/comparedb');
const axios = require('axios');
//body parser necessary to parse body for express
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
app.use(express.static(path.join(__dirname, 'client/build')));

// parse application/json
app.use(bodyParser.json())


mongoose.connect( "mongodb+srv://" + process.env.MONGO + "@cluster0-ekehs.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   }).then(() => {
    console.log('connected to database');
   });


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
app.get('/api/testing', (req, res) => {
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

app.get('/api/search/notebook/:searchTerm/:id', (req, res) => {
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

//Search global route
app.get('/api/search/:searchTerm/:id', (req, res) => {
    console.log("calling API");
    let pageNo = parseInt(req.params.id);
    let offset = "&offset=" + pageNo;
    let { searchTerm } = req.params;  
    let categoryFilter;
    
    axios.get('https://api.mercadolibre.com/sites/MLA/search?q='+ searchTerm +'&condition=used&' + offset)
    .then(function (response) {
     // handle success
     let {results} = response.data;
     //begin calculation of pages
     let amount = response.data.paging.primary_results;
     console.log(amount);
     let pagination = Math.ceil(amount / 50);

     let available_cats = response.data.available_filters.filter(data => {
        return data.id === "category";
     })
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
         articles: whatMatters,
         cats: available_cats[0].values
        }); 

      
    });
    
})

//Search global route
app.post('/api/search/:searchTerm/:id', (req, res) => {
    console.log("calling API");
    console.log(req.body)
    let filter = "&category=" + req.body.filter;
    let pageNo = parseInt(req.params.id);
    let offset = "&offset=" + pageNo;
    let { searchTerm } = req.params;  

    axios.get('https://api.mercadolibre.com/sites/MLA/search?q='+ searchTerm + filter +'&condition=used&' + offset )
    .then(function (response) {
     // handle success
     let {results} = response.data;
     //begin calculation of pages
     let amount = response.data.paging.primary_results;
     console.log(amount);
     let pagination = Math.ceil(amount / 50);

     let available_cats = response.data.available_filters.filter(data => {
        return data.id === "category";
     })

     if(available_cats.length === 0) {
         available_cats.push({
             values: ["no more subcats"]
         })
     }
     console.log(available_cats);
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
         articles: whatMatters,
         cats: available_cats[0].values
        }); 

      
    });
    
})



//check.then works. Podria pasarse dentro del then la nueva funcion?
// let check = getPages("thinkpad t450");

let saveQueryToFS = async (term) => {
    let searchTerm = term || "thinkpad x220";
    // first round of promise to get pages amount status: WORKING
    const pages = await getPages(term);
    //second round of promises to get all results. status: WORKING
    const data = await compare(term, pages);
    // third round of promises to do all file processing
    const lastly = await processData(term, data)
    return lastly;
}


let saveQueryToDB = async (term, mail) => {
    let searchTerm = term || "thinkpad x240";
    // first round of promise to get pages amount status: WORKING
    const pages = await getPages2(searchTerm);
    //second round of promises to get all results. status: WORKING
    const data = await compare2(searchTerm, pages);
    // third round of promises to do all file processing
    const lastly = await processData2(searchTerm, data, mail)
    return lastly;
}



app.post("/api/comparetofs/:term", (req, res) => {
    const {term} = req.params
    saveQueryToFS(term).then(x => {
        res.send(x);
    })
});


app.post("/api/comparetodb/:term", (req, res) => {
    const {term} = req.params
    saveQueryToDB(term).then(x => {
        res.send(x);
    })
});


// test route for DB save
app.get("/compare", (req, res) => {
    result2().then(x => res.send(x));
    
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






app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log("Server started @ port" + PORT);
});