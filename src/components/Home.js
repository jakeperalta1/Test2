import React from 'react';
import LeftImage from '../peoplebank.jpg'
import '../App.css'

const Home = () => {
  return (
    <div>
        <div className='container'>
            <div className='row'>

                <div className='hero-left col-md-6'>
                    <h2>Welcome to <span className='hero-logo'>TASHI BANK</span></h2>
                    <p>From everyday banking to credit cards, find ways to save money and make real financial progress.</p>
                    <button className="hero-button cbtn btn-primary">Open Account With Us</button>
                </div>
                <div className='col-md-6'>
                <img src={LeftImage} className="myImage"/>
                </div>
            </div>

            <BodyArea/>


            
           
        </div>
      
    </div>
  );
};


const BodyArea = () => {
    return (
       
            <div className='row'>

            

                <div className='body-content col-md-4'>

                    <h3>Chequing Account</h3>
                    <p>With a checking account, you can deposit and withdraw money easily through various channels, including ATMs, online banking, mobile apps, and bank branches. This accessibility ensures that your funds are always within reach whenever you need them</p>

                </div>

            <div className='body-content col-md-4'>

            <h3>Saving Account</h3>
            <p>With a chequing account, you can deposit and withdraw money easily through various channels, including ATMs, online banking, mobile apps, and bank branches. This accessibility ensures that your funds are always within reach whenever you need them</p>

            </div>

            <div className='body-content col-md-4'>

            <h3>Current Account</h3>
            <p>With a chequing account, you can deposit and withdraw money easily through various channels, including ATMs, online banking, mobile apps, and bank branches. This accessibility ensures that your funds are always within reach whenever you need them</p>

            </div>

          


            </div>

       
    );
}

export default Home;
