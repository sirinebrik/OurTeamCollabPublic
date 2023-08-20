import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import { Link,useNavigate,useParams } from "react-router-dom"
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"
import "./Detail.css"
import Modal from 'react-bootstrap/Modal';
import { Checkbox } from 'pretty-checkbox-react';
import ActivitésChefProjet from "../../Activités/ActivitésChefProjet"

export default function DetailChefProjet({user,userRole}) {
  const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
    const [type,setType]= useState("Tous")
    const [chefProjet,setChefProjet]= useState([])
    const [info,setInfo]= useState([])
    const [role,setRole]= useState("")
    const [secteur,setSecteur]= useState([])
    const [errorP, setErrorP] = useState("");
    const [errorDP, setErrorDP] = useState("");
    const [error, setError] = useState("");
    const [errorD, setErrorD] = useState("");
    const [password, setPassword] = useState();
    const [resetpassword, setResetpassword] = useState();
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);
    const [passwordIsVisible1, setPasswordIsVisible1] = useState(false);
    const [showP, setShowP] = useState(false);
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [sexe, setSexe] = useState("");
    const [secteurCh, setSecteurCh] = useState("");
    const [secteurC, setSecteurC] = useState("");
    const [departement, setDepartement] = useState("");
    const [nomE, setNomE] = useState("");
    const [activé, setActivé] = useState("");
    const [secteurs,setSecteurs]= useState([])
    const [showU, setShowU] = useState(false);
    const [detailProjetsUser,setDetailProjetsUser]= useState([])
    const getDetailProjetsUser = (async () => {
        await Axios.get(`http://localhost:8000/detailProjetUser/${id}`).then((response)=>{
            setDetailProjetsUser(response.data.projet)})  
    });
     useEffect( () => {
          getDetailProjetsUser();
     },[]) ;
     const handleShowU = () => setShowU(true);
     const handleCloseU = () => {setShowU(false) }
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
    const handleShowP = () => setShowP(true);
    const handleCloseP = () => {setShowP(false);setPassword();setResetpassword();setErrorP("") }
    const handleShow = () => setShow(true);
    const handleClose = () => {setShow(false);setEmail(info.email);setNom(info.lastname) ;setError("");setPrenom(info.username);setSexe(info.sexe);setRole(info.roles[0]);
        setDepartement("");setSecteurCh(secteur.id);setSecteurC("");setNomE("");setActivé(info.etat)}
  
    const getChefProjet = (async () => {
         await Axios.get(`http://localhost:8000/detailChefProjet/${id}`,).then((response)=>{
           setChefProjet(response.data.chefProjet[0])
           setInfo(response.data.chefProjet[0].utilisateur)
           setRole(response.data.chefProjet[0].utilisateur.roles[0])
           setSecteur(response.data.chefProjet[0].secteur)
           setNom(response.data.chefProjet[0].utilisateur.lastname)
           setSecteurCh(response.data.chefProjet[0].secteur.id)
           setPrenom(response.data.chefProjet[0].utilisateur.username)
           setEmail(response.data.chefProjet[0].utilisateur.email)
           setSexe(response.data.chefProjet[0].utilisateur.sexe)
           setActivé(response.data.chefProjet[0].utilisateur.etat)
           setIsLoding(false);

          })  });
    useEffect( () => {getChefProjet(); },[]) ;

     const handleImage = async (file) => {
        const formData ={
      "photo":file[0]
    }
    
 try {
    const res = await Axios.post(
      `http://localhost:8000/changePhoto/${id}`,  formData,{
          headers: {
              "Content-Type": "multipart/form-data",
          }}
    );
  } catch (ex) {
}};

const updatePassword = async (e) => {
    e.preventDefault();
    const formData ={
      "password" : password,
      "resetpassword":resetpassword,
    }
    try {
      const res = await Axios.post(
        `http://localhost:8000/updatePassword/${id}`,
        formData,{
          headers: {
              "Content-Type": "multipart/form-data",
          }
      }
      );
      window.location= `./${id}`
   } catch (ex) {
      
      setErrorP(ex.response.data.danger)
      setErrorDP(ex.response.data.message)
  
    }};

    const changeOnClick = async (e) => {
        e.preventDefault();
        const formData ={
          "username" : prenom,
          "lastname":nom,
          "email":email,
          "sexe":sexe,
          "role":role,
          "departement":departement,
          "nomEntreprise":nomE,
          "secteur":secteurCh,
          "secteurC":secteurC,
          "etat":activé,
         
        }
        try {
          const res = await Axios.post(
            `http://localhost:8000/updateCh/${id}`,
            formData,{
              headers: {
                  "Content-Type": "multipart/form-data",
              }
          }
          );
          if(role==="ROLE_MEMBRE")window.location= `/profileM/${id}`
          if(role==="ROLE_CHEFPROJET")window.location= `./${id}`
          if(role==="ROLE_CLIENT")window.location= `/profileC/${id}`
       } catch (ex) {
          
          setError(ex.response.data.danger)
          setErrorD(ex.response.data.message)
      
        }
        
      };
  
return (
  <>
    {isLoding ? <div class="loading bar">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div> :
<div class="container-scroller">
    <Navbar/>
    <div class="container-fluid page-body-wrapper">
        <Sidebar/>
        <div class="main-panel">
            <div class="content-wrapper">
                <div class="row mb-4">
                    <div class="col-7"> 
                    </div>
                    <div class="col-5">
                       <div class="row">
                    {(userRole==="ROLE_ADMIN")&&(
                        <>
                            <div class="col-4">
                               <button type="button" className="btn pt-2 pb-2 "  onClick={handleShow} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}>Modifier le profil</button>
                            </div> 
                            <div class="col-4">
                               <button type="button" className="btn pt-2 pb-2 "   onClick={handleShowP} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}>Modifier le mot de passe</button>
                            </div>
                            <div class="col-4">
                               <button type="button" className="btn pt-2 pb-2 "   onClick={handleShowU} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}>Les droits d'accès</button>
                            </div> 
                             </>
                     )} 
                        {(userRole==="ROLE_CHEFPROJET")&&(user.id===info.id)&&(
                         <>
                           <div class="col-4">
                              <button type="button" className="btn pt-2 pb-2 "  onClick={handleShow} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}>Modifier mon profil</button>
                            </div> 
                            <div class="col-4">
                              <button type="button" className="btn pt-2 pb-2 "   onClick={handleShowP} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}>Modifier mon mot de passe</button>
                            </div> 
                            <div class="col-4">
                               <button type="button" className="btn pt-2 pb-2 "   onClick={handleShowU} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}>Mes droits d'accès</button>
                            </div> 
                            </>
                     )} 
                        </div> 
                    </div>
                </div>
                {user.id!==info.id&&
                <div class="row mt-8">
                    <div class="col-4"> 
                        <div class="card card-rounded border border-3">
                            <div class="card-body">
                                <center style={{marginTop:"50px"}}>
                                   
                                     
                                        {!info.photo  &&  <img class="rounded-circle"  src={require('../../../assets/img/logos/user.png')} width="100px" height="100px" alt="Profile image"/>} 
                                        {info.photo  && <img class="rounded-circle" src={require(`../../../assets/uploads/${info.photo}`)} width="100px" height="100px" alt=""/>} 
                                       
                                   <div class="mt-3 mb-8" style={{fontSize:"16px",fontWeight:"bold"}}>{info.username}  {info.lastname}</div>
                              
                                </center>
                               
                            </div> 
                        </div>
                    </div>
                    <div class="col-8">
                      
                       <div class="card card-rounded border border-3">
                            <div class="card-body">
                              <div class="mb-4" style={{fontSize:"14px",fontWeight:"bold",color:"#06868D"}}>
                                Informations Personnelles
                               </div>
                               <div class="row"> 
                                <div class="col-6">
                                   <div class="mb-1 mt-1" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Prénom</div>
                               </div>
                                <div class="col-6"> 
                                   <p  style={{color:"black"}}> <i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{info.username}</p>
                                </div>
                              </div>
                              <div class="row"> 
                                <div class="col-6">
                                   <div class="mb-1 mt-1" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Nom de famille</div>
                               </div>
                                <div class="col-6"> 
                                   <p  style={{color:"black"}}> <i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{info.lastname}</p>
                                </div>
                              </div>
                              <div class="row"> 
                                <div class="col-6">
                                   <div class="mb-1 mt-1" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Contact</div>
                               </div>
                                <div class="col-6"> 
                                   <p  style={{color:"black"}}> <i class=" me-1  fa fa-envelope" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{info.email}</p>
                                </div>
                              </div>
                              <div class="row"> 
                                <div class="col-6">
                                   <div class="mb-1 mt-1" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Sexe</div>
                               </div>
                                <div class="col-6"> 
                                {info.sexe==="femme" &&<p title="sexe" style={{color:"black"}}><i class=" me-1  fa fa-female" style={{fontSize:"13px",color:"#0B0A42"}}></i>Femme</p>}
                             {info.sexe==="homme" &&<p title="sexe" style={{color:"black"}}><i class=" me-1  fa fa-male" style={{fontSize:"13px",color:"#0B0A42"}}></i>Homme</p>}                                </div>
                              </div>
                              <div class="row"> 
                                <div class="col-6">
                                   <div class="mb-1 mt-1" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Rôle</div>
                               </div>
                                <div class="col-6"> 
                                <p title="rôle" style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Chef de projet</p>
                                  </div>
                              </div>
                              <div class="row"> 
                                <div class="col-6">
                                   <div class="mb-1 mt-1" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Secteur de projet</div>
                               </div>
                                <div class="col-6"> 
                                <p title="secteur" style={{color:"black",marginLeft:"6px" }}>{secteur.titre}</p>
                                  </div>
                              </div>
                              <div class="row"> 
                                <div class="col-6">
                                   <div class="mb-1 mt-1" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Compte</div>
                               </div>
                                <div class="col-6"> 
                                {info.etat===true && <span class="me-2" style={{fontSize:"13px",color:"#06868D",fontWeight:"bold"}}>Activée</span>} 
                                {info.etat===false && <span class="me-2" style={{fontSize:"13px",color:"red",fontWeight:"bold"}}>Désactivée</span>}                                  </div>
                              </div>
                            </div>
                        </div>
                      </div> 
                </div>}
                {user.id===info.id&&
                <div class="row ">
                    <div class="col-4"> 
                        <div class="card card-rounded border border-3">
                            <div class="card-body">
                                <center>
                                   
                                    <div class="profile-pic-wrapper">
                                        <div class="pic-holder">
                                            {!info.photo  &&  <img class="pic"  src={require('../../../assets/img/logos/user.png')} width="100px" height="100px" alt="Profile image"/>} 
                                             {info.photo  && <img class="pic" src={require(`../../../assets/uploads/${info.photo}`)} width="100px" height="100px" alt=""/>} 
                                            <input class="uploadProfileInput" type="file" name="profile_pic" id="newProfilePhoto" accept="image/*" style={{opacity: 0}}  onChange={e => {handleImage(e.target.files)}}   />
                                            <label for="newProfilePhoto" class="upload-file-block">
                                                <div class="text-center">
                                                    <div class="">
                                                        <i class="fa fa-camera fa-2x"></i>
                                                    </div>
                                                    <div class="text-uppercase">
                                                       Modifier <br /> Photo de Profil
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                     
                                   <div class="mt-3 mb-3" style={{fontSize:"16px",fontWeight:"bold"}}>{info.username}  {info.lastname}</div>
                              
                                </center>
                                <br/>
                                <div class="mb-1 mt-1" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Contact</div>
                                <p  style={{color:"black"}}> <i class=" me-1  fa fa-envelope" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{info.email}</p>
                              
                                <div class="mb-1 mt-3" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Sexe</div>
                             {info.sexe==="femme" &&<p title="sexe" style={{color:"black"}}><i class=" me-1  fa fa-female" style={{fontSize:"13px",color:"#0B0A42"}}></i>Femme</p>}
                             {info.sexe==="homme" &&<p title="sexe" style={{color:"black"}}><i class=" me-1  fa fa-male" style={{fontSize:"13px",color:"#0B0A42"}}></i>Homme</p>}
                             <div class="mb-1 mt-3" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Rôle</div>

                                <p title="rôle" style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Chef de projet</p>
                                <div class="mb-1 mt-3" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Secteur de projet</div>
                                <p title="secteur" style={{color:"black",marginLeft:"6px" }}>{secteur.titre}</p>
                                <div class="mb-1 mt-3" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Compte </div>
                                {info.etat===true && <span class="me-2" style={{fontSize:"13px",color:"#06868D",fontWeight:"bold"}}>Activée</span>} 
                                {info.etat===false && <span class="me-2" style={{fontSize:"13px",color:"red",fontWeight:"bold"}}>Désactivée</span>}
                            </div> 
                        </div>
                    </div>
                    <div class="col-8">
                       <div class="card card-rounded border border-3">
                            <div class="card-body" style={{maxHeight: "600px", "overflow-y": "auto"}} >
                              <div class="row">
                                  <div class="col-8">
                                     <div style={{fontSize:"14px",fontWeight:"bold",color:"#06868D"}}>
                                       Activités
                                    </div>
                                  </div>
                                  <div class="col-4">
                               <select value={type} style={{fontSize:"12px"}} onChange={ (e) => { setType(e.target.value)}}   class="form-select ">
                                   <option value="Tous" selected > Toutes les activités</option>
                                   <option value="projets" selected > Tous les projets</option>
                                   <option value="membres" selected > Tous les membres du projet</option>
                                   <option value="tâches" selected > Toutes les tâches</option>
                                   <option value="réunions" selected > Toutes les réunions</option>
                                </select> 
                                </div>
                            </div>
                               <ActivitésChefProjet id={id} type={type}/>
                            </div>
                        </div>
                      </div> 
                </div>}
            </div>
        </div>
    </div>
    <Modal show={show} size="xl">
        <Modal.Header  >
          <Modal.Title>Modifier le profil
                <button  onClick={handleClose}  class="btn" style={{ fontSize:"14px",fontWeight:"bold" ,padding:"2px"  ,paddingLeft:"930px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form  enctype="multipart/form-data"  onSubmit={changeOnClick}> 
            {error &&
                   <p className="fs-title mb-4" style={{"color":"red",textAlign:"center"}}> {error} </p>
                            }
                <div class="row">
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Prénom <span style={{color:"red"}}>*</span></label>
                            <input className="form-control  form-icon-input" name="username"  type="text" onChange={(e)=>setPrenom(e.target.value)} value={prenom}  placeholder='saisir son prenom' pattern=".{3,}" title="3 caractères ou plus"required="required"/>
                        </div>
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Nom <span style={{color:"red"}}>*</span></label>
                            <input className="form-control  form-icon-input" name="nom"  type="text" onChange={(e)=>setNom(e.target.value)} value={nom} pattern=".{3,}" title="3 caractères ou plus" placeholder='saisir son nom' required="required"/>
                        </div>
                    </div>
                </div>
                {userRole!=="ROLE_ADMIN" &&
                <div class="row">
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}} for="email">Adresse email <span style={{color:"red"}}>*</span></label>
                            <div className="form-icon-container">
                                <input className="form-control form-icon-input" name="email"  value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required="required"/>
                                <span className="fa fa-user text-900 fs--1 form-icon"></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Sexe <span style={{color:"red"}}>*</span></label>
                            <div class="mb-2" >
                                <input  className="form-check-input m-1 " type="radio" id="input1" value="homme" name="sexe"  onChange={(e)=>setSexe(e.target.value)}  checked={(sexe==="homme") &&true}  />
                                 <label class="form-check-label m-1" for="flexRadioDefault2">Homme</label>
                            </div>
                            <div class="" >
                                <input  className="form-check-input m-1" type="radio" id="input1" value="femme" name="sexe"  onChange={(e)=>setSexe(e.target.value)} checked={(sexe==="femme") &&true}/>
                                <label class="form-check-label  m-1" for="flexRadioDefault2">Femme</label>
                            </div>
                        </div>
                    </div>
                </div>}
                {userRole==="ROLE_ADMIN"&&
                <>
                 {(role==="ROLE_CLIENT")&&
                <div class="row">
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}} for="email">Adresse email <span style={{color:"red"}}>*</span></label>
                             <div className="form-icon-container">
                                <input className="form-control form-icon-input" name="email"  value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required="required"/>
                                 <span className="fa fa-user text-900 fs--1 form-icon"></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Activé <span style={{color:"red"}}>*</span></label>
                           <div class="mb-2" >
                               <input  className="form-check-input m-1 " type="radio" id="input1" value="true" name="activé"  onChange={(e)=>setActivé(true)}  checked={(activé===true) &&true}  />
                               <label class="form-check-label m-1" for="flexRadioDefault2">Oui</label>
                           
                               <input  className="form-check-input m-1 ms-4" type="radio" id="input1" value="false" name="activé"  onChange={(e)=>setActivé(false)} checked={(activé===false) &&true}/>
                               <label class="form-check-label  m-1" for="flexRadioDefault2">Non</label>
                            </div>
                        </div>
                    </div>
                </div>}
                {(role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}} for="email">Adresse email <span style={{color:"red"}}>*</span></label>
                    <div className="form-icon-container">
                       <input className="form-control form-icon-input" name="email"  value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required="required"/>
                       <span className="fa fa-user text-900 fs--1 form-icon"></span>
                    </div>
                </div>}
               
                <div class="row">
                    <div class="col-6">
                        <div className="mb-3 text-start "><label className="form-label" style={{color:"#06868D"}} >Rôle <span style={{color:"red"}}>*</span></label>
                            <div class="mb-2 ">
                               <input className="form-check-input m-1" type="radio" id="input1" value="ROLE_CHEFPROJET" name="role"  onChange={(e)=>setRole(e.target.value)} checked={(role==="ROLE_CHEFPROJET") &&true }/>
                               <label class="form-check-label m-1" for="flexRadioDefault2"> Chef de projet</label>
                            </div>
                            <div class="mb-2">
                               <input className="form-check-input m-1" type="radio" id="input1" value="ROLE_MEMBRE" name="role"  onChange={(e)=>setRole(e.target.value)}  checked={(role==="ROLE_MEMBRE") &&true }/>
                               <label class="form-check-label m-1" for="flexRadioDefault2"> Membre</label>
                            </div>
                            <div class="mb-2">
                               <input className="form-check-input m-1" type="radio" id="input1" value="ROLE_CLIENT" name="role"  onChange={(e)=>setRole(e.target.value)} checked={(role==="ROLE_CLIENT") &&true }/>
                               <label class="form-check-label m-1" for="flexRadioDefault2">  Client</label>
                            </div>
                        </div> 
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Sexe <span style={{color:"red"}}>*</span></label>
                            <div class="mb-2" >
                                <input  className="form-check-input m-1 " type="radio" id="input1" value="homme" name="sexe"  onChange={(e)=>setSexe(e.target.value)}  checked={(sexe==="homme") &&true}  />
                                 <label class="form-check-label m-1" for="flexRadioDefault2">Homme</label>
                            </div>
                            <div class="" >
                                <input  className="form-check-input m-1" type="radio" id="input1" value="femme" name="sexe"  onChange={(e)=>setSexe(e.target.value)} checked={(sexe==="femme") &&true}/>
                                <label class="form-check-label  m-1" for="flexRadioDefault2">Femme</label>
                            </div>
                        </div>
                    </div>
                </div></>}
                    {(role==="ROLE_CLIENT")&&(
                        <>
                        <div class="row">
                            <div class="col-6">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Nom de l'entreprise <span style={{color:"red"}}>*</span></label>
                                   <input className="form-control  form-icon-input" name="nomE"  type="text" onChange={(e)=>setNomE(e.target.value)} placeholder="saisir nom de l'entreprise" required="required"/>
                                </div>
                            </div>
                            <div class="col-6">
                               <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le secteur d'activité <span style={{color:"red"}}>*</span></label>
                                   <select value={secteurC} required onChange={ (e) =>  setSecteurC(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                                       <option value="" selected disabled> Choisir le secteur</option>
                                {
                                  secteurs.map((item,index)=>(
                                    <option   key={item.id} value={item.id}>{item.titre}</option>
                                    )) }
                                    </select> 
                                </div>
                            </div>
                        </div>
                        </>
                        )}
                                    {(role==="ROLE_CHEFPROJET")&&(
                                          <>
                        <div class="row">
                        {userRole==="ROLE_ADMIN"&&<>
                            <div class="col-6">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le secteur de projet <span style={{color:"red"}}>*</span></label>
                                     <select value={secteurCh} required onChange={ (e) =>  setSecteurCh(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                                       
                                {
                                  secteurs.map((item,index)=>(
                                    <option   key={item.id} value={item.id} selected={item.id===secteurCh &&"selected"}>{item.titre}</option>
                                    )) }
                                    </select> 
                                </div>
                            </div>
                            <div class="col-6">
                            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Activé <span style={{color:"red"}}>*</span></label>
                               <div class="mb-2" >
                                 <input  className="form-check-input m-1 " type="radio" id="input1" value="true" name="activé"  onChange={(e)=>setActivé(true)}  checked={(activé===true) &&true}  />
                                 <label class="form-check-label m-1" for="flexRadioDefault2">Oui</label>
                              
                                 <input  className="form-check-input m-1 ms-4" type="radio" id="input1" value="false" name="activé"  onChange={(e)=>setActivé(false)} checked={(activé===false) &&true}/>
                                 <label class="form-check-label  m-1" for="flexRadioDefault2">Non</label>
                               </div>
                            </div>
                          </div></>}
                        </div>
                                          </>)}
                                     {(role==="ROLE_MEMBRE")&&(
                                          <>
                       <div class="row">
                     
                        <>
                          <div class="col-6">
                            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le département <span style={{color:"red"}}>*</span></label>
                              <select value={departement} required onChange={ (e) =>  setDepartement(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                                 <option value="" selected disabled> Choisir le département</option>
                                 <option   value="Développement">Développement</option>
                                 <option   value="Test">Test</option>
                                 <option   value="Marketing | Communication">Marketing | Communication</option>
                                 <option   value="Manager">Manager</option>
                                 <option   value="Design">Design</option>
                                 <option   value="Comptabilité | Finance">Comptabilité | Finance</option>
                                 <option   value="Logistique">Logistique</option>
                                 <option   value="Autre">Autre</option>
                              </select> 
                            </div>
                          </div>
                          <div class="col-6">
                            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Activé <span style={{color:"red"}}>*</span></label>
                               <div class="mb-2" >
                                 <input  className="form-check-input m-1 " type="radio" id="input1" value="true" name="activé"  onChange={(e)=>setActivé(true)}  checked={(activé===true) &&true}  />
                                 <label class="form-check-label m-1" for="flexRadioDefault2">Oui</label>
                               
                                 <input  className="form-check-input m-1 ms-4" type="radio" id="input1" value="false" name="activé"  onChange={(e)=>setActivé(false)} checked={(activé===false) &&true}/>
                                 <label class="form-check-label  m-1" for="flexRadioDefault2">Non</label>
                               </div>
                            </div>
                          </div></>
                        
                        </div></>)}
                        
                <div class="mt-4" style={{ textAlign:"right" }}>
                   
                    <button type="submit" class="btn"  disabled={(!sexe ||!nom||!prenom||!email) &&"disabled" }   style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                       Modifier
                    </button>
                </div>
            </form>
        </Modal.Body>
    </Modal>
    <Modal show={showP} >
        <Modal.Header  >
          <Modal.Title>Modifier mon mot de passe
          <button  onClick={handleCloseP}  class="btn" style={{ fontSize:"14px",fontWeight:"bold" ,padding:"2px"  ,paddingLeft:"200px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form  enctype="multipart/form-data"  onSubmit={updatePassword}> 
            {errorP &&
                               <p className="fs-title mb-4" style={{"color":"red",textAlign:"center"}}> {errorP} </p>
                            }
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
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"  disabled={(!password ||!resetpassword) &&"disabled" }   style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                       Modifier
                    </button>
                </div>
            </form>
        </Modal.Body>
    </Modal>
    <Modal show={showU} size="xl">
        <Modal.Header  >
          <Modal.Title>Les droits d'accès
          <button  onClick={handleCloseU}  class="btn" style={{ fontSize:"14px",fontWeight:"bold" ,padding:"2px"  ,paddingLeft:"920px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Projet</th>
                          <th> </th>
                          <th> </th>
                          <th> </th>
                          <th> </th>
                          <th> </th>
                          <th>Chef de Projet</th>
                          <th>Membre</th>
                          <th>Client</th>
                        </tr>
                      </thead>
                      <tbody  >
                     { detailProjetsUser.map((item,index)=>(
                        <tr  >
                          <td ><div class="ms-4">{item.projet.nom}</div></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                          {((item.user.roles[0])==="ROLE_CHEFPROJET"&&item.role==="chefProjet")&&
                              <div class="form-check" style={{marginLeft:"40px",marginTop:"0px",marginBottom:"0px"}} >
                                <Checkbox key={index}  checked={true} />
                              </div>}
                              {((item.user.roles[0])==="ROLE_MEMBRE"&&item.role==="chefProjet")&&
                              <div class="form-check" style={{marginLeft:"40px",marginTop:"0px",marginBottom:"0px"}} >
                                <Checkbox key={index}  checked={true} />
                              </div>}
                              
                          </td>
                          <td> {((item.user.roles[0])==="ROLE_MEMBRE"&&item.role==="membre")&&
                              <div class="form-check" style={{marginLeft:"20px",marginTop:"0px",marginBottom:"0px"}} >
                                <Checkbox key={index}  checked={true} />
                              </div>}
                          </td>
                          <td>
                          {item.role==="client"&&
                              <div class="form-check" style={{marginLeft:"16px",marginTop:"0px",marginBottom:"0px"}}> 
                                <Checkbox key={index}  checked={true} />
                              </div>}
                          </td>
                        </tr>))}
                      </tbody>
                    </table>
                  </div>
          </Modal.Body>
    </Modal>
</div>}
</>


       )
}

  

