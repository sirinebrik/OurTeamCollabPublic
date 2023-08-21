import React,{ useEffect, useState } from 'react'
import $ from 'jquery'; 
import logo from "../../assets/img/logos/logo.png"
import { me } from "../../service/user"
import { Link,useNavigate,useParams } from "react-router-dom"
import jwt_decode from "jwt-decode";
import Axios from 'axios'


export default function Navbar() {
  let user1 = jwt_decode(localStorage.getItem("token"));
  let role1=user1.roles[0]
  function logout(){
    localStorage.clear();}
  const [user, setUser] = useState([])
  const [role, setRole] = useState("")
  const [nb, setNb] = useState(0)
  const [nbM, setNbM] = useState(0)
  useEffect(() => {
    const fetchMe = async () => {
      try{
      const user1 = await me()
      setUser(user1)
      setRole(user1.roles[0])}catch(e){} }
    fetchMe()}, [])  
     
    const [info,setInfo]= useState([])
    const [infoRole,setInfoRole]= useState("")
    const getInfo = (async () => {
      await Axios.get(`http://localhost:8000/infoUser/${user1.id}`
      )
      .then((response)=>{
      setInfo(response.data.user[0]) 
      setInfoRole(response.data.user[0].roles[0])  })  });
      useEffect( () => {getInfo();},[]);


   
  return(
<nav class="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row" >
  <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start border border-3 border-end-0 border-start-0 border-top-0 " style={{backgroundColor:'white'}}>
    <a class=" brand-logo" href="/dashboard">
        <img src={logo} width="150px" height="80px" />
    </a>
  </div>
  <div class="navbar-menu-wrapper d-flex align-items-top border border-3 border-top-0 border-start-0 border-end-0" style={{backgroundColor:'white'}}> 
    
    <ul class="navbar-nav " style={{marginLeft:"1100px",position:"fixed"}}>
     
    
      <li class="nav-item dropdown d-none d-lg-block user-dropdown">
        <a class="nav-link" id="UserDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
          {!info.photo  &&  <img class="img-xs rounded-circle"  src={require('../../assets/img/logos/user.png')} alt="Profile image"/>} 
          {info.photo  &&  <img class="img-xs rounded-circle"  src={require(`../../assets/uploads/${info.photo}`)} alt="Profile image"/>} </a>
         <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
          <div class="dropdown-header text-center">
          
            <p class="mb-1 mt-3 font-weight-semibold" style={{fontWeight:"bold"}}>{info.username} {info.lastname}</p>
            <p class="fw-light text-muted mb-0">{info.email}</p>
            <p class="" style={{color:"#06868D",fontWeight:"bold"}}>
              {(infoRole==="ROLE_ADMIN")&&(<div>Administrateur</div>)}
              {(infoRole==="ROLE_CHEFPROJET")&&(<div>Chef de projet</div>)}
              {(infoRole==="ROLE_MEMBRE")&&(<div>Membre</div>)}
              {(infoRole==="ROLE_CLIENT")&&(<div>Client</div>)}
            </p>
          </div>
        
          {(infoRole==="ROLE_CHEFPROJET")&&
                       <Link class="dropdown-item" to={ `/profile/${user1.id}`} style={{textDecoration:"none"}}>  
            
            <i class="dropdown-item-icon mdi mdi-account-outline text-primary me-2"></i> Mon profil
              
              </Link>}
              {(infoRole==="ROLE_CLIENT")&&
                       <Link class="dropdown-item" to={ `/profileC/${user1.id}`} style={{textDecoration:"none"}}>  
            
            <i class="dropdown-item-icon mdi mdi-account-outline text-primary me-2"></i> Mon profil
              
              </Link>}
              {(infoRole==="ROLE_MEMBRE")&&
                       <Link class="dropdown-item" to={ `/profileM/${user1.id}`} style={{textDecoration:"none"}}>  
            
            <i class="dropdown-item-icon mdi mdi-account-outline text-primary me-2"></i> Mon profil
              
              </Link>}
              {(infoRole==="ROLE_ADMIN")&&
                       <Link class="dropdown-item" to={ `/profileA/${user1.id}`} style={{textDecoration:"none"}}>  
            
            <i class="dropdown-item-icon mdi mdi-account-outline text-primary me-2"></i> Mon profil
              
              </Link>}
          {(infoRole==="ROLE_ADMIN")&&
                       <Link class="dropdown-item" to={ `/activités`} style={{textDecoration:"none"}}>  
            
            <i class="dropdown-item-icon mdi mdi-calendar-check-outline text-primary me-2"></i> Activités
              
              </Link>}
              {(infoRole==="ROLE_CHEFPROJET")&&
                       <Link class="dropdown-item" to={ `/activitésChefProjet`} style={{textDecoration:"none"}}>  
            
            <i class="dropdown-item-icon mdi mdi-calendar-check-outline text-primary me-2"></i> Activités
              
              </Link>}
              {(infoRole==="ROLE_MEMBRE")&&
                       <Link class="dropdown-item" to={ `/activitésMembre`} style={{textDecoration:"none"}}>  
            
            <i class="dropdown-item-icon mdi mdi-calendar-check-outline text-primary me-2"></i> Activités
              
              </Link>}
              {(infoRole==="ROLE_CLIENT")&&
                       <Link class="dropdown-item" to={ `/activitésClient`} style={{textDecoration:"none"}}>  
            
            <i class="dropdown-item-icon mdi mdi-calendar-check-outline text-primary me-2"></i> Activités
              
              </Link>}
          <a class="dropdown-item" onClick={logout} href="/"><i class="dropdown-item-icon mdi mdi-power text-primary me-2"></i>Se déconnecter</a>
        </div>
      </li>
    </ul>
    
  </div>
</nav>
)}