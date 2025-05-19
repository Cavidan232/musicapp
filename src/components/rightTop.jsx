import React from 'react'
import { FaList } from 'react-icons/fa'
function rightTop() {
  return (
    <div className='right-top'>
        <div className="rigt-left">
            <input type="search"id='search' placeholder='search' />
        </div>
         <div className="right-left2">
          <FaList/>
            <h2>Artlist</h2>
        </div>
        <div className="right-button">
            <button>Start Free Now</button>
            <span>Business</span>
            <span>Pricing</span>
            <span>Sign inin</span>
        </div>
    </div>
  )
}

export default rightTop