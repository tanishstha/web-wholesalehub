import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const NotFuond = () => {
  return (
    <div>
        <Navbar/>
          <div className='not__found'>
              <p>Page Not Found</p>
              <Link to='..'>Go back</Link>

          </div>
        <Footer/>
    </div>
  )
}

export default NotFuond