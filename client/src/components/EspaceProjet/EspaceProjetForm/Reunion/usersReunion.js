import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams } from "react-router-dom"
import Navbar from "../../../Page/Navbar";
import Sidebar from "../../../Page/Sidebar";
import Modal from 'react-bootstrap/Modal';
import Select  from "react-select";
import moment from 'moment';

export default function UsersReunion({archive,idR,id,projetRole,idUser,idParticip,NonPresence,OuiPresence,heureDebut,heureFin,date,annule,presence}) {
  let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]
   
      const handleNonPresence = () => {
        NonPresence(idParticip);
      };
      const handleOuiPresence = () => {
       OuiPresence(idParticip);
      };
 
var beginningTime = moment(date+" "+heureDebut+":00");
var endTime = moment(date+" "+heureFin+":00");
var Time = moment(new Date());

return (
<td   >
    {annule ===false &&presence===null&&Time.isBefore(endTime)&&archive===false&&(projetRole==="chefProjet"||idUser===user.id)&&
    <>
    <button type="button" title="Oui" className='ms-1 border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleOuiPresence} style={{backgroundColor:"green",color:"white"}}>
      <i class="fa fa-check" style={{fontSize:"14px"}}></i> 
    </button>
     <button type="button" title="Non" className='border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleNonPresence} style={{backgroundColor:"red",color:"white"}}>
     <i class="fa fa-remove" style={{fontSize:"14px"}}></i> 
   </button></>}
   {annule ===false &&presence===null&&Time.isBefore(endTime)&&archive===true&&(projetRole==="chefProjet"||idUser===user.id)&&
    <>
               <span title="Pas encore" className='me-1  pe-1' style={{fontWeight:"bold",color:"orange",textAlign:"center",fontSize:"12px"}}  >Pas encore </span>
</>}
   {annule ===false &&presence===null&&Time.isBefore(endTime)&&(projetRole!=="chefProjet"&&idUser!==user.id)&&
    <>
           <span title="Pas encore" className='me-1  pe-1' style={{fontWeight:"bold",color:"orange",textAlign:"center",fontSize:"12px"}}  >Pas encore </span>
</>}

    {annule ===false &&presence===false&&Time.isBefore(endTime)&&archive===false&&(projetRole==="chefProjet"||idUser===user.id)&&
    <>
    <button type="button" title="Oui" className='border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleOuiPresence} style={{backgroundColor:"green",color:"white"}}>
      <i class="fa fa-check" style={{fontSize:"14px"}}></i> 
    </button>
    <span title="Non" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Non </span>
   
    </>}
    {annule ===false &&presence===false&&Time.isBefore(endTime)&&(projetRole!=="chefProjet"&&idUser!==user.id)&&
    <>
    <span title="Non" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Non </span>
   
    </>}
    {annule ===false &&presence===true&&Time.isBefore(endTime)&&archive===false&&(projetRole==="chefProjet"||idUser===user.id)&&
    <>
    <span title="Oui" className='me-1  pe-1' style={{fontWeight:"bold",color:"green",textAlign:"center",fontSize:"12px"}}  >Oui </span>
    <button type="button" title="Non" className='border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleNonPresence} style={{backgroundColor:"red",color:"white"}}>
     <i class="fa fa-remove" style={{fontSize:"14px"}}></i> 
   </button>
  
    </>}
    {annule ===false &&presence===true&&Time.isBefore(endTime)&&archive===true&&(projetRole==="chefProjet"||idUser===user.id)&&
    <>
        <span title="Oui" className='me-1  pe-1' style={{fontWeight:"bold",color:"green",textAlign:"center",fontSize:"12px"}}  >Oui </span>

  
    </>}
    {annule ===false &&presence===true&&Time.isBefore(endTime)&&(projetRole!=="chefProjet"&&idUser!==user.id)&&
    <>
    <span title="Oui" className='me-1  pe-1' style={{fontWeight:"bold",color:"green",textAlign:"center",fontSize:"12px"}}  >Oui </span>
    </>}
   
    {annule ===true&&
    <>
        <span title="Pas de réunion" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Pas de réunion </span>

    </>}
    {((annule ===false&&presence===null&&(Time.isAfter(endTime)))&&archive===true)&&
    <>
        <span title="Non" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Non </span>

    </>}
    {((annule ===false&&presence===null&&(Time.isAfter(endTime)))&&archive===false)&&
    <>
        <span title="Non" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Non </span>

    </>}
    {(annule ===false&&presence===false&&Time.isAfter(endTime)&&archive===true)&&
    <>
    <span title="Non" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Non </span>

    </>}
    {(annule ===false&&presence===false&&Time.isAfter(endTime)&&archive===false)&&
    <>
    <span title="Non" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Non </span>

    </>}
    {((annule ===false&&presence===true&&(Time.isAfter(endTime))))&&(projetRole!=="chefProjet"||archive===true)&&
    <>
    <span title="Oui" className='me-1  pe-1' style={{fontWeight:"bold",color:"green",textAlign:"center",fontSize:"12px"}}  >Oui </span>

    </>}
    {annule ===false&&presence===true&&Time.isAfter(endTime)&&(projetRole==="chefProjet"&&archive===false)&&
    <>
 <span title="Oui" className='me-1  pe-1' style={{fontWeight:"bold",color:"green",textAlign:"center",fontSize:"12px"}}  >Oui </span>
    <button type="button" title="Non" className='border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleNonPresence} style={{backgroundColor:"red",color:"white"}}>
     <i class="fa fa-remove" style={{fontSize:"14px"}}></i> 
   </button>
    </>}
</td >

       )
}

  

