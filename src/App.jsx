import { useState } from 'react'

import Header from './components/Common/Header'
import Footer from './components/Common/Footer'
import Home from './Pages/Home'
import Contact from './Pages/Contact'
import Shop from './Pages/Shop'

function App() {


  return (
    <div>
      <Header />
      <Home />
      <Shop/>
      <Contact />
      <Footer />
    </div>
  )
}

export default App
