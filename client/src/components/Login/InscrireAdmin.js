import React, { useState,useEffect} from 'react';
import './Login.css';
import '../../assets/css/theme-rtl.min.css';
import '../../assets/css/theme.min.css';
import Axios from 'axios'
import { useParams } from "react-router-dom"
import jwt_decode from "jwt-decode";


export default function InscrireAdmin() {
  
  const [error, setError] = useState("");
  const [errorD, setErrorD] = useState("");
 
  const [email, setEmail] = useState("");
  const [ nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [sexe, setSexe] = useState("");
  const [nomE, setNomE] = useState("");
  const [secteurC, setSecteurC] = useState("");
  
  const [photo, setPhoto] = useState("");
  const [secteurs,setSecteurs]= useState([])
  const [password, setPassword] = useState();
  const [resetpassword, setResetpassword] = useState();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [passwordIsVisible1, setPasswordIsVisible1] = useState(false);
  const [valide, setValide] = useState("");

  const getSecteurs = (async () => {
    await Axios.get("http://localhost:8000/secteur").then((response)=>{
       setSecteurs(response.data.secteur)})  
});
 useEffect( () => {
      getSecteurs();
 },[]) ;
  

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
 const handleImage = (file) => {
  setPhoto(file[0]);
};

  const changeOnClick = async (e) => {
    e.preventDefault();
    const formData ={
      "username" : prenom,
      "lastname":nom,
      "email":email,
      "sexe":sexe,
      "nomOrganisation":nomE,
      "secteurC":secteurC,
      "password":password,
      "resetpassword":resetpassword,
      "photo":photo
    }
    
   
    try {
      const res = await Axios.post(
        "http://localhost:8000/organisation",
        formData,{
          headers: {
              "Content-Type": "multipart/form-data",
          }
      }
      );
    
      window.location='/inscriptionValide'
     
     
    } catch (ex) {
      
      setError(ex.response.data.danger)
      setErrorD(ex.response.data.message)
  
    }
    
  };
  
 
return(
    <main className="main" id="top" style={{backgroundColor:"#5F9E9E"}}>
      <div className="container-fluid px-0" data-layout="container">
        <div className="container-fluid">
          <div className="row flex-center" >
      
            <div className="col-sm-8 col-xl-6">
              <div className="card  auth-card p-3 mb-3 bg-white rounded-lg" style={{marginTop:"35px", boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset"}}>
                <div className="card-body pe-md-0">
                  <div className="row ">
                    <div >
                      <div className="text-center mb-4">
                        <img className=" mb-2 " src={require('../../assets/img/logos/logo.png')} alt="" height="88" width="160"/>     
                        <h3 className="text-1000">Création de votre compte</h3>
                      </div>
                      <form encType="multipart/form-data"  onSubmit={changeOnClick}>
                        <p className="fs-title" style={{"color":"red"}}>
                            {error }
                        </p>
                        <div class="row">
                          <div class="col-6">
                            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Prénom <span style={{color:"red"}}>*</span></label>
                              <input className="form-control  form-icon-input" name="username"  type="text" onChange={(e)=>setPrenom(e.target.value)}   placeholder='saisir le prenom' pattern=".{3,}" title="3 caractères ou plus"required="required"/>
                            </div>
                          </div>
                          <div class="col-6">
                            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Nom <span style={{color:"red"}}>*</span></label>
                              <input className="form-control  form-icon-input" name="nom"  type="text" onChange={(e)=>setNom(e.target.value)}  pattern=".{3,}" title="3 caractères ou plus" placeholder='saisir le nom' required="required"/>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <div className="mb-3 text-start"><label className="form-label" for="email">Adresse email <span style={{color:"red"}}>*</span></label>
                                <input className="form-control form-icon-input" name="email"  onChange={(e)=>setEmail(e.target.value)} type="email" required="required" placeholder='saisir le mail'/>
                            </div>
                          </div>
                
                        </div>
                        <div class="row">

                          <div class="col-6">
                            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Sexe <span style={{color:"red"}}>*</span></label>
                              <div class="mb-2" >
                                 
                                           
                                <input  className="form-check-input  " type="radio" id="input1" value="homme" name="sexe"  onChange={(e)=>setSexe(e.target.value)} />
                                <label class="form-check-label me-3" for="flexRadioDefault2">Homme</label>
      
                                    
                                <input  className="form-check-input " type="radio" id="input1" value="femme" name="sexe"  onChange={(e)=>setSexe(e.target.value)} />
                                            
                                <label class="form-check-label  me-3" for="flexRadioDefault2">Femme</label>
                              </div>
                            </div>
                          </div>
                                    <div class="col-6">
                            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Photo de profile </label>
                              <div class="mb-2" >
                                <input className="form-control" accept="image/*" type="file" id="photo"  name="photo" onChange={e => handleImage(e.target.files)} />
                              </div>
                            </div>
                          </div>
                        </div>
                                    
                                          
                        <div class="row">
                          <div class="col-6">
                            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Nom de l'organisation <span style={{color:"red"}}>*</span></label>
                              <input className="form-control  form-icon-input" name="nomE"  type="text" onChange={(e)=>setNomE(e.target.value)}  placeholder="saisir nom de l'entreprise" required="required" pattern=".{3,}" title="3 caractères ou plus"/>
                            </div>
                          </div>
                          <div class="col-6">
                            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le secteur d'activité <span style={{color:"red"}}>*</span></label>
                              <select  required onChange={ (e) =>  setSecteurC(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                              <option   value="" selected disabled>Choisir le secteur d'activité</option>

                                                     {secteurs.map((item,index)=>(
                                <option   key={item.id} value={item.id} >{item.titre}</option>
                                                    )) }
                              </select> 
                            </div>
                          </div>
                        </div>
                                       
                        <div class="row">
                          <div class="col-6">
                            <div className="mb-3 text-start"><label className="form-label">Mot de passe <span style={{color:"red"}}>*</span></label>
                              <div className="form-icon-container ">
                                <input className="form-control  form-icon-input" name="password" onChange={(e)=>setPassword(e.target.value)} type={passwordIsVisible? "text" :"password"} placeholder="Nouveau mot de passe"  pattern=".{8,}" title="8 caractères ou plus" required="required"/>
                                <i className="fa fa-key text-900 fs--1 form-icon"></i>
                                                       {button}
                              </div>
                            </div>
                          </div>
                          <div class="col-6">
                            <div className="mb-4 text-start"><label className="form-label">Mot de passe de confirmation <span style={{color:"red"}}>*</span></label>
                              <div className="form-icon-container ">
                                <input className="form-control  form-icon-input" name="resetpassword" onChange={(e)=>setResetpassword(e.target.value)} type={passwordIsVisible1? "text" :"password"}  pattern=".{8,}" title="8 caractères ou plus" placeholder="Confirmer le nouveau mot de passe" required="required"/>
                                <i className="fa fa-key text-900 fs--1 form-icon"></i>
                                                     {button1}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button type="submit" class="btn"   disabled={(!nom||!prenom||!password||!resetpassword) && "disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                                              S'inscrire
                        </button>                                      
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

