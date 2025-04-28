import express from 'express';
import axios, { AxiosError } from 'axios'; // Import AxiosError type
import { protect } from '../middleware/auth';

const router = express.Router();

// Create API clients on the backend
const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY
  }
});

const booksClient = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1',
  params: {
    key: process.env.BOOKS_API_KEY
  }
});

const animeClient = axios.create({
  baseURL: 'https://api.jikan.moe/v4'
});

// TMDB Movie routes
router.get('/movies/popular', async (req, res) => {
  try {
    const indiaMode = req.query.indiaMode === 'true';
    const endpoint = indiaMode ? '/discover/movie' : '/movie/popular';
    
    const params = indiaMode ? {
      with_original_language: 'hi',
      region: 'IN',
      sort_by: 'popularity.desc'
    } : {};
    
    const response = await tmdbClient.get(endpoint, { params });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    const axiosError = error as AxiosError;
    res.status(axiosError.response?.status || 500).json({
      success: false,
      message: axiosError instanceof Error ? axiosError.message : 'Unknown error'
    });
  }
});

router.get('/movies/search', async (req, res) => {
  try {
    const { query, indiaMode } = req.query;
    const params = {
      query,
      ...(indiaMode === 'true' ? { with_original_language: 'hi', region: 'IN' } : {})
    };
    
    const response = await tmdbClient.get('/search/movie', { params });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    const axiosError = error as AxiosError;
    res.status(axiosError.response?.status || 500).json({
      success: false,
      message: axiosError instanceof Error ? axiosError.message : 'Unknown error'
    });
  }
});

// TMDB TV/Series routes
router.get('/series/popular', async (req, res) => {
  try {
    const indiaMode = req.query.indiaMode === 'true';
    const params = {
      with_networks: indiaMode ? '4353,3575,4818,2489' : '213',
      sort_by: 'popularity.desc',
      'first_air_date.gte': '2016-01-01',
      without_genres: '99,10763',
      'vote_count.gte': '50',
      ...(indiaMode ? { with_original_language: 'hi' } : {})
    };
    
    const response = await tmdbClient.get('/discover/tv', { params });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    const axiosError = error as AxiosError;
    res.status(axiosError.response?.status || 500).json({
      success: false,
      message: axiosError instanceof Error ? axiosError.message : 'Unknown error'
    });
  }
});

// Books API routes
router.get('/books/popular', async (req, res) => {
  try {
    const response = await booksClient.get('/volumes', { 
      params: {
        q: 'subject:fiction',
        orderBy: 'relevance',
        maxResults: 20
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    const axiosError = error as AxiosError;
    res.status(axiosError.response?.status || 500).json({
      success: false,
      message: axiosError instanceof Error ? axiosError.message : 'Unknown error'
    });
  }
});

router.get('/books/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await booksClient.get('/volumes', { 
      params: {
        q: query,
        orderBy: 'relevance',
        maxResults: 20
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    const axiosError = error as AxiosError;
    res.status(axiosError.response?.status || 500).json({
      success: false,
      message: axiosError instanceof Error ? axiosError.message : 'Unknown error'
    });
  }
});

// Anime API routes
router.get('/anime/popular', async (req, res) => {
  try {
    const response = await animeClient.get('/top/anime');
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    const axiosError = error as AxiosError;
    res.status(axiosError.response?.status || 500).json({
      success: false,
      message: axiosError instanceof Error ? axiosError.message : 'Unknown error'
    });
  }
});

router.get('/anime/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await animeClient.get('/anime', { 
      params: { q: query }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    const axiosError = error as AxiosError;
    res.status(axiosError.response?.status || 500).json({
      success: false,
      message: axiosError instanceof Error ? axiosError.message : 'Unknown error'
    });
  }
});

export default router;