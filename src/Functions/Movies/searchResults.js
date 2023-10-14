import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useMovieSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [movies, setMovies] = useState({ name: [], id: [], photoURL: [] })
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setMovies({ name: [], id: [], photoURL: [] })
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: 'https://www.omdbapi.com',
      params: { s: query, page: pageNumber, apikey: process.env.REACT_APP_OMDB_API_KEY },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      if (res.data.Response == 'True'){
        // console.log(res);
        // console.log(movies);
        setMovies(prevMovies => {
          // return [...new Set([...prevMovies, ...res.data.Search.map(b => b.Title)])]
          return {
            name: [...prevMovies.name, ...res.data.Search.map(b => b.Title)],
            id: [...prevMovies.id, ...res.data.Search.map(b => b.imdbID)],
            photoURL: [...prevMovies.photoURL, ...res.data.Search.map(b => b.Poster)],
          }
        })
      }
      setHasMore(res.data.Response == 'True')
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [query, pageNumber])


  return { loading, error, movies, hasMore }
}