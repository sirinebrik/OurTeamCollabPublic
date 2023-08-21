import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import { Link,useNavigate,useParams } from "react-router-dom"
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"
import  "./Detail.css"
import Modal from 'react-bootstrap/Modal';
import ActivitésAdmin from "../../Activités/ActivitésAdmin"


export default function DetailAdmin({user,userRole}) {
    const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
    const [admin,setAdmin]= useState([])
    const [type,setType]= useState("Tous")
    const [error, setError] = useState("");
    const [errorD, setErrorD] = useState("");
    const [errorP, setErrorP] = useState("");
    const [errorDP, setErrorDP] = useState("");
    const [role,setRole]= useState("")
    const [secteur,setSecteur]= useState([])
    const [organisation,setOrganisation]= useState([])
    const [show, setShow] = useState(false);
    const [showP, setShowP] = useState(false);
    const [email, setEmail] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [sexe, setSexe] = useState("");
    const [password, setPassword] = useState();
    const [resetpassword, setResetpassword] = useState();
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);
    const [passwordIsVisible1, setPasswordIsVisible1] = useState(false);
    const [secteurs,setSecteurs]= useState([])
    const [secteurC, setSecteurC] = useState("");
    const [nomE, setNomE] = useState("");

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
    const handleShow = () => setShow(true);
    const handleClose = () => {setShow(false);setEmail(admin.email);setError('');setNom(admin.lastname) ;setPrenom(admin.username);setSexe(admin.sexe)}
    const handleShowP = () => setShowP(true);
    const handleCloseP = () => {setShowP(false);setPassword();setResetpassword() ;setErrorP('')}
    const getAdmin = (async () => {
          await Axios.get(`http://localhost:8000/detailAdmin/${id}`,).then((response)=>{
           setAdmin(response.data.admin[0])
           setNom(response.data.admin[0].lastname)
           setPrenom(response.data.admin[0].username)
           setEmail(response.data.admin[0].email)
           setSexe(response.data.admin[0].sexe)
           setRole(response.data.admin[0].roles[0])
           setOrganisation(response.data.admin[0].organisation)
           setSecteurC(response.data.admin[0].organisation.secteur.id)
           setSecteur(response.data.admin[0].organisation.secteur)
           setNomE(response.data.admin[0].organisation.nom)

           setIsLoding(false);
        })  });
        useEffect( () => {getAdmin(); },[]) ;
   
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

 const changeOnClick = async (e) => {
    e.preventDefault();
    const formData ={
      "username" : prenom,
      "lastname":nom,
      "email":email,
      "sexe":sexe,
      "nomEntreprise":nomE,
      "secteurC":secteurC,}
    try {
      const res = await Axios.post(
        `http://localhost:8000/updateA/${id}`,
        formData,{
          headers: {
              "Content-Type": "multipart/form-data",
          }
      }
      );
      window.location= `./${id}`
   } catch (ex) {
      setError(ex.response.data.danger)
      setErrorD(ex.response.data.message)}};

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
      setErrorDP(ex.response.data.message)}};

      
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
                           <div class="col-4">
                            </div>
                    {(userRole==="ROLE_ADMIN")&&(
                            <div class="col-4">
                               <button type="button" className="btn pt-2 pb-2 "  onClick={handleShow} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}>Modifier mon profil</button>
                            </div> 
                     )} 
                    {(userRole==="ROLE_ADMIN")&&(
                            <div class="col-4">
                                <button type="button" className="btn pt-2 pb-2 "   onClick={handleShowP} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}>Modifier mon mot de passe</button>
                            </div> 
                     )} 
                        </div>
                    </div>
                </div>
                <div class="row ">
                    <div class="col-4"> 
                        <div class="card card-rounded border border-3">
                            <div class="card-body">
                               <center>
                                    <div class="profile-pic-wrapper">
                                        <div class="pic-holder">
                                            {!admin.photo  &&  <img class="pic"  src={require('../../../assets/img/logos/user.png')} width="100px" height="100px" alt="Profile image"/>} 
                                            {admin.photo  && <img class="pic" src={require(`../../../assets/uploads/${admin.photo}`)} width="100px" height="100px" alt=""/>} 
                                            <input class="uploadProfileInput" type="file" name="profile_pic" id="newProfilePhoto" accept="image/*" style={{opacity: 0}}  onChange={e => handleImage(e.target.files)}   />
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
                                    <div class="mt-3 mb-3" style={{fontSize:"16px",fontWeight:"bold"}}>{admin.username}  {admin.lastname}</div>
                                </center>
                              <br/>
                               <div class="mb-1 mt-3" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Contact</div>
                               <p  style={{color:"black"}}> <i class=" me-1  fa fa-envelope" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{admin.email}</p>
                              
                              <div class="mb-1 mt-3" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Sexe</div>
                             {admin.sexe==="femme" &&<p title="sexe" style={{color:"black"}}><i class=" me-1  fa fa-female" style={{fontSize:"13px",color:"#0B0A42"}}></i>Femme</p>}
                             {admin.sexe==="homme" &&<p title="sexe" style={{color:"black"}}><i class=" me-1  fa fa-male" style={{fontSize:"13px",color:"#0B0A42"}}></i>Homme</p>}
                             <div class="mb-1 mt-3" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Rôle</div>
                             <p title="rôle" style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Administrateur</p>
                              <div class="mb-1 mt-1" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Entreprise</div>
                                <p title="nom Entreprise" style={{color:"black" }}><i class=" me-1  fa fa-university " style={{fontSize:"13px",color:"#0B0A42"}}></i>{organisation.nom}</p>
                               
                                   <div class="mb-1 mt-1" style={{fontSize:"13px",color:"#0B0A42",fontWeight:"bold"}}>Secteur d'activité</div>
                                <p title="secteur" style={{color:"black",marginLeft:"6px" }}>{secteur.titre}</p>
                                 
                            </div>
                        </div>
                    </div>
                    <div class="col-8">
                       <div class="card card-rounded border border-3">
                            <div class="card-body" style={{maxHeight: "500px", "overflow-y": "auto"}}>
                               <div class="row">
                                  <div class="col-8">
                                     <div style={{fontSize:"14px",fontWeight:"bold",color:"#06868D"}}>
                                       Activités
                                    </div>
                                  </div>
                                  <div class="col-4">
                               <select value={type} style={{fontSize:"12px"}} onChange={ (e) => { setType(e.target.value)}}   class="form-select ">
                                   <option value="Tous" selected > Toutes les activités</option>
                                   <option value="utilisateurs" selected > Tous les utilisateurs</option>
                                   <option value="projets" selected > Tous les projets</option>
                                   <option value="membres" selected > Tous les chefs de projet et les clients du projets</option>
                                </select> 
                                </div>
                            </div>
                               <ActivitésAdmin type={type}/>
                            </div>
                        </div>
                      
                    </div> 
                </div>
            </div>
        </div>
    </div>
    <Modal show={show} size="xl" >
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
                                 {sexe==="homme"&&
                                <input  className="form-check-input m-1 " type="radio" id="input1" value="homme" name="sexe"  onChange={(e)=>setSexe(e.target.value)}checked  />
                                                }
                                   {sexe==="femme"&&
                                <input  className="form-check-input m-1 " type="radio" id="input1" value="homme" name="sexe"  onChange={(e)=>setSexe(e.target.value)} />
                                                }
                                <label class="form-check-label m-1" for="flexRadioDefault2">Homme</label>
                            </div>
                            <div class="" >
                                  {sexe==="femme"&&
                                <input  className="form-check-input m-1" type="radio" id="input1" value="femme" name="sexe"  onChange={(e)=>setSexe(e.target.value)} checked/>
                                              }
                                    {sexe==="homme"&&
                                <input  className="form-check-input m-1" type="radio" id="input1" value="femme" name="sexe"  onChange={(e)=>setSexe(e.target.value)} />
                                              }
                                <label class="form-check-label  m-1" for="flexRadioDefault2">Femme</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                            <div class="col-6">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Nom de l'organisation <span style={{color:"red"}}>*</span></label>
                                   <input className="form-control  form-icon-input" name="nomE"  type="text" value={nomE} onChange={(e)=>setNomE(e.target.value)} placeholder="saisir nom de l'entreprise" required="required"/>
                                </div>
                            </div>
                            <div class="col-6">
                               <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le secteur d'activité <span style={{color:"red"}}>*</span></label>
                                   <select value={secteurC} required onChange={ (e) =>  setSecteurC(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                                   {
                                       secteurs.map((item,index)=>(
                                    <option   key={item.id} value={item.id} selected={item.id===secteurC &&"selected"}>{item.titre}</option>
                                    )) }
                                    </select> 
                                </div>
                            </div>
                        </div>
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
</div>}
</>


       )
}

  

