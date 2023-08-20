import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import ProjetM from "./ProjetM";


export default function ActivitésMembre({id,type}) {

    const [projets,setProjets]= useState([])
    
      const tousProjets = (async () => {
        await Axios.get(`http://localhost:8000/projetU/${id}`,).then((response)=>{
         setProjets(response.data.projets)
         })  });
      useEffect( () => {tousProjets(); },[]) ;

    
      
return (
<>
<div class="mt-3 me-3">
{(type==="Tous"||type==="projets")&&projets.map((item,index)=>(
    <div class="mt-2" style={{fontSize:"13px"}}>
        <i class="fa  fa-cube"></i> Vous avez ajouté à le projet
        <span style={{fontWeight:"bold",color:"black"}}>
        <Link to={ `/tableauDeBord/${item.projet.id}`} style={{textDecoration:"none"  }}>  {item.projet.nom}  </Link>
        </span> 
        comme 
        {(item.role==="chefProjet")&&(<span style={{color:"black",fontWeight:"bold"}}> Chef de projet </span>)}
         {(item.role==="client")&&(<span style={{color:"black",fontWeight:"bold"}}> Client </span>)}
         {(item.role==="membre")&&(<span style={{color:"black",fontWeight:"bold"}}> Membre </span>)}
    </div>)) }
{projets.map((item,index)=>(
    <>
      <ProjetM id={item.projet.id} nom={item.projet.nom} role={item.role} idU={id} type={type}/>
    </>)) }


</div>
</>



       )
}

  

