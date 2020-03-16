import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import Listing from './components/Listing';
import './App.scss';
import Spinner from './components/Spinner';

const App = () => {

  const initialState = {
    term: "thinkpad",
    page: 0,
    loading: true,
    results: {}
  }


  function reducer(state, action) {
    switch (action.type) {
      case 'SEARCH':
        return {
          ...state,
          term: action.term,
          loading: true,
        }
      case 'LOADING': 
      return {
        state,
        loading: true
      }
      case 'FINISH':
        return {
          ...state,
          loading: false,
          results: action.payload
        }
      case 'CHANGE_PAGE':
        return {
          ...state,
          page: action.page,
          loading: true,
        }
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  // const[results, setResults] = useState({});



    // Initial Search
    useEffect(() => {
      console.log("useEffect");
      axios.get(`/api/search/thinkpad/0`).then((response) => {
        dispatch({type: 'FINISH', payload: response.data})
      });  
    },[])
 
    //subsequent searches
    const updateResults = (term, page) => {
      axios.get(`/api/search/${term}/${page}`).then((response) => {
        dispatch({type: 'FINISH', payload: response.data})
      });

    }

  const displayArticles = () => {
    if(state.results.articles) {
      return state.results.articles.map((article) => {
        let {title, state, city, price, image, link} = article
        return <Listing key={link} title={title} state={state} city={city} price={price} image={image} link={link} />
      })
    }
  }

  const changePage = (page) => {
    console.log(page);
    console.log(state.page);
    
    dispatch({type: 'CHANGE_PAGE', page: page})
    updateResults(state.term, page * 50);
  
  }


  const pagination = () => {
    let pages = [];
    for(let i = 0; i < state.results.totalPages; i++) { 
     
      pages.push(i);


    }
    console.log(pages);
    if(pages.length < 2) {
      return null
    } else {
    return pages.map((page) => {
         // aca hacer si page === to state.page, clase agregada a class name
      return (
        

        <span key={page} onClick={() => changePage(page)} className={"pagination-item " + (page === state.page ? "active" : "inactive")}>
          {page + 1}
        </span>
      )
    })
  }

  }

  const onClick = (e) =>{
   
    let term = e.target.innerText;
    if(term === "All Thinkpads") {
      dispatch({type: 'SEARCH', term: 'thinkpad'});
      updateResults('thinkpad', state.page);
    } else {
      dispatch({type: 'SEARCH', term: term});
      updateResults(term, state.page);
    }

    
    
  }

  

  return (
    <div className="main-container">
     <h1>Used Thinkpad Meli Search</h1>
     <h3>My favourite thinkpads</h3>
     <div className="button-container">
       <span onClick={e => onClick(e)}>Thinkpad Carbon</span>
       <span onClick={e => onClick(e)}>Thinkpad T430</span>
       <span onClick={e => onClick(e)}>Thinkpad T450</span>
       <span onClick={e => onClick(e)}>Thinkpad W540</span>
       <span onClick={e => onClick(e)}>All Thinkpads</span>
     </div>
     
      <div style={state.loading ? {minHeight: "500px", alignItems: "center"} : null} className="card-map"> 
    
      {state.loading ? <Spinner/> : displayArticles()}
      
      </div>
      <div className="pagination-parent"> {pagination()}</div>
    </div>
  )
}

export default App

