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

    </>
 )
}

  

