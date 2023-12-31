import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import Navbar from "../Page/Navbar";
import Sidebar from "../Page/Sidebar";
import jwt_decode from "jwt-decode";
import ProjetM from "./ProjetM";

export default function NavbarActivitésMembre() {
    const [isLoding, setIsLoding] = useState(true);
    let user = jwt_decode(localStorage.getItem("token"));
    let userRole=user.roles[0]
    const [projets,setProjets]= useState([])
    const [type,setType]= useState("Tous")

      const tousProjets = (async () => {
        await Axios.get(`http://localhost:8000/projetU/${user.id}`,).then((response)=>{
         setProjets(response.data.projets)
         setIsLoding(false);

         })  });
      useEffect( () => {tousProjets(); },[]) ;
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
                    <div class="col-2"> 
                    </div>
                    <div class="col-8"> 
                        <div class="card card-rounded border border-3 mt-5">
                            <div class="card-body" style={{maxHeight: "600px", "overflow-y": "auto"}}>
                            <div class="row">
                                  <div class="col-8">
                                     <div style={{fontSize:"14px",fontWeight:"bold",color:"#06868D"}}>
                                       Activités
                                    </div>
                                  </div>
                                  <div class="col-4">
                               <select value={type} style={{fontSize:"12px"}} onChange={ (e) => { setType(e.target.value)}}   class="form-select ">
                                   <option value="Tous" selected > Toutes les activités</option>
                                   <option value="projets" selected > Tous les projets</option>
                                   <option value="tâches" selected > Toutes les tâches</option>
                                   <option value="membres" selected > Tous les membres du projet</option>
                                </select> 
                                </div>
                            </div>
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
                                   <ProjetM id={item.projet.id} nom={item.projet.nom} role={item.role} idU={user.id} type={type}/>
                                </>)) }
                                </div>
                            </div>
                        </div>
                    </div>
                     <div class="col-2"> 
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
}
</>



       )
}

  

