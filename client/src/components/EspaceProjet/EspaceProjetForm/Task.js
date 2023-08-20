/* eslint-disable no-unused-vars */
import React,{ useEffect, useState } from 'react'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import jwt_decode from "jwt-decode";
import moment from 'moment';

export default function Task({titreE,id,titre,idP,idE,idPh,projetRole,archive ,description,user, validé,tauxAvancement,priorité,dateDebut,dateFin, raisonRefus,problemeBlocage}) {
    const navigate = useNavigate ()
    let user1 = jwt_decode(localStorage.getItem("token"));
let role=user1.roles[0]
const [showRaison, setShowRaison] = useState(false);
const [testEtat, setTestEtat] = useState(false);
const [type, setType] = useState("Déplacer");
const [raisonU, setRaisonU] = useState(raisonRefus);
const [blocageU, setBlocageU] = useState(problemeBlocage);
const [taux, setTaux] = useState(tauxAvancement);
const [priorite, setPriorite] = useState(priorité);
const [valide, setValide] = useState(validé);
const [idPhase, setIdPhase] = useState();
const [idEtat, setIdEtat] = useState();
const [phases,setPhases]= useState([])
const [etats,setEtats]= useState([])
const [error,setError]= useState([])
const [showBlocage, setShowBlocage] = useState(false);
const handleShowRaison = () => setShowRaison(true);
const handleCloseRaison = () => {setShowRaison(false)}
const handleShowBlocage = () => setShowBlocage(true);
const handleCloseBlocage = () => {setShowBlocage(false)}
const [show, setShow] = useState(false);
const handleShow = () => setShow(true);
const handleClose = () => {setShow(false);setType("Déplacer");setError("");setIdPhase("");setIdEtat("");setEtats([])}
 

 //tous les phases de ce projet courant
 const getPhases = (async () => {
  await Axios.get(`http://localhost:8000/phase/${idP}`
)
  .then((response)=>{
  setPhases(response.data.phase) })  });
  useEffect( () => {getPhases();},[]) ;
    
//tous les etats par phase
const getEtats = (async () => {
  await Axios.get(`http://localhost:8000/etat/${idPhase}`
)
  .then((response)=>{
  setEtats(response.data.etat) })  });



 //modifier un raison de refus
const onSubmitUpdateRaison = (e) => {
    e.preventDefault()
     const formData ={
          "raisonRefus" : raisonU
       }
    Axios.post(`http://localhost:8000/updateRaison/${id}`, formData,{
        headers: {
            "Content-Type": "multipart/form-data",}
    })
      .then((res) => { 
        handleCloseRaison()}).catch((err) => {})}
//modifier un raison de blocage
const onSubmitUpdateBlocage = (e) => {
  e.preventDefault()
   const formData ={
        "blocage" : blocageU
     }
  Axios.post(`http://localhost:8000/updateBlocage/${id}`, formData,{
      headers: {
          "Content-Type": "multipart/form-data",}
  })
    .then((res) => { 
      handleCloseBlocage()}).catch((err) => {})}
 //modifier le taux d'avancement
 const onSubmitUpdateTaux = (e) => {
 
   const formData ={
        "taux" : e
     }
  Axios.post(`http://localhost:8000/updateTaux/${id}`, formData,{
      headers: {
          "Content-Type": "multipart/form-data",}
  })}
  //modifier la priorité
 const onSubmitUpdatePriorité = (e) => {
 
  const formData ={
       "priorité" : e
    }
 Axios.post(`http://localhost:8000/updatePriorité/${id}`, formData,{
     headers: {
         "Content-Type": "multipart/form-data",}
 })}

   //modifier la validité
   const onSubmitUpdateValidé = (e) => {
 
    const formData ={
         "validé" : e
      }
   Axios.post(`http://localhost:8000/validéTask/${id}`, formData,{
       headers: {
           "Content-Type": "multipart/form-data",}
   })}
     //recommencer task
     const onSubmitRecomencer = (e) => {
     Axios.post(`http://localhost:8000/recommencerTask/${id}`,{
         headers: {
             "Content-Type": "multipart/form-data",}
     })  .then((response)=>{
     if(role==="ROLE_ADMIN"){window.location=`./${idP}`} else{  window.location=`./${projetRole}`}})
    }
    
  const onDragStart = evt => {
    let element = evt.currentTarget;
    element.classList.add("dragged");
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
    evt.dataTransfer.effectAllowed = "move";
  };
  const onDragEnd = evt => {
    evt.currentTarget.classList.remove("dragged");
  };
  //delete une tâche 
const onSubmitDeleteHandler = () => {
  if (window.confirm("Voulez-vous supprimer définitivement cette tâche ?"))
  {Axios.post(`http://localhost:8000/deleteTask/${id}`).then((response)=>{
  if(role==="ROLE_ADMIN"){window.location=`/tâcheProjet/${idP}`} else{  window.location=`/tâcheProjet/${idP}/${projetRole}`};})}
  }

   //DéplacerCopier une task
 const onSubmitDéplacerCopierHandler = (e) => {
  e.preventDefault()
   const formData ={
        "type" : type
     }
  Axios.post(`http://localhost:8000/copierDeplacerTask/${id}/${idPhase}/${idEtat}`, formData,{
      headers: {
          "Content-Type": "multipart/form-data",
      }
  })
    .then((res) => { 
   window.location=`/tâcheProjet/${idP}/${projetRole}` 

 })
 .catch((err) => setError(err.response.data.danger))
}
const date1 = moment(new Date());
const date2 = moment(dateFin);
 const diffInDays = date2.diff(date1, 'days')+1;
 console.error = () => {}
  return (
    <>
    
      <div className="mb-2" key={titre} id={id} draggable={((valide===null)||(projetRole==="chefProjet"&&valide===false))&&true} onDragStart={e =>  onDragStart(e)} onDragEnd={e =>  onDragEnd(e)}>
        <div style={{backgroundColor:"white"}} class="p-2 border border-3 rounded "> 
          <div style={{fontSize:"14px"}} > 
          {role==="ROLE_ADMIN"&&
          <Link to={ `/detailTâche/${idP}/${id}`} style={{textDecoration:"none",color:"black"}}  >
            <>
            <span style={{fontWeight:"bold"}}> {titre} </span> 
            {(date1>=date2 &&taux<100)&&           
             <span title="Retard" className='me-1 pe-1 ' style={{fontWeight:"bold",backgroundColor:"red",color:"white",textAlign:"center",fontSize:"12px"}}  >En retard </span>}
            {(date1<date2 &&taux<100)&&<span style={{fontSize:"12px"}}>(reste {diffInDays} jour(s))</span>}
            </>
          </Link>}
          {role!=="ROLE_ADMIN"&&
           <div class="row"> 
              <div class="col-6" > 
                <Link to={ `/detailTâche/${idP}/${id}/${projetRole}`} style={{textDecoration:"none",color:"black"}}  >
                   <span style={{fontWeight:"bold"}}>{titre} </span>
                   {(date1>=date2 &&taux<100)&&           
                     <span title="Retard" className='me-1  pe-1' style={{fontWeight:"bold",backgroundColor:"red",color:"white",textAlign:"center",fontSize:"11px"}}  >En retard </span>}
                   {(date1<date2 &&taux<100)&&<span style={{fontSize:"12px"}}>(reste {diffInDays} jour(s))</span>}                
                </Link>
              </div>
              {projetRole==="chefProjet"&&archive===false&&
                <div class="col-6 ">
                  <Link title="Modifier" class="ms-3" to={ `/editTâche/${idP}/${idPh}/${id}/${projetRole}`} style={{textDecoration:"none",color:"black"}} ><i class="fa fa-edit" style={{fontSize:"16px",color:"orange"}}></i></Link>
                  <button onClick={handleShow} title="Déplacer ou copier dans..." className=" border border-top-0 border-end-0  border-start-0 border-bottom-0"   style={{backgroundColor:"white"}}  ><i class="fa fa-fw fa-share " style={{fontSize:"16px",color:"#06868D"}} > </i> </button>   
                  <Link title="Dupliquer" to={ `/dupliquerTâche/${idP}/${idPh}/${id}/${projetRole}`} style={{textDecoration:"none",color:"black"}}  ><i class="fa fa-fw fa-copy " style={{fontSize:"16px",color:"#06868D"}} > </i> </Link> 
                  <button title="Supprimer une tâche" type="button"  className=' border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={onSubmitDeleteHandler} style={{backgroundColor:"white"}}><i class="fa fa-trash" style={{fontSize:"16px",color:"red"}}></i></button>
                </div>
               }    
                   {projetRole==="membre"&&archive===false&&user&&user.user.id===user1.id&&
                <div class="col-3 ps-4 ">
                  <Link to={ `/editTâche/${idP}/${idPh}/${id}/${projetRole}`} style={{textDecoration:"none",color:"black"}} ><i class="fa fa-edit" style={{fontSize:"16px",color:"orange"}}></i></Link>
                </div>
               }    
            </div>}
          <p style={{fontSize:"12px" }} class="ms-1"><i class="mt-2 fa fa-calendar f-disabled m-r-xs"></i> Débute le {dateDebut} Termine le {dateFin}</p>
           <div class="row ">
              {titreE==="Terminé"&&valide===null&&
              <>
              <div class="col-8">
                <div class="dropdown mt-2 pe-2">
                  <div class="progress " style={{height: `17px`}}>
                    {taux==="0" &&<div   style={{fontSize:"9px",paddingLeft:"7px"}} >{taux}%</div>}
                    {taux>"0" &&   <div class="progress-bar" role="progressbar" style={{width: `${taux}%`,fontSize:"9px"}} 
                    aria-valuenow={taux} aria-valuemin="0" aria-valuemax="100">{taux}%</div>}
                  </div>
                  {((projetRole==="chefProjet"||(projetRole==="membre"&&user&&user.user.id===user1.id))&&titreE!=="Terminé")&&
                  <div class="dropdown-content">
                    <a type="button" onClick={ (e) =>  {setTaux("0");onSubmitUpdateTaux("0")}}>0 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("10");onSubmitUpdateTaux("10")}}>10 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("20");onSubmitUpdateTaux("20")}}>20 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("30");onSubmitUpdateTaux("30")}}>30 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("40");onSubmitUpdateTaux("40")}}>40 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("50");onSubmitUpdateTaux("50")}}>50 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("60");onSubmitUpdateTaux("60")}}>60 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("70");onSubmitUpdateTaux("70")}}>70 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("80");onSubmitUpdateTaux("80")}}>80 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("90");onSubmitUpdateTaux("90")}}>90 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("100");onSubmitUpdateTaux("100")}}>100 % </a>
                  </div>}
                </div>
              </div>
              <div class="col-4">
              {projetRole!=="chefProjet"&&
                <>
                 <span title="attendre la validation"  style={{fontWeight:"bold",color:"orange",textAlign:"center",fontSize:"12px"}}  >Pas encore </span>

                </>}
              {projetRole==="chefProjet"&&
                <>
                <button title="Refuser" onClick={ (e) =>  {setValide(false);onSubmitUpdateValidé("false");handleShowRaison()}} type="button" href="" className='ms-4 me-1 border  border-top-0 border-end-0  border-start-0 border-bottom-0' style={{backgroundColor:"rgba(221,0,67,.1)",color:"#dd0043",borderRadius:"7px"}}><i class="fa fa-thumbs-down" style={{fontSize:"10px"}} ></i> </button>
                <button title="Valider" onClick={ (e) =>  {setValide(true);onSubmitUpdateValidé("true")}} type="button" href="" className=' border border-top-0 border-end-0  border-start-0 border-bottom-0'  style={{backgroundColor:"rgba(85,185,0,.1)",color:"#55b900",borderRadius:"7px"}}><i class="fa fa-thumbs-up" style={{fontSize:"10px"}} ></i> </button>
                </>}
              </div></>}
               {titreE==="Terminé"&&valide===true&&
              <>
              <div class="col-8 " >
                <div class="dropdown mt-2 pe-2">
                  <div class="progress " style={{height: `17px`}}>
                    {taux==="0" &&<div   style={{fontSize:"9px",paddingLeft:"7px"}} >{taux}%</div>}
                    {taux>"0" &&   <div class="progress-bar" role="progressbar" style={{width: `${taux}%`,fontSize:"9px"}} 
                    aria-valuenow={taux} aria-valuemin="0" aria-valuemax="100">{taux}%</div>}
                  </div>
                  {((projetRole==="chefProjet"||(projetRole==="membre"&&user&&user.user.id===user1.id))&&titreE!=="Terminé")&&
                  <div class="dropdown-content">
                    <a type="button" onClick={ (e) =>  {setTaux("0");onSubmitUpdateTaux("0")}}>0 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("10");onSubmitUpdateTaux("10")}}>10 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("20");onSubmitUpdateTaux("20")}}>20 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("30");onSubmitUpdateTaux("30")}}>30 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("40");onSubmitUpdateTaux("40")}}>40 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("50");onSubmitUpdateTaux("50")}}>50 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("60");onSubmitUpdateTaux("60")}}>60 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("70");onSubmitUpdateTaux("70")}}>70 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("80");onSubmitUpdateTaux("80")}}>80 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("90");onSubmitUpdateTaux("90")}}>90 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("100");onSubmitUpdateTaux("100")}}>100 % </a>
                  </div>}
                </div>
              </div>
              <div class="col-4 ">
                <div title="Validée" className=' mt-2  border border-top-0 border-end-0  border-start-0 border-bottom-0'  style={{fontWeight:"bold",color:"#55b900",textAlign:"center",fontSize:"12px"}} >Validée </div>
              </div></>}
               {projetRole==="chefProjet"&&titreE==="Terminé"&&valide===false&&
              <>
              <div class="col-9">
                <div class="dropdown mt-2 pe-2">
                  <div class="progress " style={{height: `17px`}}>
                    {taux==="0" &&<div   style={{fontSize:"9px",paddingLeft:"7px"}} >{taux}%</div>}
                    {taux>"0" &&   <div class="progress-bar" role="progressbar" style={{width: `${taux}%`,fontSize:"9px"}} 
                    aria-valuenow={taux} aria-valuemin="0" aria-valuemax="100">{taux}%</div>}
                  </div>
                  {((projetRole==="chefProjet"||(projetRole==="membre"&&user&&user.user.id===user1.id))&&titreE!=="Terminé")&&
                  <div class="dropdown-content">
                    <a type="button" onClick={ (e) =>  {setTaux("0");onSubmitUpdateTaux("0")}}>0 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("10");onSubmitUpdateTaux("10")}}>10 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("20");onSubmitUpdateTaux("20")}}>20 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("30");onSubmitUpdateTaux("30")}}>30 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("40");onSubmitUpdateTaux("40")}}>40 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("50");onSubmitUpdateTaux("50")}}>50 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("60");onSubmitUpdateTaux("60")}}>60 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("70");onSubmitUpdateTaux("70")}}>70 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("80");onSubmitUpdateTaux("80")}}>80 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("90");onSubmitUpdateTaux("90")}}>90 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("100");onSubmitUpdateTaux("100")}}>100 % </a>
                  </div>}
                </div>
              </div>
              <div class="col-3">
              
                <button title="Raison"  type="button" onClick={ (e) =>  {handleShowRaison()}} className=' border  border-top-0 border-end-0  border-start-0 border-bottom-0' style={{backgroundColor:"white",color:"#5e666e"}} ><i class="fa fa-exclamation-triangle" style={{fontSize:"13px",color:"red",fontSize:"13px"}} ></i> </button>
                <button title="Recommencer"  type="button" onClick={ (e) =>  {onSubmitRecomencer()}}className=' border  border-top-0 border-end-0  border-start-0 border-bottom-0' style={{backgroundColor:"rgba(221,0,67,.1)",color:"#dd0043",borderRadius:"7px"}}><i class="fa fa-refresh" style={{fontSize:"10px"}} ></i> </button>
                
               
              </div></>}
                 {projetRole!=="chefProjet"&&titreE==="Terminé"&&valide===false&&
              <>
              <div class="col-8">
                <div class="dropdown mt-2 pe-2">
                  <div class="progress " style={{height: `17px`}}>
                    {taux==="0" &&<div   style={{fontSize:"9px",paddingLeft:"7px"}} >{taux}%</div>}
                    {taux>"0" &&   <div class="progress-bar" role="progressbar" style={{width: `${taux}%`,fontSize:"9px"}} 
                    aria-valuenow={taux} aria-valuemin="0" aria-valuemax="100">{taux}%</div>}
                  </div>
                  {((projetRole==="chefProjet"||(projetRole==="membre"&&user&&user.user.id===user1.id))&&titreE!=="Terminé")&&
                  <div class="dropdown-content">
                    <a type="button" onClick={ (e) =>  {setTaux("0");onSubmitUpdateTaux("0")}}>0 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("10");onSubmitUpdateTaux("10")}}>10 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("20");onSubmitUpdateTaux("20")}}>20 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("30");onSubmitUpdateTaux("30")}}>30 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("40");onSubmitUpdateTaux("40")}}>40 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("50");onSubmitUpdateTaux("50")}}>50 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("60");onSubmitUpdateTaux("60")}}>60 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("70");onSubmitUpdateTaux("70")}}>70 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("80");onSubmitUpdateTaux("80")}}>80 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("90");onSubmitUpdateTaux("90")}}>90 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("100");onSubmitUpdateTaux("100")}}>100 % </a>
                  </div>}
                </div>
              </div>
              <div class="col-4">
                {raisonU.length!==0&&
              <>
                <button title="Raison"  type="button" onClick={ (e) =>  {handleShowRaison()}} className=' border  border-top-0 border-end-0  border-start-0 border-bottom-0' style={{backgroundColor:"white",color:"#5e666e"}} ><i class="fa fa-exclamation-triangle" style={{fontSize:"13px",color:"red",fontSize:"13px"}} ></i>  </button>
                <span title="Refusée" className='' style={{fontWeight:"bold",color:"#dd0043",textAlign:"center",fontSize:"12px"}}  >Refusée </span>
              </>} 
                 {raisonU.length===0&&
                <span title="Refusée" className='me-3' style={{fontWeight:"bold",color:"#dd0043",textAlign:"center",fontSize:"12px"}}  >Refusée </span>
                 } 
              </div></>}
                {titreE!=="Terminé"&&
              <>
              <div class="col-8">
                <div class="dropdown mt-2 pe-2">
                  <div class="progress " style={{height: `17px`}}>
                    {taux==="0" &&<div   style={{fontSize:"9px",paddingLeft:"7px"}} >{taux}%</div>}
                    {taux>"0" &&   <div class="progress-bar" role="progressbar" style={{width: `${taux}%`,fontSize:"9px"}} 
                    aria-valuenow={taux} aria-valuemin="0" aria-valuemax="100">{taux}%</div>}
                  </div>
                  {((projetRole==="chefProjet"||(projetRole==="membre"&&user&&user.user.id===user1.id))&&titreE!=="Terminé")&&
                  <div class="dropdown-content">
                    <a type="button" onClick={ (e) =>  {setTaux("0");onSubmitUpdateTaux("0")}}>0 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("10");onSubmitUpdateTaux("10")}}>10 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("20");onSubmitUpdateTaux("20")}}>20 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("30");onSubmitUpdateTaux("30")}}>30 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("40");onSubmitUpdateTaux("40")}}>40 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("50");onSubmitUpdateTaux("50")}}>50 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("60");onSubmitUpdateTaux("60")}}>60 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("70");onSubmitUpdateTaux("70")}}>70 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("80");onSubmitUpdateTaux("80")}}>80 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("90");onSubmitUpdateTaux("90")}}>90 % </a>
                    <a type="button" onClick={ (e) =>  {setTaux("100");onSubmitUpdateTaux("100")}}>100 % </a>
                  </div>}
                </div>
              </div>
              <div class="col-4">
                {titreE==="Bloqué"&&
                  <button title="ProblèmeBlocage"  type="button" onClick={ (e) =>  {handleShowBlocage()}} className='ms-5 border  border-top-0 border-end-0  border-start-0 border-bottom-0' style={{backgroundColor:"white",color:"#5e666e"}} ><i class="fa fa-exclamation-triangle" style={{fontSize:"13px",color:"red",fontSize:"14px"}} ></i> </button>
              }
              </div></>}
            </div>
            <hr class="m-2"/>
            <div class="row " >
              <div class="col-6 ms-2" style={{fontSize:"12px",marginLeft:"5px"}}> 
                <div class="dropdown">
                  {priorite==="Aucune"&&
                  <div class="pe-2" style={{backgroundColor:"rgb(184 188 194)",color:"white",borderRadius:"10px"}} >  
                    {priorite} priorité 
                  </div> }   
                  {priorite==="Basse"&&
                  <div  class="pe-2"  style={{backgroundColor:"rgb(78, 205, 151)",color:"white",borderRadius:"10px"}} >  
                    {priorite} priorité 
                  </div> }
                  {priorite==="Moyenne"&&
                  <div  class="pe-2"  style={{backgroundColor:"rgb(255, 198, 60)",color:"white",borderRadius:"10px"}} >  
                    {priorite} priorité   
                  </div> }  
                  {priorite==="Haute"&&
                  <div class="pe-2"  style={{backgroundColor:"rgb(225, 45, 66)",color:"white",borderRadius:"10px"}} >  
                    {priorite} priorité 
                  </div> } 
                  {  projetRole==="chefProjet" &&
                  <div class="dropdown-content">
                    <a type="button" style={{backgroundColor:"rgb(184 188 194)",color:"white"}} onClick={ (e) =>  {setPriorite("Aucune");onSubmitUpdatePriorité("Aucune")}}>Aucune </a>
                    <a type="button" style={{backgroundColor:"rgb(78, 205, 151)",color:"white"}} onClick={ (e) =>  {setPriorite("Basse");onSubmitUpdatePriorité("Basse")}}>Basse </a>
                    <a type="button"  style={{backgroundColor:"rgb(255, 198, 60)",color:"white"}} onClick={ (e) =>  {setPriorite("Moyenne");onSubmitUpdatePriorité("Moyenne")}}>Moyenne </a>
                    <a type="button"  style={{backgroundColor:"rgb(225, 45, 66)",color:"white"}} onClick={ (e) =>  {setPriorite("Haute");onSubmitUpdatePriorité("Haute")}}>Haute</a>
                  </div>}
                </div>
              </div>
              <div class="col-2 "  > </div>
              <div class="col-3   " style={{fontSize:"12px" }}>
              {user&&user.user.photo&& <img class="rounded-circle" src={require(`../../../assets/uploads/${user.user.photo}`)} width="27px" height="27px" title={user.user.username+" "+user.user.lastname}/>}
                       {user&&!user.user.photo  &&  <img class="rounded-circle"  src={require('../../../assets/img/logos/user.png')} width="27px" height="27px" title={user.user.username+" "+user.user.lastname}/>} 
              </div>
            </div>
          </div>
      </div>
    </div>
    <Modal show={showRaison} >
        <Modal.Header  >
          <Modal.Title>Le raison du refus
            <button  onClick={handleCloseRaison} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"278px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
       
            {  projetRole!=="chefProjet" &&<p className="fs-title" style={{"color":"red",textAlign:"center",fontWeight:"bold"}}>{raisonRefus } </p>}
            {  projetRole==="chefProjet" &&
            <form  enctype="multipart/form-data"  method="post" onSubmit={onSubmitUpdateRaison} >
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison du refus </label>
                    <input className="form-control  form-icon-input" name="titre" value={raisonU}  type="text" onChange={(e)=>setRaisonU(e.target.value)} placeholder="saisir le raison"/>
                </div>
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"    disabled={(!raisonU) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Modifier
                  </button>
              </div>
            </form>}
        </Modal.Body>
    </Modal>
    <Modal show={showBlocage} >
        <Modal.Header  >
          <Modal.Title>Le raison du blocage
            <button  onClick={handleCloseBlocage} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"255px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
       
            { ((user&& user.user.id!==user1.id)||(!user&&projetRole!=="chefProjet"))&&<p className="fs-title" style={{"color":"red",textAlign:"center",fontWeight:"bold"}}>{blocageU } </p>}
            {((user&&user.user.id===user1.id)||(!user&&projetRole==="chefProjet"))&&
            <form  enctype="multipart/form-data"  method="post" onSubmit={onSubmitUpdateBlocage} >
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison du blocage </label>
                    <input className="form-control  form-icon-input" name="titre" value={blocageU}  type="text" onChange={(e)=>setBlocageU(e.target.value)} placeholder="saisir le raison du blocage"/>
                </div>
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"    disabled={(!blocageU) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Modifier
                  </button>
              </div>
            </form>}
        </Modal.Body>
    </Modal>
    <Modal show={show} >
        <Modal.Header  >
          <Modal.Title>Déplacer ou copier ({titre})
            <button  onClick={handleClose} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"12px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {    error &&<p className="fs-title mb-3" style={{"color":"red",textAlign:"center"}}>{error} </p>}

          <form  enctype="multipart/form-data"  method="post" onSubmit={onSubmitDéplacerCopierHandler } >
                   <center class="">
                                       <div class="mb-2" >
                                           <input  className="form-check-input m-1 " type="radio" id="input1" value="Déplacer" name="type" checked={type==="Déplacer"&&true} onChange={(e)=>setType("Déplacer")}  />
                                           <label class="form-check-label m-1 me-3" for="flexRadioDefault2">Déplacer</label>
                                       
                                           <input  className="form-check-input m-1" type="radio" id="input1" value="Copier" name="type" checked={type==="Copier"&&true}  onChange={(e)=>setType("Copier")}/>
                                           <label class="form-check-label  m-1" for="flexRadioDefault2">Copier</label>
                                        </div>
                                               
                                </center>
                
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Phase <span style={{color:"red"}}>*</span></label>
                
                    <select  style={{fontSize:"14px"}} onChange={ (e) => { setIdPhase(e.target.value);setIdEtat("");setTestEtat(!testEtat)}} onClick={() =>{getEtats()}} class="form-select ">
                      
                           <option value="" selected disabled> Choisir la phase</option>
                      
                               {phases.map((item,index)=>
                                      <option   key={item.id} value={item.id}>   {item.titre}</option>)}
                                      
                    </select>
                </div> 
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Etat <span style={{color:"red"}}>*</span></label>
                 
                {testEtat===false&&
                  <select style={{fontSize:"14px"}} onChange={ (e) =>  setIdEtat(e.target.value)} class="form-select">
                             <option value="" selected disabled> Choisir l'état</option>
                                    {etats.map((item,index)=>
                                      <option   key={item.id} value={item.id}>   {item.titre}</option>)}
                    </select> }
                    {testEtat===true&&
                  <select style={{fontSize:"14px"}} onChange={ (e) =>  setIdEtat(e.target.value)} class="form-select">
                             <option value="" selected disabled> Choisir l'état</option>
                                    {etats.map((item,index)=>
                                      <option   key={item.id} value={item.id}>   {item.titre}</option>)}
                    </select> }
                </div>         
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn me-1"   disabled={(!idEtat||!idPhase) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Valider
                  </button>
                 
                  
              </div>
            </form>
        </Modal.Body>
    </Modal>
    
    </>
  );       

  };

  
