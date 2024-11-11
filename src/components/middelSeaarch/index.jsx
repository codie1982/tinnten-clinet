import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
export default function MiddelSearch() {
  return (
    <section className="d-flex align-items-center justify-content-center min-vh-100">
    <div className="middel-section">
     <div className="">
       <h1>Search Services and Products</h1>
     </div>
     <div className='main-search-section-container'>
     <div className="main-search-section">
       <input type="text" placeholder="Search a product or service" />
       <div className="main-search-button" >
         <span>
           <FontAwesomeIcon icon={faMagnifyingGlass} />
         </span>
       </div>

     </div>
     <div className="main-sample-section">
     <ul className="main-sample-list">
         <li className="main-sample-item">
           <div className="main-sample-section">1. Product</div>
         </li>
         <li className="main-sample-item">
           <div className="main-sample-section">2. Product</div>
         </li>
         <li className="main-sample-item">
           <div className="main-sample-section">3. Product</div>
         </li>
         <li className="main-sample-item">
           <div className="main-sample-section">4. Product</div>
         </li>
       </ul>
     </div>

     </div>
     
    
    </div>
  </section>
  )
}
