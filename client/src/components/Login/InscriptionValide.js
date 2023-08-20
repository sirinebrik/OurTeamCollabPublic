import React, { useState} from 'react';

import './Login.css';
import '../../assets/css/theme-rtl.min.css';
import '../../assets/css/theme.min.css';


export default function InsciptionValide() {
 
   return(
    <main className="main" id="top" style={{backgroundColor:"#5F9E9E"}}>
        <div className="container-fluid px-0" data-layout="container">
             <div className="container-fluid">
                 <div className="row flex-center" >
                     <div className="col-sm-2 col-xl-4 ">
                        <img style={{marginBottom:"212px"}} src={require('../../assets/img/bg/img.png')} alt="" height="500" width="500" />
                    </div>
                    <div className="col-sm-8 col-xl-4">
                        <div className="card  auth-card p-3 mb-5 bg-white rounded-lg" style={{marginTop:"35px", boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset"}}>
                             <div className="card-body pe-md-0">
                                <div className="row ">
                                   <div >
                                        <div className="text-center mb-5">
                                            <img className=" mb-3 " src={require('../../assets/img/logos/logo.png')} alt="" height="88" width="160"/>     
                                            <h3 className="text-1000">Validation d'inscription</h3>
                                            
                                        </div>
                                      
                                        
                                     
                                        <div className="mb-4 text-start">
                                            <div className="text-center mb-2">
                                            Votre compte est crée, vous pouvez à présent vous connecter.
                                               <div className="col-auto mt-3" ><a className="fs--1 fw-semi-bold" href="/">Aller à la page de connexion</a>
                                               </div>
                                           </div>
                                         
                                        </div>
                                     
                                   
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2 col-xl-4">
                        <div style={{marginTop:"250px"}}>
                            <img src={require('../../assets/img/bg/img1.png')} alt="" height="450" width="450" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

  </main>
  )
}

