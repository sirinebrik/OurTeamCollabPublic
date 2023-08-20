import React, { useState} from 'react';
import './Login.css';
import '../../assets/css/theme-rtl.min.css';
import '../../assets/css/theme.min.css';
import Axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [errorD, setErrorD] = useState("");
  
  let button;
//password
if (password){
  
    if (passwordIsVisible){button=<i type="button" onClick={()=>setPasswordIsVisible(!passwordIsVisible)}  className="fa fa-eye form-icone" style={{fontSize:"13.2px"}}></i>}
    else{button= <i type="button" onClick={()=>setPasswordIsVisible(!passwordIsVisible)} className="fa fa-eye-slash form-icone" style={{fontSize:"13.2px"}}></i>}
  }
  const changeOnClick = async (e) => {
    e.preventDefault();
    const formData = {
       "password":password,
       "username":email}
    
   
    try {
      const res = await Axios.post(
        "http://localhost:8000/login",
        formData
      );
    
     window.location='/dashboard'
      localStorage.setItem("token", res.data.token)
     
    } catch (ex) {
      
      setError(ex.response.data.error)
      setErrorD(ex.response.data.message)
  
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
                                            <img className=" mb-2 " src={require('../../assets/img/logos/logo.png')} alt="" height="88" width="160"/>     
                                            <h3 className="text-1000">Connexion</h3>
                                             <p className="text-700">Accédez à votre compte</p>
                                        </div>
                                        <form encType="multipart/form-data"  onSubmit={changeOnClick}>
                                        <p className="fs-title" style={{"color":"red"}}>
                                          
                                            {error && <div>Email et / ou mot de passe incorrect(s)</div>}
                                            {errorD}
                                            
                                        </p>
                                     
                                        <div className="mb-3 text-start"><label className="form-label" for="email">Adresse email</label>
                                            <div className="form-icon-container">
                                                <input className="form-control form-icon-input" name="email" onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="name@example.com" required="required"/>
                                                <span className="fa fa-user text-900 fs--1 form-icon"></span>
                                             </div>
                                        </div>
                                        <div className="mb-4 text-start"><label className="form-label">Mot de passe</label>
                                            <div className="form-icon-container ">
                                                <input className="form-control  form-icon-input" name="password" onChange={(e)=>setPassword(e.target.value)} type={passwordIsVisible? "text" :"password"} placeholder="Mot de passe" required="required"/>
                                                <i className="fa fa-key text-900 fs--1 form-icon"></i>
                                                
                                                {button}
                                               
                                            </div>
                                        </div>
                                       <button type="submit" className="btn w-80" style={{backgroundColor:"#06868D" , color:"white" ,fontSize:"14px"}}>Se connecter</button>
                                       <div className="col-auto"><a className="fs--1 fw-semi-bold" href="/forgotPassword">Mot de passe oublié ?</a>
                                        </div>
                                      </form>
                                      <div className="col-auto" style={{fontSize:"13px"}}>Pas encore de compte ? <a className="fs--1 fw-semi-bold" href="/inscrireOrganisation">Rendez-vous ici.</a>
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

