import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore"; 
import { query, where, orderBy, limit } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';

import React, { useRef, useState, useCallback, useEffect } from 'react';

import axios from 'axios'

import useMovieSearch from "./searchResults"


function MovieDetails(props) {
    const params = useParams();
    const movieID = params.movie;

    const [error, setError] = useState(false)
    const [result, setResult] = useState({})
    const [loading, setLoading] = useState(true)
    const [na, setNA] = useState(true)

    const [formValue, setFormValue] = useState('');

    useEffect(() => {
        
        axios({
        method: 'GET',
        url: 'https://www.omdbapi.com/',
        params: { i: movieID, apikey: process.env.REACT_APP_OMDB_API_KEY },
        }).then(res => {
            if (res.data.Response == 'True'){
                setResult(res.data);
                setNA(false);
            }
            setLoading(false);
        }).catch(e => {
        if (axios.isCancel(e)) return
        setError(true)
        })

    }, [])


    if (na && !loading){
        return (
            <div className="App">
            <header className="App-header">
                <section>
                <h1> Info Not Available! </h1>
                </section>
            </header>
            </div>
        )
    }

    else if (loading){
        return(<ListLoading />)
    }


    return (
        <div className="App">
          <header className="App-header">
            <section>
                <img src={result.Poster} alt="Italian Trulli"></img>
                <h1> Title: {result.Title} </h1>
                <h1> Type: {result.Type} </h1>
                <h1> IMDB ID: {result.imdbID} </h1>
                <h1> Year: {result.Year} </h1>
                <h1> IMDB Rating: {result.imdbRating} </h1>
                
                <form onSubmit={postComment}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="input" />
                <button type="submit" disabled={!formValue}>🕊️</button>
                </form>

            </section>
          </header>
        </div>
    );
}




function ListLoading(props){
    return (
        <div className="App">
        <header className="App-header">
        <section>
            <p>Loading ...</p>
        </section>
        </header>
        </div>
    )
}


export {MovieDetails};