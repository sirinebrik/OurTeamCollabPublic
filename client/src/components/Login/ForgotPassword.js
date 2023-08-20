import React, { useState} from 'react';
import './Login.css';
import '../../assets/css/theme-rtl.min.css';
import '../../assets/css/theme.min.css';
import Axios from 'axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState();
  const [error, setError] = useState("");
  
  const changeOnClick = async (e) => {
    e.preventDefault();
   
    try {
      const res = await Axios.post(
        `http://localhost:8000/forgotPassword/${email}`
      );
    
     window.location='/envoiMail'
    } catch (ex) {
     setError("Cette adresse mail est inconnue.")
    }
    
  };
  
 
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
                                            <img className=" mb-3" src={require('../../assets/img/logos/logo.png')} alt="" height="88" width="160"/>     
                                            <h3 className="text-1000">Vous avez oublié votre mot de passe ?</h3>
                                             <p className="text-700">Entrez votre e-mail ci-dessous et nous vous enverrons un lien de réinitialisation</p>
                                        </div>
                                        <form encType="multipart/form-data"  onSubmit={changeOnClick}>
                                        <p className="fs-title" style={{"color":"red"}}>
                                           {error}
                                        </p>
                                     
                                        <div className="mb-3 text-start"><label className="form-label" for="email">Adresse email</label>
                                            <div className="form-icon-container">
                                                <input className="form-control form-icon-input" name="email" onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="name@example.com" required="required"/>
                                                <span className="fa fa-user text-900 fs--1 form-icon"></span>
                                             </div>
                                        </div>
                                        
                                       <button type="submit" className="btn w-80" style={{backgroundColor:"#06868D" , color:"white" ,fontSize:"14px"}}>Envoyer</button>
                                       <div className="col-auto"><a className="fs--1 fw-semi-bold" href="/">Revenir à la connexion</a></div>

                                       
                                      </form>
                                   
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

