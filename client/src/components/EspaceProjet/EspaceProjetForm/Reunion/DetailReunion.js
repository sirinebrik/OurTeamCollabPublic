import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams } from "react-router-dom"
import Navbar from "../../../Page/Navbar";
import Sidebar from "../../../Page/Sidebar";
import Modal from 'react-bootstrap/Modal';
import Select  from "react-select";
import UsersReunion from "./usersReunion";


export default function DetailReunion() {
    const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
    const { idR } = useParams()
    const { projetRole } = useParams() 
    const [projet,setProjet]= useState([])
    const [projets,setProjets]= useState([])
    const [projetsUser,setProjetsUser]= useState([])
    const [show, setShow] = useState(false);
    const [titre,setTitre]= useState("")
    const [lien,setLien]= useState("")
    const [description,setDescription]= useState("")
    const [date,setDate]= useState("")
    const [annule,setAnnule]= useState("")
    const [annulé,setAnnulé]= useState("")
    const [raison,setRaison]= useState("")
    const [heureDébut,setHeureDébut]= useState("")
    const [heureFin,setHeureFin]= useState("")
    const [error,setError]= useState("")
    const [usersId,setUsersId]= useState([])
    const [users,setUsers]= useState([])
    const [usersReunion,setUsersReunion]= useState([])
    const [reunion,setReunion]= useState([])
    const handleShow = () => {setShow(true);}
    const handleClose = () => {setShow(false)}
     
    let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]
    //projet courant
    const getProjet = (async () => {
        await Axios.get(`http://localhost:8000/indexProjet/${id}`)
        .then((response)=>{
        setProjet(response.data.projet[0])
                })  });
    useEffect( () => {getProjet();},[]) ;  
      //mes projets non archivés 
    const getProjetsUser = (async () => {
        await Axios.get(`http://localhost:8000/droit/accesU/${user.id}`
      )
        .then((response)=>{
        setProjetsUser(response.data.projet)
            })  });
    useEffect( () => {getProjetsUser();},[]);
    //tous les projets pour Admin
    const getProjets = (async () => {
        await Axios.get(`http://localhost:8000/projet/acces`).then((response)=>{
         setProjets(response.data.projet)
        })  });
        useEffect( () => {getProjets();},[]) ;
    let proj=[]
    if(role==="ROLE_ADMIN") {proj = projets.filter(f => (f.id !== projet.id ))}
    else {proj = projetsUser.filter(f => (f.projet.id !== projet.id ))}
    const change = (e) =>{  if(role==="ROLE_ADMIN"){window.location=`/réunion/${e}`} else{window.location=`/réunion/${e}/${projetRole}`};}
 //detailprojet
 const getUsers = (async () => {
    await Axios.get(`http://localhost:8000/detailProjet/${id}`
  )
    .then((response)=>{
    setUsers(response.data.projet) 
})  });
useEffect( () => {getUsers();},[]);

        //les reunions d'un utilisateur du projet courant
    const getReunion = (async () => {
        if(role!=="ROLE_ADMIN"){
            await Axios.get(`http://localhost:8000/reunion/${user.id}/${idR}`)
            .then((response)=>{
            setReunion(response.data.reunion)
            setTitre(response.data.reunion[0].reunion.titre)
            setLien(response.data.reunion[0].reunion.lien)
            setDescription(response.data.reunion[0].reunion.description)
            setDate(response.data.reunion[0].reunion.date)
            setHeureDébut(response.data.reunion[0].reunion.heureDebut)
            setHeureFin(response.data.reunion[0].reunion.heureFin)
            setRaison(response.data.reunion[0].reunion.raisonAnnulation)
            setAnnule(response.data.reunion[0].reunion.annule)
            setAnnulé(response.data.reunion[0].reunion.annule)
           })}
        else{
            await Axios.get(`http://localhost:8000/reunionAdmin/${idR}`)
            .then((response)=>{
            setReunion(response.data.reunion)
            setTitre(response.data.reunion[0].reunion.titre)
            setLien(response.data.reunion[0].reunion.lien)
            setDescription(response.data.reunion[0].reunion.description)
            setDate(response.data.reunion[0].reunion.date)
            setHeureDébut(response.data.reunion[0].reunion.heureDebut)
            setHeureFin(response.data.reunion[0].reunion.heureFin)
            setRaison(response.data.reunion[0].reunion.raisonAnnulation)
            setAnnule(response.data.reunion[0].reunion.annule)
            setAnnulé(response.data.reunion[0].reunion.annule)
           }) 
        }        setIsLoding(false);
    });
        useEffect( () => {getUsersReunion();
        },[]) ;  

              //les utilisateurs d'une réunion
    const getUsersReunion = (async () => {
        await Axios.get(`http://localhost:8000/usersReunion/${idR}`)
        .then((response)=>{
      
        setUsersReunion(response.data.users)
       })  });
    useEffect( () => {getReunion();
    },[]) ; 
   
       //estPrésent
  const OuiPresence = (idParticip) => {
    if (window.confirm(" Voulez-vous participer à cette réunion  ?"))
    {Axios.post(`http://localhost:8000/presenceOuiReunion/${idParticip}`).then((response)=>{
    if(role==="ROLE_ADMIN"){window.location=`/détailRéunion/${id}/${idR}`} else{  window.location=`/détailRéunion/${id}/${projetRole}/${idR}`};})}
    } 
     //n'estPrésent
  const NonPresence = (idParticip) => {
    if (window.confirm("Voulez-vous annuler la participation à cette réunion ?"))
    {Axios.post(`http://localhost:8000/presenceNonReunion/${idParticip}`).then((response)=>{
    if(role==="ROLE_ADMIN"){window.location=`/détailRéunion/${id}/${idR}`} else{  window.location=`/détailRéunion/${id}/${projetRole}/${idR}`};})}
    } 
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
                        <Link class="nav-link test "  to={ `/tâcheProjet/${id}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }}>
                           <i class="fa fa-fw fa-check"></i>
                           <span class="menu-title"> Tâches</span>
                        </Link>}
                    {(role==="ROLE_CLIENT"||role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                        <Link class="nav-link test "  to={ `/tâcheProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }}>
                           <i class="fa fa-fw fa-check"></i>
                           <span class="menu-title"> Tâches</span>
                        </Link>}
                            </li>
                            <li class="nav-item">
                            {role==="ROLE_ADMIN"&&
                        <Link class="nav-link test "  to={ `/réunion/${id}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }}>
                                   <i class="fa fa-fw fa-briefcase"></i>
                           <span class="menu-title"> Réunions</span>
                        </Link>}
                    {(role==="ROLE_CLIENT"||role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                        <Link class="nav-link test "  to={ `/réunion/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }}>
                                   <i class="fa fa-fw fa-briefcase"></i>
                           <span class="menu-title">Réunions</span>
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
                <Link to={ `/réunion/${id}`} style={{textDecoration:"none",color:"black"}}  >
                <>
                   <span  style={{fontWeight:"bold",fontSize:"13px"}} class="me-4 "> <i class="fa fa-arrow-left "></i> Retour</span>            </>
                </Link>}
                {role!=="ROLE_ADMIN"&&
                <Link to={ `/réunion/${id}/${projetRole}`} style={{textDecoration:"none",color:"black"}}  >
                 <>
                    <span  style={{fontWeight:"bold",fontSize:"13px"}} class="me-4 "> <i class="fa fa-arrow-left "></i> Retour</span>
                 </>
                </Link>}
              <div class="card card-rounded mt-2" style={{borderRadius:"2px"}} >
               <div class="card-body">
              <div class="row">
                    <div class="col-6">
                    <div class="col-12">
                            <div class="row">
                                <div class="col-6">
                                   <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre </label>
                                       <div  className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}}>{titre}</div>
                                    </div>
                                </div> 
                                <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date </label>
                                       <div  className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}}>{date}</div>
                                    </div>
                                </div> 
                            </div>  
                        </div> 
                        <div class="row">
                            <div class="col-12">
                                <div className=" text-start"><label className="form-label" style={{color:"#06868D"}}>Lien </label>
                                   <div  className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}}>{lien}</div>
                               </div>
                            </div>
                          
                        </div>
                    </div> 
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Description </label>
                             <br></br><textarea className="" name="description"  rows="4" cols="70" value={description}  disabled></textarea>
                        </div>
                    </div>
                </div>
                <div class="row">
                   <div class="col-6">
                       <div class="row">
                           <div class="col-6">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Heure début </label>
                                    <div  className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}}>{heureDébut}</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Heure fin </label>
                                     <div  className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}}>{heureFin}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                    <div class="row">
                { annule===false&&
                            <>
                                <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Annulée </label>
                                       <div  className="ms-4" style={{fontSize:"13px",fontWeight:"bold",color:"green"}} >
                                          Non
                                        </div>
                                    </div>                     
                                </div> 
                          
                                </>}

                                {annule ===true&&
                                  <>
                                  <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Annulée </label>
                                       <div className="ms-4" style={{fontSize:"13px",fontWeight:"bold",color:"red"}} >
                                         Oui
                                        </div>
                                    </div>                     
                                </div> 
                                  <div class="col-6">
                                  <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison d'annulation </label>
                                      <div class="mb-2" >
                                            <div className="ms-4" style={{fontSize:"13px",fontWeight:"bold"}}  >
                                              {raison}
                                           </div>
                                      </div>
                                  </div>                     
                              </div></>} 
                            </div> 
                      
                    </div>
                </div>
                <div class="row">
                   <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Participants</label>
                          <button type="button" className="btn "  onClick={ (e) =>  {handleShow()}}  > <i style={{fontSize:"18px",fontWeight:"bold"}} class="menu-icon mdi mdi-account-multiple"></i></button>
                        </div>
                        </div> 
                     </div> 
            </div>
        </div>
    </div>
    </div>
        </div>
    </div>}
 
    <Modal show={show} size="xl">
        <Modal.Header  >
          <Modal.Title>Les participants
            <button  onClick={handleClose} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"895px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div class="table-responsive" >
                        <table class="table">
                            <thead>
                                <tr style={{color:"#06868D",textAlign:"center"}}>
                                    <th> Prénom</th>
                                    <th> Nom</th>
                                    <th> Droit d'accès</th>
                                    <th> Présence</th>
                                </tr>
                            </thead>
                            <tbody  >
                            {usersReunion.map((item,index)=>(
                                <tr  style={{textAlign:"center"}} >
                                   <td > {item.user.user.username} </td >
                                   <td >{item.user.user.lastname} </td >
                                   <td >{item.user.role} </td >
                                   <td > <UsersReunion idUser={item.user.user.id} id={id} projetRole={projetRole} idR={item.reunion.id} annule={item.reunion.annule}
                                       presence={item.presence} date={item.reunion.date}  archive={projet.archive} heureDebut={item.reunion.heureDebut} heureFin={item.reunion.heureFin} 
                                       idParticip={item.id} OuiPresence={OuiPresence} NonPresence={NonPresence}/></td >
                                </tr >))}
                              
                            </tbody>
                        </table>
                    </div> 
        </Modal.Body>
    </Modal>
</>
       )
}

  

