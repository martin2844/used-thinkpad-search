import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Spinner from '../components/Spinner';


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

    

    const [state, setState] = React.useState({});
    const [search, setSearch] = useState('');
    const [results, setResults] = useState({
        data: {},
        isLoading: false,
        checkBoxState: {},
    })
    const classes = useStyles();
    console.log(search)
    
    useEffect(() => {
        setResults({...results, isLoading: true})
        console.log("useEffect");
        axios.get(`/api/search/${search}/0`).then((response) => {
       
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
        setResults({...results, data: response.data, checkBoxState: checkBoxMap })


        }).then(setResults({...results, isLoading: false}));  
      },[search])

      useEffect(()=>{
        setState(results.checkBoxState);
      }, [results.checkBoxState])


    

      const handleChange = event => {
        setState({ ...state, [event.target.name]: event.target.checked });
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
                    <div>
                        {displayChecks()}
                    </div>
                    <div>
                    {JSON.stringify(results.data)}
                    </div>
                </div>

        </div>
    )
}

export default Search
