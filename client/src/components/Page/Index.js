
import React,{ useEffect, useState } from 'react'
import $ from 'jquery'; 
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import logo from "../../assets/img/logos/logo.png"
import { me } from "../../service/user"

import "../../template/js/dashboard.js"
import { Link,useNavigate,useParams } from "react-router-dom"
import jwt_decode from "jwt-decode";
import Axios from 'axios'
import { Pie ,Line,Bar} from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend  ,CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,} from 'chart.js';
import IndexAdmin from './IndexAdmin';
import IndexChef from './IndexChef';
import IndexClient from './IndexClient';
import IndexMembre from './IndexMembre';

ChartJS.register(ArcElement, Tooltip, Legend,CategoryScale, LinearScale, PointElement, LineElement, Title,BarElement);
export default function Index() {
  function logout(){
    localStorage.clear();}
    const [isLoding, setIsLoding] = useState(true);

  const [user, setUser] = useState([])
  const [typeSelect, setTypeSelect] = useState("utilisateurs") 
  const [type, setType] = useState("membre")   
  const [role, setRole] = useState("")

  let user1 = jwt_decode(localStorage.getItem("token"));
  let role1=user1.roles[0]
  const options = {
    plugins: {
      legend: {
        position: 'left',
      labels: {
          usePointStyle: true,
          pointStyle: 'circle',}}},}
  useEffect(() => {
    const fetchMe = async () => {
      try{
      const user1 = await me()
      setUser(user1)
      setRole(user1.roles[0])
      setIsLoding(false);
   }catch(e){}}
    fetchMe()
  }, [])   

return(
<>
{isLoding ?<div class="loading bar">
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
                        {role==="ROLE_ADMIN"&&
                          <div class=" mt-3" style={{color:'white' ,borderColor:"#06868D",textAlign:"center" }}>
                             <ul class="nav " >
                                 <li class="nav-item">
                                 {typeSelect==="utilisateurs"&&
                                    <button  class="nav-link border border-top-0 border-end-0  border-start-0 pe-4 ps-4"  onClick={ (e) =>  {setTypeSelect("utilisateurs");}}   style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                                       <span class="menu-title" > Utilisateurs</span>
                                    </button>}
                                 {typeSelect==="projets"&&
                                    <button type="button" class="nav-link border border-top-0 border-end-0 border-start-0 border-info pe-4 ps-4"  onClick={ (e) =>  {setTypeSelect("utilisateurs");}}   style={{color:"#06868D",fontSize:"14px", borderBottom: "4px solid black" }}>
                                       <span class="menu-title" > Utilisateurs</span>
                                    </button>}
                                    {typeSelect==="PU"&&
                                    <button type="button" class="nav-link border border-top-0 border-end-0 border-start-0 border-info "  onClick={ (e) =>  {setTypeSelect("utilisateurs");}}   style={{color:"#06868D",fontSize:"14px", borderBottom: "4px solid black" }}>
                                       <span class="menu-title" > Utilisateurs </span>
                                    </button>}
                               
                                  </li>
                                  <li class="nav-item ">
                                 {typeSelect==="projets"&&
                                    <button class="nav-link border border-top-0 border-end-0  border-start-0 pe-5 ps-5"  onClick={ (e) =>  {setTypeSelect("projets");}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                                      <span class="menu-title">  Projets</span>
                                    </button>
                                  }
                                 {typeSelect==="utilisateurs"&&
                                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info pe-5 ps-5"  onClick={ (e) =>  {setTypeSelect("projets");}} style={{color:"#06868D",fontSize:"14px" }}>
                                      <span class="menu-title"> Projets</span>
                                    </button>}
                                    {typeSelect==="PU"&&
                                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info "  onClick={ (e) =>  {setTypeSelect("projets");}} style={{color:"#06868D",fontSize:"14px" }}>
                                      <span class="menu-title"> Projets</span>
                                    </button>}
                                  </li>
                                  <li class="nav-item ">
                                 {typeSelect==="projets"&&
                                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info pe-5 ps-5"  onClick={ (e) =>  {setTypeSelect("PU");}} style={{color:"#06868D",fontSize:"14px" }}>
                                    <span class="menu-title">  Utilisateurs et Projets </span>
                                    </button>
                                  }
                                 {typeSelect==="utilisateurs"&&
                                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info pe-5 ps-5"  onClick={ (e) =>  {setTypeSelect("PU");}} style={{color:"#06868D",fontSize:"14px" }}>
                                      <span class="menu-title"> Utilisateurs et Projets</span>
                                    </button>}
                                    {typeSelect==="PU"&&
                                    <button class="nav-link border border-top-0 border-end-0  border-start-0 pe-4 ps-4"  onClick={ (e) =>  {setTypeSelect("PU");}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                                    <span class="menu-title"> Utilisateurs et Projets</span>
                                    </button>}
                                  </li>
                                </ul>
                              </div>  }
                              {role==="ROLE_MEMBRE"&&
                          <div class=" mt-3" style={{color:'white' ,borderColor:"#06868D",textAlign:"center" }}>
                             <ul class="nav " >
                                 <li class="nav-item">
                                 {type==="membre"&&
                                    <button  class="nav-link border border-top-0 border-end-0  border-start-0 pe-4 ps-4"  onClick={ (e) =>  {setType("membre");}}   style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                                       <span class="menu-title" > Droit d'accès comme membre</span>
                                    </button>}
                                 {type==="chef"&&
                                    <button type="button" class="nav-link border border-top-0 border-end-0 border-start-0 border-info pe-4 ps-4"  onClick={ (e) =>  {setType("membre");}}   style={{color:"#06868D",fontSize:"14px", borderBottom: "4px solid black" }}>
                                       <span class="menu-title" > Droit d'accès comme membre</span>
                                    </button>}
                                    </li>
                                  <li class="nav-item ">
                                 {type==="chef"&&
                                    <button class="nav-link border border-top-0 border-end-0  border-start-0 pe-5 ps-5"  onClick={ (e) =>  {setType("chef");}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                                      <span class="menu-title"> Droit d'accès comme chef de projet</span>
                                    </button>
                                  }
                                 {type==="membre"&&
                                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info pe-5 ps-5"  onClick={ (e) =>  {setType("chef");}} style={{color:"#06868D",fontSize:"14px" }}>
                                      <span class="menu-title"> Droit d'accès comme chef de projet</span>
                                    </button>}
                                  </li>
                                </ul>
                              </div>  }
                          <div class="row">
                            <div class="card card-rounded">
                              <div class="card-body">
                                {role==="ROLE_ADMIN"&&
                                <IndexAdmin typeSelect={typeSelect}/>
                                 }
                                {role==="ROLE_CHEFPROJET"&&
                                  <IndexChef />
                                                              }
                                {role==="ROLE_MEMBRE"&&
                                  <IndexMembre type={type}/>

                              }
                                {role==="ROLE_CLIENT"&&
                                  <IndexClient/> }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
</>


)}
