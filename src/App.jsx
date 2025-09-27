import React from 'react'
import HomePage from './Components/Movie Search App/Pages/HomePage';
import { Route,Routes } from 'react-router-dom';
import FavPage from './Components/Movie Search App/Pages/FavPage';
import NavBar from './Components/Movie Search App/NavBar';
import './Components/Movie Search App/CSS/App.css'
import { MovieProvider } from './Components/Movie Search App/contexts/MovieContext';


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






