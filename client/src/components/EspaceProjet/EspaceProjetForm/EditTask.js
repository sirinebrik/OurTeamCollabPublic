/* eslint-disable no-unused-vars */
import React,{ useEffect, useState } from 'react'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import Axios from 'axios'
import { Link,useNavigate,useParams} from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import jwt_decode from "jwt-decode";
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"
import moment from 'moment';

export default function EditTask() {
  const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
    const { idT } = useParams()
    const { idPh } = useParams()
    const { projetRole } = useParams()
    const [task,setTask]= useState([])
    const navigate = useNavigate ()
    let user1 = jwt_decode(localStorage.getItem("token"));
let role=user1.roles[0]
const [titreT,setTitreT]= useState("")
const [descriptionT,setDescriptionT]= useState("")
const [prioritéT,setPrioritéT]= useState("")
const [tauxT, setTauxT] = useState("");
const [raisonT,  setRaisonT] = useState("");
const [valideT,  setValideT] = useState("");
const [validé,  setValidé] = useState("");
const [userT,setUserT]= useState("")
const [dateDebutT,setDateDébutT]= useState("")
const [dateFinT,setDateFinT]= useState("")
const [etatT,setEtatT]= useState("")
const [etatTitre,setEtatTitre]= useState("")
const [etatId,setEtatId]= useState("")
const [errorT, setErrorT] = useState("");
const [blocageT, setBlocageT] = useState("");
const [etats,setEtats]= useState([])
const [projet,setProjet]= useState([])
const [projets,setProjets]= useState([])
const [projetsUser,setProjetsUser]= useState([])

const getTask = (async () => {
    await Axios.get(`http://localhost:8000/detailtask/${idT}`)
    .then((response)=>{

    setTask(response.data.task[0])
    setTitreT(response.data.task[0].titre)
    setDescriptionT(response.data.task[0].description)
    setDateFinT(response.data.task[0].dateFin)
    setDateDébutT(response.data.task[0].dateDebut)
    setPrioritéT(response.data.task[0].priorite)
    setTauxT(response.data.task[0].tauxAvancement)
    setRaisonT(response.data.task[0].raisonRefus)
    setBlocageT(response.data.task[0].problemeBlocage)
    setValideT(response.data.task[0].valide)
    setValidé(response.data.task[0].valide)
    setEtatT(response.data.task[0].etat.id)
    setEtatTitre(response.data.task[0].etat.titre)
    setEtatId(response.data.task[0].etat.id)
    setIsLoding(false);
    setUserT(response.data.task[0].user.id)

            })  });
useEffect( () => {getTask();},[]) ; 

 //tous les etats par phase
 const getEtats = (async () => {
  await Axios.get(`http://localhost:8000/etat/${idPh}`
)
  .then((response)=>{
  setEtats(response.data.etat) })  });
useEffect( () => {getEtats ();},[]);
//tous les users de ce projet
  const [users,setUsers]= useState([])
  const getUsers = (async () => {
    await Axios.get(`http://localhost:8000/usersProjet/${id}`
  )
    .then((response)=>{
    setUsers(response.data.user)
  })  });
useEffect( () => {getUsers ();},[]);
//etat Task
const getEtatTask = (async () => {
  await Axios.get(`http://localhost:8000/etatTask/${etatT}`
)
  .then((response)=>{
  setEtatTitre(response.data.etat[0].titre)
})  });

const onSubmitHandler = (e) => {
  e.preventDefault()
   const formData ={
        "titre" : titreT,
        "description":descriptionT,
        "dateDebut":dateDebutT,
        "dateFin":dateFinT,
        "etat":etatT,
        "priorité":prioritéT,
        "taux":tauxT,
        "validé":valideT,
        "raison":raisonT,
        "blocage":blocageT,
        "user":userT,}
  Axios.post(`http://localhost:8000/updateTask/${idT}`, formData,{
      headers: {
          "Content-Type": "multipart/form-data",
      }
  })
    .then((res) => {if(role==="ROLE_ADMIN"){window.location=`./${id}/${idPh}/${idT}`} else{  window.location=`./${projetRole}`};
})
    .catch((err) => setErrorT(err.response.data.danger))
}  

const onSubmitHandlerMembre = (e) => {
  e.preventDefault()
   const formData ={
        "etat":etatT,
        "taux":tauxT,
        "blocage":blocageT,
        "user":userT,
       }
  Axios.post(`http://localhost:8000/updateTaskMembre/${idT}`, formData,{
      headers: {
          "Content-Type": "multipart/form-data",
      }
  })
    .then((res) => {if(role==="ROLE_ADMIN"){window.location=`./${id}/${idPh}/${idT}`} else{  window.location=`./${projetRole}`};
})
    .catch((err) => setErrorT(err.response.data.danger))
}  

 //projet courant
 const getProjet = (async () => {
    await Axios.get(`http://localhost:8000/indexProjet/${id}`)
    .then((response)=>{
    setProjet(response.data.projet[0])
            })  });
useEffect( () => {getProjet();},[]) ;  
  //mes projets non archivés 
const getProjetsUser = (async () => {
    await Axios.get(`http://localhost:8000/droit/accesU/${user1.id}`
  )
    .then((response)=>{
    setProjetsUser(response.data.projet)
        })  });
useEffect( () => {getProjetsUser();},[]);
  //tous les projets pour Admin
  const getProjets = (async () => {
    await Axios.get(`http://localhost:8000/projet/acces/${user1.org}`).then((response)=>{
     setProjets(response.data.projet)
    })  });
    useEffect( () => {getProjets();},[]) ;
let proj=[]
if(role==="ROLE_ADMIN") {proj = projets.filter(f => (f.id !== projet.id ))}
else {proj = projetsUser.filter(f => (f.projet.id !== projet.id ))}
 const change = (e) =>{  if(role==="ROLE_ADMIN"){window.location=`/tâcheProjet/${e}`} else{window.location=`/tâcheProjet/${e}/${projetRole}`};}
 //delete une tâche 
const onSubmitDeleteHandler = () => {
    if (window.confirm("Voulez-vous supprimer définitivement cette tâche ?"))
    {Axios.post(`http://localhost:8000/deleteTask/${idT}`).then((response)=>{
    if(role==="ROLE_ADMIN"){window.location=`/tâcheProjet/${id}`} else{  window.location=`/tâcheProjet/${id}/${projetRole}`};})}
    }
    const date1 = moment(new Date());
    const date2 = moment(dateFinT);
     const diffInDays = date2.diff(date1, 'days')+1;  
     console.error = () => {}
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
                <div class="row mb-3 mt-2" style={{marginLeft:"20px"}}>
                   <div class="col-3"> 
                       <div class="row">
                           <div class="col-2"> 
                               <i class="fa  fa-fw fa-cube" style={{fontSize:"38px",color:"#06868D"}} ></i>
                            </div>
                            <div class="col-10"> 
                                <select  style={{fontSize:"19px",fontWeight:"bold"}} onChange={ (e) =>  change(e.target.value)} class="form-select border border-top-0 border-end-0 border-start-0">
                                     <option value={projet.id} selected > {projet.nom}</option>
                                </select> 
                            </div>
                        </div>
                    </div>
                    <div class="col-9">
                    </div> 
                </div> 
            <nav class="sidebar-offcanvas" style={{color:'white',backgroundColor:"#06868D" ,textAlign:"center" }}>
                <div class="row">
                    <div class="col-3">
                    </div>
                    <div class="col-6" style={{marginLeft:"20px" }}>
                        <ul class="nav " >
                            <li class="nav-item">
                                <Link class="nav-link test" to={ `/tableauDeBord/${id}`}   style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }}>
                                   <i class="fa fa-fw fa-bar-chart"></i>
                                   <span class="menu-title" > Tableau de bord</span>
                                </Link>
                            </li>
                            <li class="nav-item ">
                            {role==="ROLE_ADMIN"&&
                        <Link class="nav-link test "  to={ `/tâcheProjet/${id}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }}>
                           <i class="fa fa-fw fa-check"></i>
                           <span class="menu-title"> Tâches</span>
                        </Link>}
                    {(role==="ROLE_CLIENT"||role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                        <Link class="nav-link test "  to={ `/tâcheProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }}>
                           <i class="fa fa-fw fa-check"></i>
                           <span class="menu-title"> Tâches</span>
                        </Link>}
                            </li>
                           
                            <li class="nav-item ">
                            {role==="ROLE_ADMIN"&&
                                <Link class="nav-link test"  to={ `/equipeProjet/${id}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                                     <i class="fa fa-users fa-fw"></i>
                                     <span class="menu-title"> Equipe</span>
                                </Link>}
                          {(role==="ROLE_CLIENT"||role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                                <Link class="nav-link test"  to={ `/equipeProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                                      <i class="fa fa-users fa-fw"></i>
                                      <span class="menu-title"> Equipe</span>
                                </Link>}
                            </li>
                            <li class="nav-item ">
                           {role==="ROLE_ADMIN"&&projet.archive===false&&
                                <Link class="nav-link test"  to={ `/parametreProjet/${id}`}  style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px"}} >
                                   <i class="fa fa-fw fa-cog "></i>
                                   <span> Paramètres</span>
                                </Link>}
                          {
                            projetRole==="chefProjet"&&projet.archive===false&&
                                <Link class="nav-link test"  to={ `/parametreProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                                    <i class="fa fa-fw fa-cog "></i>
                                    <span> Paramètres</span>
                                </Link>}
                         {(projetRole==="client"||projetRole==="membre")&&
                                <Link class="nav-link test"   to={ `/detailProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                                    <i class="fa fa-fw fa-cog "></i>
                                    <span> Détails</span>
                                </Link>}
                        {(role==="ROLE_ADMIN"&&projet.archive===true)&&
                        <Link class="nav-link test"   to={ `/detailProjet/${id}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                           <i class="fa fa-fw fa-cog "></i>
                           <span> Détails</span>
                        </Link>}
                        {(projetRole==="chefProjet"&&projet.archive===true)&&
                        <Link class="nav-link test"   to={ `/detailProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                           <i class="fa fa-fw fa-cog "></i>
                           <span> Détails</span>
                        </Link>}
                            </li>
                        </ul>
                    </div> 
                    <div class="col-3">
                    </div>  
                 </div>
            </nav> 
       
            <div class="content-wrapper">
            {role==="ROLE_ADMIN"&&
          <Link to={ `/tâcheProjet/${id}`} style={{textDecoration:"none",color:"black"}}  >
            <>
            <span  style={{fontWeight:"bold",fontSize:"13px"}}> <i class="fa fa-arrow-left "></i> Retour</span>            </>
          </Link>}
          {role!=="ROLE_ADMIN"&&
          <Link to={ `/tâcheProjet/${id}/${projetRole}`} style={{textDecoration:"none",color:"black"}}  >
            <>
            <span  style={{fontWeight:"bold",fontSize:"13px"}}> <i class="fa fa-arrow-left "></i> Retour</span>

            </>
          </Link>}
       
            <div class="card card-rounded mt-2" style={{borderRadius:"2px"}} >
            <div class="card-body">
              <div class="row">
              <div class="col-lg-12">
              {(date1>=date2 &&tauxT<100)&&           
             <span title="Retard" className='me-1 pe-1' style={{fontWeight:"bold",backgroundColor:"red",color:"white",textAlign:"center",fontSize:"12px"}}  >En retard </span>}
            {(date1<date2 &&tauxT<100)&&<span style={{fontSize:"12px" }}>Reste {diffInDays} jour(s)</span>}
              {projetRole==="chefProjet"&&projet.archive===false&&
                 <>
                   {    errorT &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{errorT } </p>}
              <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} >
              <div class="row">
                  <div class="col-6">
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre de la tâche <span style={{color:"red"}}>*</span></label>
                    <input className="form-control  form-icon-input"  name="titreTache" value={titreT} type="text" onChange={(e)=>setTitreT(e.target.value)} placeholder="saisir titre de la tâche" pattern=".{3,}" title="3 caractères ou plus" required="required"/>
                </div>
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Etat <span style={{color:"red"}}>*</span></label>
                      <select value={etatT} onChange={ (e) =>  setEtatT(e.target.value)} onClick={ (e) =>  getEtatTask()} style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                        <option value="" selected disabled> Choisir l'état</option>
                              {
                                etatTitre==="Terminé"&&validé===true&&
                                <option   key={etatId} value={etatId}  >{etatTitre}</option>
                            }
                                {validé!==true&&
                                   etats.map((item,index)=>(
                        <option   key={item.id} value={item.id}  >{item.titre}</option>
                                    )) }
                      </select>                                    
                    </div>
                </div>
                <div class="col-6">
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Description d'une tâche <span style={{color:"red"}}>*</span></label>
                         <br></br><textarea className="" name="description"  rows="4" cols="70" value={descriptionT} onChange={(e)=>setDescriptionT(e.target.value)} placeholder="saisir description d'une tâche " pattern=".{3,}" title="3 caractères ou plus"required="required"></textarea>
                    </div>
                </div>
                </div>
                <div class="row">
                  <div class="col-6">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de début <span style={{color:"red"}}>*</span></label>
                      <input className="form-control  form-icon-input" name="dateDebut" type="date" value={dateDebutT}  onChange={(e)=>setDateDébutT(e.target.value)} required="required"/>
                    </div>
                  </div>
                  <div class="col-6">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de fin <span style={{color:"red"}}>*</span></label>
                      <input className="form-control  form-icon-input" name="dateFin" type="date" value={dateFinT} onChange={(e)=>setDateFinT(e.target.value)}  required="required"/>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                  <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Responsable </label>
                    {userT&&
                      <div class="row">
                         <div class="col-10">
                            <select value={userT} onChange={ (e) =>  setUserT(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}} class="form-select">
                              <option value="" selected disabled> Choisir le responsable</option>
                        {
                                  users.map((item,index)=>(
                               <option   key={item.id} value={item.id}>{item.user.username} {item.user.lastname}</option>
                                    )) }
                            </select>   
                          </div> 
                      <div class="col-2 ">
                          <a type="button" title="Retirer le responsable" style={{backgroundColor:"white",color:"red",marginLeft:"30px"}} class="mt-1 border border-0 "  onClick={ (e) =>  {setUserT("")}}><i style={{fontSize:"18px"}} class="fa fa-user-times fa-fw" ></i></a> 
                      </div>
                      </div> } 
                      {!userT&&
                        <select value={userT} onChange={ (e) =>  setUserT(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                              <option value="" selected disabled> Choisir le responsable</option>
                        {
                                  users.map((item,index)=>(
                               <option   key={item.id} value={item.id}>{item.user.username} {item.user.lastname}</option>
                                    )) }
                        </select>   
                       }   </div>
                  </div>
                  <div class="col-6">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Priorité <span style={{color:"red"}}>*</span></label>
                      <select value={prioritéT} onChange={ (e) =>  setPrioritéT(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                      <option   value="" >{prioritéT}</option>
                        <option   value="Aucune" selected={prioritéT==="Aucune" &&"selected"}>Aucune</option>
                        <option   value="Basse" selected={prioritéT==="Basse" &&"selected"}>Basse</option>
                        <option   value="Moyenne" selected={prioritéT==="Moyenne" &&"selected"}>Moyenne</option>
                        <option   value="Haute" selected={prioritéT==="Haute" &&"selected"}>Haute</option>
                      </select>                            
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                  <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Avancement (en %) </label>

                  <div class="dropdown mt-1 ">
                            {etatTitre!=="Terminé"&&
                            <>
                                   <div class="progress " style={{height: `17px`}}>
                                     {tauxT==="0" &&<div   style={{fontSize:"9px",paddingLeft:"7px"}} >{tauxT}%</div>}
                                     {tauxT>"0" &&   <div class="progress-bar" role="progressbar" style={{width: `${tauxT}%`,fontSize:"9px"}} 
                                     aria-valuenow={tauxT} aria-valuemin="0" aria-valuemax="100">{tauxT}%</div>}
                                   </div>
                                 
                                   <div class="dropdown-content">
                                      <a type="button" onClick={ (e) =>  {setTauxT("0");}}>0 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("10");}}>10 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("20");}}>20 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("30");}}>30 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("40");}}>40 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("50");}}>50 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("60");}}>60 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("70");}}>70 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("80");}}>80 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("90");}}>90 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("100");}}>100 % </a>
                                    </div></>}
                                    {etatTitre==="Terminé"&&
                                   <div class="progress " style={{height: `17px`}}>
                                       <div class="progress-bar" role="progressbar" style={{width: `${100}%`,fontSize:"9px"}} 
                                       aria-valuenow={100} aria-valuemin="0" aria-valuemax="100">{100}%</div>
                                 </div>}
                                </div> 
                  </div> </div>  
                  <div class="col-6">
                  {etatTitre==="Bloqué"&&
                         <>
                           <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison de blocage </label>
                            <div class="mb-2" >
                             <input className="form-control  form-icon-input"  name="blocageTache" value={blocageT}  type="text" onChange={(e)=>setBlocageT(e.target.value)} placeholder="saisir le raison de blocage"  />
                               </div> </div></>}
                   {etatTitre==="Terminé"&&
                         <div class="row">
                            { validé===null&&
                            <>
                                <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Validée </label>
                                       <div class="mb-2" >
                                           <input  className="form-check-input m-1 " type="radio" id="input1" value="oui" name="validé"  onChange={(e)=>setValideT("true")}  />
                                           <label class="form-check-label m-1 me-3" for="flexRadioDefault2">Oui</label>
                                       
                                           <input  className="form-check-input m-1" type="radio" id="input1" value="non" name="validé"  onChange={(e)=>setValideT("false")}/>
                                           <label class="form-check-label  m-1" for="flexRadioDefault2">Non</label>
                                        </div>
                                    </div>                     
                                </div>
                                {valideT==="false"&&
                                  <div class="col-6">
                                  <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison de refus </label>
                                  <div class="mb-2" >
                                  <input className="form-control  form-icon-input"  name="raisonTache"  type="text" onChange={(e)=>setRaisonT(e.target.value)} placeholder="saisir le raison de refus"  />
                                      </div>
                                  </div>                     
                              </div>}</> }
                               
                                { validé===true&&
                                <div class="col-12">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Validée </label>
                                       <div class="mb-2" >
                                           <input checked className="form-check-input m-1 " type="radio" id="input1" value="oui" name="validé"    />
                                           <label class="form-check-label m-1 me-3" for="flexRadioDefault2">Oui</label>
                                        
                                           <input  className="form-check-input m-1" type="radio" id="input1" value="non" name="validé"  disabled/>
                                           <label class="form-check-label  m-1" for="flexRadioDefault2">Non</label>
                                        </div>
                                    </div>                     
                                </div> }
                                { validé===false&&
                                <>
                                <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Validée </label>
                                       <div class="mb-2" >
                                           <input  className="form-check-input m-1  " type="radio" id="input1" value="oui" name="validé"  disabled  />
                                           <label class="form-check-label m-1 me-4" for="flexRadioDefault2">Oui</label>
                                       
                                           <input checked className="form-check-input m-1" type="radio" id="input1" value="non" name="validé"  />
                                           <label class="form-check-label  m-1" for="flexRadioDefault2">Non</label>
                                        </div>
                                    </div>                     
                                </div>
                                <div class="col-6">
                                  <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison de refus </label>
                                     <div class="mb-2" >
                                     <input className="form-control  form-icon-input"  name="raisonTache" value={raisonT} type="text" onChange={(e)=>setRaisonT(e.target.value)} placeholder="saisir le raison de refus"  />
                                      </div>
                                </div>                     
                              </div>
                              </> }
                           
                         </div>}
                       
                    </div>

                </div>
                <div class="mt-1" style={{ textAlign:"right" }}>
                <button type="button" class="btn me-2"  onClick={onSubmitDeleteHandler}  style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                    Supprimer
                  </button>
                    <button type="submit" class="btn ps-3"    disabled={(!titreT||!descriptionT||!dateDebutT||!dateFinT||!etatT||!prioritéT) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Modifier
                  </button>
              </div></form></>}
              {projetRole==="membre"&&projet.archive===false&&
              
              <>
              {    errorT &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{errorT } </p>}
            <form  enctype="multipart/form-data" onSubmit={onSubmitHandlerMembre} >
              <div class="row">
                  <div class="col-6">
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre de la tâche <span style={{color:"red"}}>*</span></label>
                    <input disabled className="form-control  form-icon-input"  name="titreTache" value={titreT} type="text" onChange={(e)=>setTitreT(e.target.value)} placeholder="saisir titre de la tâche" pattern=".{3,}" title="3 caractères ou plus" required="required"/>
                </div>
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Etat <span style={{color:"red"}}>*</span></label>
                      <select value={etatT} onChange={ (e) =>  setEtatT(e.target.value)} onClick={ (e) =>  getEtatTask()} style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                        <option value="" selected disabled> Choisir l'état</option>
                              {
                                etatTitre==="Terminé"&&(validé===true||validé===false)&&
                                <option   key={etatId} value={etatId}  >{etatTitre}</option>
                            }
                                {validé===null&&
                                   etats.map((item,index)=>(
                        <option   key={item.id} value={item.id}  >{item.titre}</option>
                                    )) }
                      </select>                                    
                    </div>
                </div>
                <div class="col-6">
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Description d'une tâche <span style={{color:"red"}}>*</span></label>
                         <br></br><textarea disabled className="" name="description"  rows="4" cols="70" value={descriptionT} onChange={(e)=>setDescriptionT(e.target.value)} placeholder="saisir description d'une tâche " pattern=".{3,}" title="3 caractères ou plus"required="required"></textarea>
                    </div>
                </div>
                </div>
                <div class="row">
                  <div class="col-6">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de début <span style={{color:"red"}}>*</span></label>
                      <input disabled className="form-control  form-icon-input" name="dateDebut" type="date" value={dateDebutT}  onChange={(e)=>setDateDébutT(e.target.value)} required="required"/>
                    </div>
                  </div>
                  <div class="col-6">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de fin <span style={{color:"red"}}>*</span></label>
                      <input disabled className="form-control  form-icon-input" name="dateFin" type="date" value={dateFinT} onChange={(e)=>setDateFinT(e.target.value)}  required="required"/>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                  <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Responsable </label>
                  
                      <div class="row">
                         <div class="col-12">
                            <select disabled value={userT} onChange={ (e) =>  setUserT(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                              <option value="" selected disabled> Choisir le responsable</option>
                        {
                                  users.map((item,index)=>(
                               <option   key={item.id} value={item.id}>{item.user.username} {item.user.lastname}</option>
                                    )) }
                            </select>   
                          </div> 
                   
                      </div> </div>
                  </div>
                  <div class="col-6">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Priorité <span style={{color:"red"}}>*</span></label>
                      <select disabled value={prioritéT} onChange={ (e) =>  setPrioritéT(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                      <option   value="" >{prioritéT}</option>
                        <option   value="Aucune" selected={prioritéT==="Aucune" &&"selected"}>Aucune</option>
                        <option   value="Basse" selected={prioritéT==="Basse" &&"selected"}>Basse</option>
                        <option   value="Moyenne" selected={prioritéT==="Moyenne" &&"selected"}>Moyenne</option>
                        <option   value="Haute" selected={prioritéT==="Haute" &&"selected"}>Haute</option>
                      </select>                            
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                  <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Avancement (en %) </label>

                  <div class="dropdown mt-1 ">
                            {etatTitre!=="Terminé"&&
                            <>
                                   <div class="progress " style={{height: `17px`}}>
                                     {tauxT==="0" &&<div   style={{fontSize:"9px",paddingLeft:"7px"}} >{tauxT}%</div>}
                                     {tauxT>"0" &&   <div class="progress-bar" role="progressbar" style={{width: `${tauxT}%`,fontSize:"9px"}} 
                                     aria-valuenow={tauxT} aria-valuemin="0" aria-valuemax="100">{tauxT}%</div>}
                                   </div>
                                 
                                   <div class="dropdown-content">
                                      <a type="button" onClick={ (e) =>  {setTauxT("0");}}>0 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("10");}}>10 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("20");}}>20 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("30");}}>30 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("40");}}>40 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("50");}}>50 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("60");}}>60 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("70");}}>70 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("80");}}>80 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("90");}}>90 % </a>
                                      <a type="button" onClick={ (e) =>  {setTauxT("100");}}>100 % </a>
                                    </div></>}
                                    {etatTitre==="Terminé"&&
                                   <div class="progress " style={{height: `17px`}}>
                                       <div class="progress-bar" role="progressbar" style={{width: `${100}%`,fontSize:"9px"}} 
                                       aria-valuenow={100} aria-valuemin="0" aria-valuemax="100">{100}%</div>
                                 </div>}
                                </div> 
                  </div> </div>  
                  <div class="col-6">
                  {etatTitre==="Bloqué"&&
                         <>
                           <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison de blocage </label>
                            <div class="mb-2" >
                             <input className="form-control  form-icon-input"  name="blocageTache" value={blocageT}  type="text" onChange={(e)=>setBlocageT(e.target.value)} placeholder="saisir le raison de blocage" pattern=".{3,}" title="3 caractères ou plus"required="required" />
                               </div> </div></>}
                   {etatTitre==="Terminé"&&
                         <div class="row">
                            { validé===null&&
                          <>
                             <div class="col-6">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Validée </label>
                                  <div class="mb-2" >
                                    <div title="attendre la validation"  className="ms-4" style={{fontWeight:"bold",color:"orange",fontSize:"13px"}}  >Pas encore </div>
                                  </div> 
                                </div>
                              </div>
                          </> }
                         { validé===true&&
                            <div class="col-6">
                              <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Validée </label>
                                <div class="mb-2" >
                                  <div title="Validée" className='ms-4  border border-top-0 border-end-0  border-start-0 border-bottom-0'  style={{fontWeight:"bold",color:"#55b900",fontSize:"13px"}} >Oui </div>
                                </div>
                              </div>                     
                            </div> }
                            { validé===false&&
                            <>
                            <div class="col-6">
                              <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Validée </label>
                                <div class="mb-2" >
                                  <span title="Refusée" className='ms-4' style={{fontWeight:"bold",color:"#dd0043",textAlign:"center",fontSize:"13px"}}  >Non </span>
                                </div>
                              </div>                     
                            </div>
                            <div class="col-6">
                              <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison de refus </label>
                                <div class="mb-2" >
                                  <div className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}} >{raisonT}</div>
                                </div>
                              </div>                     
                            </div>
                                                            </> }
                           
                         </div>}
                       
                    </div>

                </div>
                <div class="mt-1" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn ps-3"    disabled={((!etatT) ||(!blocageT&&etatTitre==="Bloqué"))&&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Modifier
                  </button>
              </div></form></>

              }
         
             </div>
            </div>
            </div>
            </div>
            </div>
        </div>
    </div>
</div>
}                                   
    </>
  );       

  };

  
