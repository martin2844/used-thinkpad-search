import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Spinner from '../components/Spinner';
import ArticleCard from '../components/ArticleCard';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';

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
        isLoading: false,
        checkBoxState: {},
    })
    //classes for material-ui Component
    const classes = useStyles();

    // initial SEARCH ie. Only the term.
    useEffect(() => {
        setResults({...results, isLoading: true})
        console.log("useEffect");
        axios.get(`/api/search/${search}/0`).then((response) => {
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
        }).then(setResults({...results, isLoading: false}));  
      },[search])

      //set the State of the checkboxes after the results exist.
      useEffect(()=>{
        setState(results.checkBoxState);
      }, [results.checkBoxState])


    
      //Function to handle what happens after check box is checked.
      const handleChange = event => {
        setState({ ...state, [event.target.name]: event.target.checked });
        // If checbox is checked We should clear all checkboxes leave only the checked one, and then map the subchilds of those.
        console.log(event.target.name)
        axios.post(`/api/search/${search}/0`, {filter: event.target.name}).then((response) => {
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
  

        }).then(setResults({...results, isLoading: false}));  
      };

      const displayChecks = () => {



        
          let cats = []
          if (results.data.cats) {cats = results.data.cats};
          return cats.map((cat) => {
              return(
                <FormControlLabel
                key={cat.id}
                control={
                  <Checkbox
                    checked={state[cat.id] || false}
                    onChange={handleChange}
                    name={cat.id || ""}
                    color="primary"
                  />
                }
                label={cat.name}
              />
              )
          })
      }


      const displayCards = () => {
        let articles = [];
        if(results.data.articles) {articles = results.data.articles}
       return articles.map((card) => {
         const { image, price, id, title, city, state, link } = card
          return (
            <span className="individual-card">
            <ArticleCard img={image} price={price} id={id} title={title} city={city} state={state} link={link} />
            </span>
          )
        })
      }

    return (
        <div className="flex-center">
            
                <div className={classes.margin}>
                        <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                            <SearchIcon />
                        </Grid>
                        <Grid item>
                            <TextField value={search} onChange={e =>  setSearch(e.target.value)} id="input-with-icon-grid" label="Buscá!" />
                        </Grid>
                        </Grid>
                    </div>
                {results.isLoading ? <Spinner /> : null}
                <div className="search-container">
                    <div className="check-container">
                        {displayChecks()}
                    </div>
                    <div className="custom-card-container">
                    {displayCards()}
                    </div>
                </div>

        </div>
    )
}

export default Search
