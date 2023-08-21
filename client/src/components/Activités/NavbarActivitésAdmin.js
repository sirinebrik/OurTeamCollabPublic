import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import Navbar from "../Page/Navbar";
import Sidebar from "../Page/Sidebar";
import jwt_decode from "jwt-decode";


export default function NavbarActivitésAdmin() {
  let user = jwt_decode(localStorage.getItem("token"));

    const [isLoding, setIsLoding] = useState(true);
    const [users,setUsers]= useState([])
    const [projets,setProjets]= useState([])
    const [tousProjetsArchi,setProjetsArchi]= useState([])
    const [usersProjetRole,setUsersProjetRole]= useState([])
    const [type,setType]= useState("Tous")

    const tousUsers = (async () => {
        await Axios.get(`http://localhost:8000/tousUsers/${user.org}`,).then((response)=>{
         setUsers(response.data.users)
         setIsLoding(false);

         })  });
      useEffect( () => {tousUsers(); },[]) ;

      const tousProjets = (async () => {
        await Axios.get(`http://localhost:8000/tousProjets/${user.org}`,).then((response)=>{
         setProjets(response.data.projets)
         })  });
      useEffect( () => {tousProjets(); },[]) ;
      const TousProjetsArchi = (async () => {
        await Axios.get(`http://localhost:8000/tousProjetsArchi/${user.org}`,).then((response)=>{
         setProjetsArchi(response.data.projets)
         })  });
      useEffect( () => {TousProjetsArchi(); },[]) ;
      const UsersProjetRole = (async () => {
        await Axios.get(`http://localhost:8000/tousProjetsRole/${user.org}`,).then((response)=>{
         setUsersProjetRole(response.data.users)
         })  });
      useEffect( () => {UsersProjetRole(); },[]) ;
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
                                   <option value="utilisateurs" selected > Tous les utilisateurs</option>
                                   <option value="projets" selected > Tous les projets</option>
                                   <option value="membres" selected > Tous les chefs de projet et les clients du projets</option>
                                </select> 
                                </div>
                            </div>
                               <div class="mt-3 me-3">
                                   {(type==="Tous"||type==="utilisateurs")&&users.map((item,index)=>(
                                      <>
                                     <div class="mt-2" style={{fontSize:"13px"}}>
                                         <i class="fa fa-user"></i> Vous avez ajouté 
                                         <span style={{fontWeight:"bold",color:"black"}}>
                                            {(item.roles[0]==="ROLE_CHEFPROJET")&& <Link to={ `/profile/${item.id}`} style={{textDecoration:"none"  }}>  {item.username} {item.lastname} </Link>}
                                            {(item.roles[0]==="ROLE_MEMBRE")&& <Link to={ `/profileM/${item.id}`} style={{textDecoration:"none"}}>  {item.username} {item.lastname} </Link>}
                                            {(item.roles[0]==="ROLE_CLIENT")&& <Link to={ `/profileC/${item.id}`} style={{textDecoration:"none"}}>  {item.username} {item.lastname} </Link>}
                                         </span> comme 
                                         {(item.roles[0]==="ROLE_CHEFPROJET")&&(<span style={{color:"black",fontWeight:"bold"}}> Chef de projet </span>)}
                                         {(item.roles[0]==="ROLE_MEMBRE")&&(<span style={{color:"black",fontWeight:"bold"}}> Membre </span>)}
                                         {(item.roles[0]==="ROLE_CLIENT")&&(<span style={{color:"black",fontWeight:"bold"}}> Client </span>)}
                                    </div>
                                    </>)) }
                                   {(type==="Tous"||type==="projets")&&projets.map((item,index)=>(
                                     <>
                                    <div class="mt-2" style={{fontSize:"13px"}}>
                                    <i class="fa  fa-cube"></i> Vous avez créé le projet
                                   <span style={{fontWeight:"bold",color:"black"}}>
                                      <Link to={ `/tableauDeBord/${item.id}`} style={{textDecoration:"none"  }}>  {item.nom}  </Link>
                                    </span> 
                                    </div>
                                    </>)) }
                                    {(type==="Tous"||type==="membres")&&usersProjetRole.map((item,index)=>(
                                    <>
                                    <div class="mt-2" style={{fontSize:"13px"}}>
                                       <i class="fa fa-user"></i> Vous avez ajouté 
                                       <span style={{fontWeight:"bold",color:"black"}}>
                                          {(item.user.roles[0]==="ROLE_CHEFPROJET")&& <Link to={ `/profile/${item.user.id}`} style={{textDecoration:"none"  }}>  {item.user.username} {item.user.lastname} </Link>}
                                          {(item.user.roles[0]==="ROLE_MEMBRE")&& <Link to={ `/profileM/${item.user.id}`} style={{textDecoration:"none"}}>  {item.user.username} {item.user.lastname} </Link>}
                                          {(item.user.roles[0]==="ROLE_CLIENT")&& <Link to={ `/profileC/${item.user.id}`} style={{textDecoration:"none"}}>  {item.user.username} {item.user.lastname} </Link>}
                                       </span> 
                                        à le projet
                                        <span style={{fontWeight:"bold",color:"black"}}>
                                          <Link to={ `/tableauDeBord/${item.projet.id}`} style={{textDecoration:"none"  }}>  {item.projet.nom}  </Link>
                                        </span> 
                                        comme 
                                       {(item.role==="chefProjet")&&(<span style={{color:"black",fontWeight:"bold"}}> Chef de projet </span>)}
                                       {(item.role==="client")&&(<span style={{color:"black",fontWeight:"bold"}}> Client </span>)}
                                    </div>
                                    </>)) }
                                    {(type==="Tous"||type==="projets")&&tousProjetsArchi.map((item,index)=>(
                                    <>
                                    <div class="mt-2" style={{fontSize:"13px"}}>
                                       <i class="fa fa-cube"></i> Vous avez archivé le projet
                                      <span style={{fontWeight:"bold",color:"black"}}>
                                         <Link to={ `/tableauDeBord/${item.id}`} style={{textDecoration:"none"  }}>  {item.nom}  </Link>
                                      </span> 
                                    </div>
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

  

