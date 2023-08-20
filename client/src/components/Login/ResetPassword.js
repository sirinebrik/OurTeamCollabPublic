import React, { useState} from 'react';

import './Login.css';
import '../../assets/css/theme-rtl.min.css';
import '../../assets/css/theme.min.css';
import { useParams } from "react-router-dom"
import Axios from 'axios'

export default function ResetPassword() {

  const [password, setPassword] = useState();
  const [resetpassword, setResetpassword] = useState();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [passwordIsVisible1, setPasswordIsVisible1] = useState(false);
  const [error, setError] = useState("");
  const { token} = useParams()
  let button;
  let button1;
//password
 if (password){
    if (passwordIsVisible){button=<i type="button" onClick={()=>setPasswordIsVisible(!passwordIsVisible)}  className="fa fa-eye form-icone" style={{fontSize:"13.2px"}}></i>}
    else{button= <i type="button" onClick={()=>setPasswordIsVisible(!passwordIsVisible)} className="fa fa-eye-slash form-icone" style={{fontSize:"13.2px"}}></i>}
  }
 if (resetpassword){
    if (passwordIsVisible1){button1=<i type="button" onClick={()=>setPasswordIsVisible1(!passwordIsVisible1)}  className="fa fa-eye form-icone" style={{fontSize:"13.2px"}}></i>}
    else{button1= <i type="button" onClick={()=>setPasswordIsVisible1(!passwordIsVisible1)} className="fa fa-eye-slash form-icone" style={{fontSize:"13.2px"}}></i>}
  }
  const changeOnClick = async (e) => {
    e.preventDefault();
   try {
      const res = await Axios.post(
        `http://localhost:8000/resetPassword/${token}/${password}/${resetpassword}`
      );
     window.location='/'
    } catch (ex) {
        setError(ex.response.data.danger)
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
                                        <div className="text-center mb-4">
                                            <img className=" mb-3 " src={require('../../assets/img/logos/logo.png')} alt="" height="88" width="160"/>     
                                            <h3 className="text-1000">Réinitialiser votre mot de passe</h3>
                                             <p className="text-700">Tapez votre nouveau mot de passe</p>
                                        </div>
                                        <form encType="multipart/form-data"  onSubmit={changeOnClick}>
                                        <p className="fs-title mb-4" style={{"color":"red"}}>
                                          {error }
                                        </p>
                                     
                                        <div className="mb-4 text-start"><label className="form-label" style={{color:"#06868D"}}>Nouveau mot de passe <span style={{color:"red"}}>*</span></label>
                                            <div className="form-icon-container ">
                                                <input className="form-control  form-icon-input" name="password" onChange={(e)=>setPassword(e.target.value)} type={passwordIsVisible? "text" :"password"} placeholder="Nouveau mot de passe"  pattern=".{8,}" title="8 caractères ou plus" required="required"/>
                                                <i className="fa fa-key text-900 fs--1 form-icon"></i>
                                                 {button}
                                           </div>
                                        </div>
                                        <div className="mb-4 text-start"><label className="form-label" style={{color:"#06868D"}}>Mot de passe (Confirmation) <span style={{color:"red"}}>*</span></label>
                                            <div className="form-icon-container ">
                                                <input className="form-control  form-icon-input" name="resetpassword" onChange={(e)=>setResetpassword(e.target.value)} type={passwordIsVisible1? "text" :"password"}  pattern=".{8,}" title="8 caractères ou plus" placeholder="Confirmer le nouveau mot de passe" required="required"/>
                                                <i className="fa fa-key text-900 fs--1 form-icon"></i>
                                                  {button1}
                                           </div>
                                        </div>
                                       <button type="submit" className="btn w-80" style={{backgroundColor:"#06868D" , color:"white" ,fontSize:"14px"}}>Réinitialiser le mot de passe</button>
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

