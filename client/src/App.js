import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Listing from './components/Listing';
import './App.scss';
import Spinner from './components/Spinner';

const App = () => {


  
  const[initialSearchTerm, setInitialSearchTerm] = useState({});
  const[page, setPage] = useState(0);
  const[word, setWord] = useState("thinkpad");
  const[loading, setLoading] = useState(true);


  useEffect(()=> {
    axios.get(`/api/${word}/${page}`).then((response) => {
      setInitialSearchTerm(response.data);
      console.log(initialSearchTerm);
      setLoading(false);
     
    })
  }, [initialSearchTerm])

  const displayArticles = () => {
    if(initialSearchTerm.articles) {
      return initialSearchTerm.articles.map((article) => {
        let {title, state, city, price, image, link} = article
        return <Listing key={link} title={title} state={state} city={city} price={price} image={image} link={link} />
      })
    }
  }

  const changePage = (page) => {
    console.log(page);
    setPage(page * 50);
  }


  const pagination = () => {
    let pages = [];
    for(let i = 0; i < initialSearchTerm.totalPages; i++) { 
     
      pages.push(i);


    }
    console.log(pages);
    if(pages.length < 2) {
      return null
    } else {
    return pages.map((page) => {
      return (
        <span onClick={() => changePage(page)} className="pagination-item">
          {page + 1}
        </span>
      )
    })
  }

  }

  const onClick = (e) =>{
    setLoading(true);
    let term = e.target.innerText;
    if(term === "All Thinkpads") {
      setWord("thinkpad");
    } else {
      setWord(term);
    }
    
  }

 

  return (
    <div className="main-container">
     <h1>Used Thinkpad Meli Search</h1>
     <h3>My favourite thinkpads</h3>
     <div className="button-container">
       <span onClick={e => onClick(e)}>Thinkpad Carbon</span>
       <span onClick={e => onClick(e)}>Thinkpad T430</span>
       <span onClick={e => onClick(e)}>Thinkpad W540</span>
       <span onClick={e => onClick(e)}>All Thinkpads</span>
     </div>
     
      <div style={loading ? {minHeight: "500px", alignItems: "center"} : null} className="card-map"> 
    
      {loading ? <Spinner/> : displayArticles()}
      
      </div>
      <div className="pagination-parent"> {pagination()}</div>
    </div>
  )
}

export default App

