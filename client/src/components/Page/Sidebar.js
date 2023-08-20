import React,{ useEffect, useState } from 'react'
import $ from 'jquery'; 
import logo from "../../assets/img/logos/logo.png"
import { me } from "../../service/user"
import { Link, useNavigate } from "react-router-dom"
import jwt_decode from "jwt-decode";
import Axios from 'axios'

export default function Sidebar() {
  const [user, setUser] = useState([])
  let user1 = jwt_decode(localStorage.getItem("token"));
  let role=user1.roles[0]
  
  useEffect(() => {
    const fetchMe = async () => {
      try{
      const user1 = await me()
      setUser(user1)
     }catch(e){ }}
    fetchMe()
  }, [])  

  const [info,setInfo]= useState([])
  const [infoRole,setInfoRole]= useState("")
  const getInfo = (async () => {
    await Axios.get(`http://localhost:8000/infoUser/${user1.id}`
    )
    .then((response)=>{
    setInfo(response.data.user[0]) 
    setInfoRole(response.data.user[0].roles[0])  })  });
    useEffect( () => {getInfo();},[]);
    console.error = () => {}
  return(
<nav class="sidebar sidebar-offcanvas  border border-3 border-top-0 border-start-0" id="sidebar" style={{backgroundColor:'white'}}>
        <ul class="nav" style={{marginTop:'20px'}}>
          <li class="nav-item">
            <a class="nav-link" href="/dashboard">
              <i class="mdi mdi-grid-large menu-icon"></i>
              <span class="menu-title" >Tableau de bord</span>
            </a>
          </li>
          <li class="nav-item nav-category">Espaces</li>
          {(infoRole!=="ROLE_CLIENT") &&<li class="nav-item">
            <a class="nav-link"  href="/utilisateurs" >
              <i class="menu-icon mdi mdi-account-multiple"></i>
              <span class="menu-title">Utilisateurs</span>
            </a>
          </li>}
          <li class="nav-item">
            <a class="nav-link"  href="/projets" >
              <i class="menu-icon mdi mdi-checkbox-multiple-marked"></i>
              <span class="menu-title">Projets</span>  
            </a>
          </li>
          
          <li class="nav-item nav-category">Mon Profil</li>
          <li class="nav-item">
          {(infoRole==="ROLE_CHEFPROJET")&&
                       <Link class="nav-link" to={ `/profile/${user1.id}`} style={{textDecoration:"none"}}>  
            
              <i class="menu-icon mdi mdi-account-circle-outline"></i>
              <span class="menu-title">{info.username} {info.lastname}</span>
              
              </Link>}
              {(infoRole==="ROLE_CLIENT")&&
                       <Link class="nav-link" to={ `/profileC/${user1.id}`} style={{textDecoration:"none"}}>  
            
              <i class="menu-icon mdi mdi-account-circle-outline"></i>
              <span class="menu-title">{info.username} {info.lastname}</span>
              
              </Link>}
              {(infoRole==="ROLE_MEMBRE")&&
                       <Link class="nav-link" to={ `/profileM/${user1.id}`} style={{textDecoration:"none"}}>  
            
              <i class="menu-icon mdi mdi-account-circle-outline"></i>
              <span class="menu-title">{info.username} {info.lastname}</span>
              
              </Link>}
              {(infoRole==="ROLE_ADMIN")&&
                       <Link class="nav-link" to={ `/profileA/${user1.id}`} style={{textDecoration:"none"}}>  
            
              <i class="menu-icon mdi mdi-account-circle-outline"></i>
              <span class="menu-title ">{info.username} {info.lastname}</span>
              
              </Link>}
            
          </li>
          
        </ul>
      </nav>
  )}