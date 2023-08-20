import React, { useState} from 'react';

import './Login.css';
import '../../assets/css/theme-rtl.min.css';
import '../../assets/css/theme.min.css';


export default function EnvoiMail() {
 
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
                                            <h3 className="text-1000">Récupérer mot de passe</h3>
                                            
                                        </div>
                                      
                                        
                                     
                                        <div className="mb-4 text-start">
                                            <div className="text-center mb-2">
                                              Votre demande de mot de passe a bien été prise en compte.
                                               Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe. 
                                               <div className="col-auto mt-3" ><a className="fs--1 fw-semi-bold" href="/">Revenir à la connexion</a>
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

