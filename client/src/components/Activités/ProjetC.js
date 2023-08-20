import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';


export default function ProjetC({id,nom,role,idU,type}) {

    const [mesReunions,setMesReunions]= useState([])
    

      const MesReunions = (async () => {
        await Axios.get(`http://localhost:8000/reunionClientTous/${id}/${idU}`,).then((response)=>{
         setMesReunions(response.data.reunions)
         })  });
      useEffect( () => {MesReunions(); },[]) ;
     
      
     
return (
<>
{(type==="Tous"||type==="réunions")&&mesReunions.map((item,index)=>(
    <>
     <div class="mt-2" style={{fontSize:"13px"}}>
        <i class="fa   fa-briefcase"></i> Vous avez invité à une réunion
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/détailRéunion/${item.user.projet.id}/${item.user.role}/${item.reunion.id}`} style={{textDecoration:"none"  }}>  {item.reunion.titre}  </Link>
        </span> 
        dans le projet
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/tableauDeBord/${id}`} style={{textDecoration:"none"  }}>  {nom}  </Link>
        </span>     
    </div> 
    </>)) }
    </>
 )
}

  

