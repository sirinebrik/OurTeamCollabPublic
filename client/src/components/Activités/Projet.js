import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';


export default function Projet({id,nom,role,idU,type}) {

    const [tasksProjet,setTasksProjet]= useState([])
    const [tasksProjetValide,setTasksProjetValide]= useState([])
    const [tasksProjetRefus,setTasksProjetRefus]= useState([])
    const [tasksProjetTermine,setTasksProjetTermine]= useState([])
    const [membresProjet,setMembresProjet]= useState([])
    const [mesTasksProjet,setMesTasksProjet]= useState([])
    const [reunions,setReunions]= useState([])
    const [reunionsAnnule,setReunionsAnnule]= useState([])

    const tousMembresProjet = (async () => {
      await Axios.get(`http://localhost:8000/tousMembresProjetChef/${id}`,).then((response)=>{
       setMembresProjet(response.data.users)
       })  });
    useEffect( () => {tousMembresProjet(); },[]) ;
      const TasksProjet = (async () => {
        await Axios.get(`http://localhost:8000/tasksChefProjetTous/${id}`,).then((response)=>{
         setTasksProjet(response.data.tasks)
         })  });
      useEffect( () => {TasksProjet(); },[]) ;

      const MesTasksProjet = (async () => {
        await Axios.get(`http://localhost:8000/tasksMembreTous/${id}/${idU}`,).then((response)=>{
         setMesTasksProjet(response.data.tasks)
         })  });
      useEffect( () => {MesTasksProjet(); },[]) ;
      const tousTasksTermine = (async () => {
        await Axios.get(`http://localhost:8000/tasksUserTermine/${idU}/${id}`,).then((response)=>{
         setTasksProjetTermine(response.data.tasks)
         })  });
      useEffect( () => {tousTasksTermine(); },[]) ;
      const TasksProjetValide = (async () => {
        await Axios.get(`http://localhost:8000/tasksChefProjetValide/${id}`,).then((response)=>{
         setTasksProjetValide(response.data.tasks)
         })  });
      useEffect( () => {TasksProjetValide(); },[]) ;
      const TasksProjetRefus = (async () => {
        await Axios.get(`http://localhost:8000/tasksChefProjetRefus/${id}`,).then((response)=>{
         setTasksProjetRefus(response.data.tasks)
         })  });
      useEffect( () => {TasksProjetRefus(); },[]) ;
      
      const tousReunions = (async () => {
        await Axios.get(`http://localhost:8000/reunionsChefTous/${id}`,).then((response)=>{
         setReunions(response.data.reunions)
         })  });
      useEffect( () => {tousReunions(); },[]) ;
      const reunionsChefAnnule = (async () => {
        await Axios.get(`http://localhost:8000/reunionsChefAnnule/${id}`,).then((response)=>{
         setReunionsAnnule(response.data.reunions)
         })  });
      useEffect( () => {reunionsChefAnnule(); },[]) ;
      
     
return (
<>
    {(type==="Tous"||type==="membres")&&membresProjet.map((item,index)=>(
    <>
    <div class="mt-2" style={{fontSize:"13px"}}>
        <i class="fa  fa-user"></i> Vous avez ajouté le membre
        <span style={{fontWeight:"bold",color:"black"}}>
        {(item.user.roles[0]==="ROLE_CHEFPROJET")&& <Link to={ `/profile/${item.user.id}`} style={{textDecoration:"none"  }}>  {item.user.username} {item.user.lastname} </Link>}
                                          {(item.user.roles[0]==="ROLE_MEMBRE")&& <Link to={ `/profileM/${item.user.id}`} style={{textDecoration:"none"}}>  {item.user.username} {item.user.lastname} </Link>}
                                          {(item.user.roles[0]==="ROLE_CLIENT")&& <Link to={ `/profileC/${item.user.id}`} style={{textDecoration:"none"}}>  {item.user.username} {item.user.lastname} </Link>}        </span> 
        à le projet
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/tableauDeBord/${id}`} style={{textDecoration:"none"  }}>  {nom}  </Link>
        </span>     
    </div>    </>)) } 
    {(type==="Tous"||type==="tâches")&&tasksProjet.map((item,index)=>(
    <>
    <div class="mt-2" style={{fontSize:"13px"}}>
        <i class="fa  fa-tasks"></i> Vous avez ajouté la tâche
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/detailTâche/${id}/${item.id}/${role}`} style={{textDecoration:"none"  }}>  {item.titre}  </Link>
        </span> 
        dans le projet
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/tableauDeBord/${id}`} style={{textDecoration:"none"  }}>  {nom}  </Link>
        </span>     
    </div>    </>)) } 
    {(type==="Tous"||type==="tâches")&&mesTasksProjet.map((item,index)=>(
    <>
    <div class="mt-2" style={{fontSize:"13px"}}>
        <i class="fa  fa-tasks"></i> Vous avez affecté à la tâche
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/detailTâche/${id}/${item.id}/${role}`} style={{textDecoration:"none"  }}>  {item.titre}  </Link>
        </span> 
        dans le projet
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/tableauDeBord/${id}`} style={{textDecoration:"none"  }}>  {nom}  </Link>
        </span>     
    </div>    </>)) } 
 {(type==="Tous"||type==="tâches")&&tasksProjetTermine.map((item,index)=>(
    <>
    <div class="mt-2" style={{fontSize:"13px"}}>
        <i class="fa  fa-tasks"></i> Vous avez terminé la tâche
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/detailTâche/${id}/${item.id}/${role}`} style={{textDecoration:"none"  }}>  {item.titre}  </Link>
        </span> 
        dans le projet
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/tableauDeBord/${id}`} style={{textDecoration:"none"  }}>  {nom}  </Link>
        </span>     
    </div>    </>)) } 
 {(type==="Tous"||type==="tâches")&&tasksProjetValide.map((item,index)=>(
    <>
    <div class="mt-2" style={{fontSize:"13px"}}>
        <i class="fa  fa-tasks"></i> Vous avez validé la tâche
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/detailTâche/${id}/${item.id}/${role}`} style={{textDecoration:"none"  }}>  {item.titre}  </Link>
        </span> 
        dans le projet
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/tableauDeBord/${id}`} style={{textDecoration:"none"  }}>  {nom}  </Link>
        </span>     
    </div>    </>
                               
)) } 
 {(type==="Tous"||type==="tâches")&&tasksProjetRefus.map((item,index)=>(
    <>
    <div class="mt-2" style={{fontSize:"13px"}}>
        <i class="fa  fa-tasks"></i> Vous avez refusé la tâche
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/detailTâche/${id}/${item.id}/${role}`} style={{textDecoration:"none"  }}>  {item.titre}  </Link>
        </span> 
        dans le projet
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/tableauDeBord/${id}`} style={{textDecoration:"none"  }}>  {nom}  </Link>
        </span>     
    </div>    </>
                               
)) } 
{(type==="Tous"||type==="réunions")&&reunions.map((item,index)=>(
    <>
     <div class="mt-2" style={{fontSize:"13px"}}>
        <i class="fa   fa-briefcase"></i> Vous avez ajouté une réunion
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/détailRéunion/${item.user.projet.id}/${item.user.role}/${item.reunion.id}`} style={{textDecoration:"none"  }}>  {item.reunion.titre}  </Link>
        </span> 
        dans le projet
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/tableauDeBord/${id}`} style={{textDecoration:"none"  }}>  {nom}  </Link>
        </span>     
    </div> 
    </>)) }
 {(type==="Tous"||type==="réunions")&&reunionsAnnule.map((item,index)=>(
    <>
    <div class="mt-2" style={{fontSize:"13px"}}>
        <i class="fa  fa-briefcase"></i> Vous avez annulé la réunion
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/détailRéunion/${item.user.projet.id}/${item.user.role}/${item.reunion.id}`} style={{textDecoration:"none"  }}>  {item.reunion.titre}  </Link>
        </span> 
        dans le projet
        <span style={{fontWeight:"bold",color:"black"}}>
          <Link to={ `/tableauDeBord/${id}`} style={{textDecoration:"none"  }}>  {nom}  </Link>
        </span>     
    </div>    </>
                               
)) } 
    </>
 )
}

  

