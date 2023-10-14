import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore"; 
import { query, where, orderBy, limit } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { Link } from 'react-router-dom';

import React, { useRef, useState, useCallback, useEffect } from 'react';

import useMovieSearch from "./searchResults"


function SearchMovies(props) {
    const [query, setQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)

    const {
        movies,
        hasMore,
        loading,
        error
    } = useMovieSearch(query, pageNumber)

    const observer = useRef()
    const lastMovieRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
        }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    function handleSearch(e) {
        setQuery(e.target.value)
        setPageNumber(1)
    }

    // const movieList = Object.keys(movies).map((key) => {
    //     return movies[key].map((value, index) => ({
    //       [key]: value,
    //     }));
    // });

    // console.log(movieList);

    // console.log(movies)

    return (
        <div className="App">
        <header className="App-header">
        <section>
        <main>
        <input type="text" value={query} onChange={handleSearch}></input>
        <br></br>
        {movies.name && movies.name.map((movie, index) => <SearchResult key={index} movies={movies} auth={props.auth} index={index} length={movies.name.length} lastMovieRef={lastMovieRef}/>)}
        </main>
        </section>
        </header>
        </div>
    )
}


function SearchResult(props){
    const split_placeholder = process.env.REACT_APP_MSG_SPLIT_THINGY;

    // const movieTitle = props.movie;
    const movieTitle = props.movies.name[props.index];
    const movieID = props.movies.id[props.index];
    const photoURL = props.movies.photoURL[props.index];

    // console.log(props.movie)

    // TODO: split thing to have image url too

    if (props.length-1 === props.index){
        return (<>
            <div ref={props.lastMovieRef} className='movieSearchResultDisplay'>
                <p> <Link to={`/movies/${movieID}`}> {movieTitle} </Link> </p>
            </div>
        </>)
    }

    else {
        return (<>
            <div className='movieSearchResultDisplay'>
                <p> <Link to={`/movies/${movieID}`}> {movieTitle} </Link> </p>
            </div>
        </>)
    }
}


export {SearchMovies};