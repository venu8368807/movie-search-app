import React from 'react'
import HomePage from './Components/MovieSearchApp/Pages/HomePage';
import { Route,Routes } from 'react-router-dom';
import FavPage from './Components/MovieSearchApp/Pages/FavPage';
import NavBar from './Components/MovieSearchApp/NavBar';
import './Components/MovieSearchApp/CSS/App.css'
import { MovieProvider } from './Components/MovieSearchApp/contexts/MovieContext';


function App() {
  return (
    <>
    <MovieProvider>
      <NavBar></NavBar>
      <Routes>
        <Route path='/' element={<HomePage></HomePage>}></Route>
        <Route path='/favorites' element={<FavPage></FavPage>}></Route>
      </Routes>
    </MovieProvider>  
      
    </>  
      
  
  )
}

export default App;






