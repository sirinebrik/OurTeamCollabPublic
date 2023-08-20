import React,{ useEffect, useState } from 'react'
import $ from 'jquery'; 
import logo from "../../assets/img/logos/logo.png"
import { me } from "../../service/user"
import { Link,useNavigate,useParams } from "react-router-dom"
import jwt_decode from "jwt-decode";
import Axios from 'axios'
import EmailNotif from '../Email/EmailNotif';
import Contact from '../Message/Contact';
import ContactNotif from '../Message/ContactNotif';

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

    const [emailNotif,setEmailNotif]= useState([])
const getEmailNotif = (async () => {
await Axios.get(`http://localhost:8000/emailNotif/${user1.id}`
)
.then((response)=>{
setEmailNotif(response.data.email) 
setNb(response.data.nb) 
})  });
useEffect( () => {const interval = setInterval(getEmailNotif, 5000); // Appel toutes les 5 secondes

return () => {
  clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
  console.error = () => {}
};
}, []);

const [contact,setContact]= useState([])
const getContact = (async () => {
  await Axios.get(`http://localhost:8000/message/${user1.id}`
  )
  .then((response)=>{
  setContact(response.data.message)
  setNbM(response.data.nbM) 

  })  });
  useEffect( () => {const interval = setInterval(getContact, 5000); // Appel toutes les 5 secondes
  
  return () => {
    clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
    console.error = () => {}
  };
  }, []);

const onSubmitHandler = (e) => {
  e.preventDefault()
 Axios.post(`http://localhost:8000/marquerLu/${user1.id}`,{
      headers: {
          "Content-Type": "multipart/form-data",
      }
  })
    .then((res) => { 
      setNb(0)
     getEmailNotif()})}
   
     const onSubmitHandlerM = (e) => {
      e.preventDefault()
     Axios.post(`http://localhost:8000/marquerLuMessages/${user1.id}`,{
          headers: {
              "Content-Type": "multipart/form-data",
          }
      })
        .then((res) => { 
          setNbM(0)
         getContact()})}
  return(
<nav class="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row" >
  <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start border border-3 border-end-0 border-start-0 border-top-0 " style={{backgroundColor:'white'}}>
    <a class=" brand-logo" href="/dashboard">
        <img src={logo} width="150px" height="80px" />
    </a>
  </div>
  <div class="navbar-menu-wrapper d-flex align-items-top border border-3 border-top-0 border-start-0 border-end-0" style={{backgroundColor:'white'}}> 
    
    <ul class="navbar-nav " style={{marginLeft:"1100px",position:"fixed"}}>
      <li class="nav-item dropdown" width="200px"> 
        <a class="nav-link count-indicator" id="countDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="icon-mail iconimg" style={{fontSize:"23x",}}></i>
          {nb!==0&&
          <span class="count" style={{padding:"6px",paddingRight:"10px",paddingTop:"7px",paddingBottom:"7px",display:'flex',alignItems:"center",
          justifyItems:"center" ,fontSize:"11px",position:"absolute",backgroundColor:"red"}}>{nb}</span>}
        </a>
        <div class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="countDropdown">
          <div class="dropdown-item py-3 " >
            <p class="mb-0 font-weight-medium float-left">Vous avez {nb} mail(s) non lu(s)</p>
            <Link to={ `/emails`} style={{textDecoration:"none"}}>
               <span class="badge badge-pill badge-primary float-right">Tout voir</span>
            </Link>
            {nb!==0&&
            <span  class="badge badge-pill badge-primary float-right" onClick={onSubmitHandler}>Tout marquer comme lu </span>}
          </div>
          <div class="dropdown-divider"></div>
          <div style={{maxHeight: "400px", "overflow-y": "auto"}}>
          {emailNotif.map((item,index)=>
          <EmailNotif id={item.id} key={item.id} objet={item.objet} status={item.status} logo={logo} 
          date={item.date} heure={item.heure} nb={nb}/>
        )}
         </div> 
        </div>
      </li>
      <li class="nav-item dropdown" width="200px"> 
        <a class="nav-link count-indicator" id="countDropdown1" href="#" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fa fa-comments-o" style={{fontSize:"23x",}}></i>
          {nbM!==0&&
          <span class="count" style={{padding:"6px",paddingRight:"10px",paddingTop:"7px",paddingBottom:"7px",display:'flex',alignItems:"center",
          justifyItems:"center" ,fontSize:"11px",position:"absolute",backgroundColor:"red"}}>{nbM}</span>}
        </a>
        <div class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="countDropdown1">
          <div class="dropdown-item py-3 " >
          <p class="mb-0 font-weight-medium float-left">Vous avez {nbM} message(s) non lu(s)</p>
            <Link to={ `/messages`} style={{textDecoration:"none"}}>

               <span class="badge badge-pill badge-primary float-right">Tout voir</span>
            </Link>
            {nbM!==0&&
            <span  class="badge badge-pill badge-primary float-right" onClick={onSubmitHandlerM}>Tout marquer comme lu </span>}
          </div>
          <div class="dropdown-divider"></div>
          <div style={{maxHeight: "400px", "overflow-y": "auto"}}>
          {contact.map((item,index)=>
            <ContactNotif id={item.id}   to={item.toUser} from={item.fromUser}  contenu={(jwt_decode(item.contenu)).contenu} date={item.dateEnvoi} heure={item.heureEnvoi} messageLu={item.messageLu}/> 

        )}
         </div> 
        </div>
      </li>
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
          <a class="dropdown-item" href="/messages"><i class="dropdown-item-icon mdi mdi-message-text-outline text-primary me-2"></i> Messages</a>
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