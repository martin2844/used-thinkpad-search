import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CustomAlert from '../components/CustomAlert';
import Spinner from '../components/Spinner';
import ArticleCard from '../components/ArticleCard';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';

import useDebounce from '../hooks/useDebounce';

import './Search.scss';

const useStyles = makeStyles(theme => ({ 



}) )

const Search = () => {

    
    //State for checkboxes
    const [state, setState] = React.useState({});
    //State for input text handling
    const [search, setSearch] = useState('');
    //State for actual return of the results.
    const [results, setResults] = useState({
        data: {},
        checkBoxState: {},
    })
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [lastCat, setLastCat] = useState([]);

    //define the useDebounce hook options
    const debouncedSearchTerm = useDebounce(search, 500);
    useEffect(()=> {
      if(search === '') {
        setIsLoading(false);
        setResults({
          data: {},
          checkBoxState: {},
      });
      }
    }, [search])

    //classes for material-ui Component
    const classes = useStyles();

    // initial SEARCH ie. Only the term.
    useEffect(() => {
        //console.log("useEffect");
        if(debouncedSearchTerm) {
          setIsLoading(true);
        axios.get(`/api/search/${debouncedSearchTerm}/0`).then((response) => {
        // Map the state object for checkboxes.
        let objectMap = () => {
          let cats;
          let objectToReturn;
          if (response.data.cats) {cats = response.data.cats
          cats.forEach((cat) => {
            objectToReturn = {
              ...objectToReturn,
              [cat.id]: false
            }
          })
          return objectToReturn;
        };
        }
        let checkBoxMap = objectMap();

        //Set global State results.
        setResults({...results, data: response.data, checkBoxState: checkBoxMap })
        
        //Change loading to false after promise resolves
        }).then(setTimeout(() => setIsLoading(false), 1000)).catch(err => setError(err));  
      }
      },[debouncedSearchTerm])

      //set the State of the checkboxes after the results exist.
      useEffect(()=>{
        setState(results.checkBoxState);
      }, [results.checkBoxState])


      //Function to handle what happens after check box is checked.
      const handleChange = event => {
        setIsLoading(true);
        setState({ ...state, [event.target.name]: event.target.checked });
        //Define the cat name for breadCrumbs
        let catName = event.target.name.substr(event.target.name.indexOf('-') + 1, event.target.name.length);
     
        // If checbox is checked We should clear all checkboxes leave only the checked one, and then map the subchilds of those.
        
   
        let filter = event.target.name.substr(0, event.target.name.indexOf('-'));
        setLastCat([...lastCat, {name: catName, id: filter}]);


        axios.post(`/api/search/${search}/0`, {filter: filter}).then((response) => {
          let objectMap = () => {
            let cats;
            let objectToReturn;
            if (response.data.cats) {cats = response.data.cats
            cats.forEach((cat) => {
              objectToReturn = {
                ...objectToReturn,
                [cat.id]: false
              }
            })
            return objectToReturn;
          };
          }
          let checkBoxMap = objectMap();
          //Set global State results.
          setResults({...results, data: response.data, checkBoxState: checkBoxMap})
  

        }).then(setTimeout(() => setIsLoading(false), 1000));  
      };
      
      const handleChange2 = (event) => {
        let catName = event.target.name.substr(event.target.name.indexOf('-') + 1, event.target.name.length);
        let filter = event.target.name.substr(0, event.target.name.indexOf('-'));
        handleChange(event);
        if(event.target.name === "") {
          setLastCat([]);
        } else {
          setLastCat([{name: catName, id: filter}]);
        }
        
      }

      const displayChecks = () => {
          //console.log(lastCat)
          let cats = []
          //console.log(results.checkBoxState.undefined)
          if (results.data.cats) {cats = results.data.cats};
          if(results.checkBoxState.undefined === false) {
            return(
            <div className="rigid-flex-column">
            {lastCat.map((cat) => {
              return(
                <button key={cat.id} className="filter-btn" name={`${cat.id}-${cat.name}` || ""} onClick={handleChange2}>{cat.name}</button>
              )
            })}
            <button className="filter-btn clear" name=""  onClick={handleChange2}>Limpiar</button>
              </div>
              )
          } else { return(
            <div className="rigid-flex-column">
              {
                lastCat.map((cat) => {
                  return(
                    <button className="filter-btn" key={cat.id} name={`${cat.id}-${cat.name}` || ""} onClick={handleChange2}>{cat.name}</button>
                  )
                })
              }
          {cats.map((cat) => {
              return(
                <FormControlLabel
                key={cat.id}
                control={
                  <Checkbox
                    key={`${cat.id}-checkbox`}
                    checked={state[cat.id] || false}
                    onChange={handleChange}
                    name={`${cat.id}-${cat.name}` || ""}
                    color="primary"
                  />
                }
                label={cat.name}
              />
              )
          })}
          </div>
          )

        }
      }
   

      const displayCards = () => {
        let articles = [];
        if(results.data.articles) {articles = results.data.articles}
       return articles.map((card) => {
         const { image, price, id, title, city, state, link } = card
          return (
            <span key={id} className="individual-card">
            <ArticleCard img={image} price={price} id={id} title={title} city={city} state={state} link={link} />
            </span>
          )
        })
      }
      let message;
      if (error) { message = JSON.stringify(error.message) }
  
    return (
     
        <div className="flex-center">
            
                <div className={classes.margin}>
                        <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                            <SearchIcon />
                        </Grid>
                        <Grid item>
                            <TextField value={search} onChange={e => {setSearch(e.target.value); setIsLoading(true); setLastCat([]);}} id="input-with-icon-grid" label="Buscá!" />
                        </Grid>
                        </Grid>
                    </div>
                    <CustomAlert open={error} message={message} severity="error" />
                    {isLoading ? <div className="spinner-container"><Spinner /></div> :
                <div className="search-container">
                    <div className="check-container">
                        {displayChecks()}
                    </div>
                    <div className="custom-card-container">
                     {displayCards()}
                    
                    </div>
                </div>
                    } 

        </div>
    )
}

export default Search
