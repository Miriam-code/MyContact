import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import RoutesApp from './RoutesApp.jsx';

function App() {

  return (
    <>
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<RoutesApp />} />
        </Routes>
      </BrowserRouter>
    </>
      
    </>
  )
}

export default App
