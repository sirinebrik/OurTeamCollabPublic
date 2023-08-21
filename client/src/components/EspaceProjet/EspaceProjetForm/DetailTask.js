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

export default function DetailTask() {
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
    setUserT(response.data.task[0].user)

            })  });
useEffect( () => {getTask();},[]) ; 

 
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
                    <div class="row">
                        <div class="col-lg-2"></div>
                        <div class="col-lg-8">
                            <div class="card card-rounded mt-2" style={{borderRadius:"8px"}} >
                                <div class="card-body">
                                    <div class="row">
                                       <div class="col-lg-12">
                                       {(date1>=date2 &&tauxT<100)&&           
             <span title="Retard" className='me-1 pe-1' style={{fontWeight:"bold",backgroundColor:"red",color:"white",textAlign:"center",fontSize:"12px"}}  >En retard </span>}
            {(date1<date2 &&tauxT<100)&&<span style={{fontSize:"12px" }}>Reste {diffInDays} jour(s)</span>}
                                           <div class="row">
                                               <div class="col-6">
                                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre de la tâche</label>
                                                       <div className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}} >{titreT}</div>
                                                    </div>
                                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Etat </label>
                                                        <div className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}} >{etatTitre}</div>
                                                    </div>
                                                </div>
                                                <div class="col-6">
                                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Description d'une tâche </label>
                                                        <br></br><textarea className="" name="description"  rows="4" cols="70" value={descriptionT} disabled></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                               <div class="col-6">
                                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de début </label>
                                                       <div className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}} >{dateDebutT}</div>
                                                    </div>
                                                </div>
                                                <div class="col-6">
                                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de fin </label>
                                                        <div className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}} >{dateFinT}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-6">
                                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Responsable </label>
                                                    {userT&&
                                                       <div class="row">
                                                           <div class="col-1 ms-4 m-0">
                                                                {userT.user.photo&& <img class="rounded-circle" src={require(`../../../assets/uploads/${userT.user.photo}`)} width="27px" height="27px" title={userT.user.username+" "+userT.user.lastname}/>}
                                                                {!userT.user.photo  &&  <img class="rounded-circle"  src={require('../../../assets/img/logos/user.png')} width="27px" height="27px" title={userT.user.username+" "+userT.user.lastname}/>} 
                                                            </div>
                                                            <div className="col-9 mt-1 ms-1" style={{fontSize:"13px",fontWeight:"bold"}} >{userT.user.username} {userT.user.lastname}</div>
                                                        </div>
                                                    } 
                                                   {!userT&&
                                                        <div className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}} >Il n'y a pas de responsable</div>
                                                    }   </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Priorité </label>
                                                        {prioritéT==="Aucune"&&
                                                           <div class="ms-4" style={{color:"rgb(184 188 194)",fontSize:"13px",fontWeight:"bold"}} >  
                                                              {prioritéT} 
                                                            </div> }   
                                                        {prioritéT==="Basse"&&
                                                            <div  class="ms-4"  style={{color:"rgb(78, 205, 151)",fontSize:"13px",fontWeight:"bold"}} >  
                                                               {prioritéT} 
                                                            </div> }
                                                        {prioritéT==="Moyenne"&&
                                                            <div  class="ms-4"  style={{color:"rgb(255, 198, 60)",fontSize:"13px",fontWeight:"bold"}} >  
                                                               {prioritéT}    
                                                            </div> }  
                                                        {prioritéT==="Haute"&&
                                                            <div class="ms-4"  style={{color:"rgb(225, 45, 66)",fontSize:"13px",fontWeight:"bold"}} >  
                                                               {prioritéT} 
                                                            </div> }                         
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                   <div class="col-6">
                                                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Avancement (en %) </label>
                                                           <div class="dropdown mt-1 ms-4 ">
                                                                <div class="progress " style={{height: `17px`}}>
                                                                    {tauxT==="0" &&<div   style={{fontSize:"9px",paddingLeft:"7px"}} >{tauxT}%</div>}
                                                                    {tauxT>"0" &&   <div class="progress-bar" role="progressbar" style={{width: `${tauxT}%`,fontSize:"9px"}} 
                                                                       aria-valuenow={tauxT} aria-valuemin="0" aria-valuemax="100">{tauxT}%</div>}
                                                                </div>
                                                            </div> 
                                                        </div> 
                                                    </div>  
                                                    <div class="col-6">
                                                       {etatTitre==="Bloqué"&&
                                                       <>
                                                       <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison de blocage </label>
                                                            <div class="mb-2" >
                                                               <div className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}} >{blocageT}</div>
                                                            </div> 
                                                        </div>
                                                        </>}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-2"></div>  
                    </div>
                </div>
            </div>
        </div>}
       </>);       

  };

  
