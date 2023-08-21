import React,{ useEffect, useState } from "react"
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"
import { me } from "../../../service/user"

import "../../../template/vendors/feather/feather.css"
import "../../../template/vendors/mdi/css/materialdesignicons.min.css"
import "../../../template/vendors/ti-icons/css/themify-icons.css"
import "../../../template/vendors/typicons/typicons.css"
import "../../../template/vendors/simple-line-icons/css/simple-line-icons.css"
import "../../../template/vendors/css/vendor.bundle.base.css"
import "../../../template/js/select.dataTables.min.css"
import"../../../template/css/vertical-layout-light/style.css"
import "../../../template/images/favicon.png" 
import "../../../template/vendors/js/vendor.bundle.base.js"
import "../../../template/vendors/progressbar.js/progressbar.min.js"
import "../../../template/js/off-canvas.js"
import "../../../template/js/hoverable-collapse.js"
import "../../../template/js/template.js"
import "../../../template/js/settings.js"
import "../../../template/js/todolist.js"
import Axios from 'axios'
import "../../../template/js/dashboard.js"
import { Link,useNavigate,useParams } from "react-router-dom"
import TableauDeBord from "../EspaceProjetList/TableauDeBord"
import jwt_decode from "jwt-decode";

export default function EspaceProjetPage({userRole}) {
    const [isLoding, setIsLoding] = useState(true);
    let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]
    const { id } = useParams()       
    const [projet,setProjet]= useState([])
    const [projets,setProjets]= useState([])
    const [projetsUser,setProjetsUser]= useState([])
    const getProjet = (async () => {
        await Axios.get(`http://localhost:8000/indexProjet/${id}`)
        .then((response)=>{
        setProjet(response.data.projet[0])
        setIsLoding(false);

                })  });
    useEffect( () => {getProjet();},[]) ;  
      //mes projets non archivés 
    const getProjetsUser = (async () => {
        await Axios.get(`http://localhost:8000/droit/accesU/${user.id}`
      )
        .then((response)=>{
        setProjetsUser(response.data.projet)
            })  });
    useEffect( () => {getProjetsUser();},[]);
    //tous les projets pour Admin
    const getProjets = (async () => {
        await Axios.get(`http://localhost:8000/projet/acces/${user.org}`).then((response)=>{
         setProjets(response.data.projet)
        })  });
        useEffect( () => {getProjets();},[]) ;
    let proj=[]
    if(role==="ROLE_ADMIN") {proj = projets.filter(f => (f.id !== projet.id ))}
    else {proj = projetsUser.filter(f => (f.projet.id !== projet.id ))}
  const change = (e) =>{ window.location=`/tableauDeBord/${e}`;}

  const [projetRole,setProjetRole]= useState([])
  const getProjetRole = (async () => {
      await Axios.get(`http://localhost:8000/indexProjetU/${id}/${user.id}`)
      .then((response)=>{
          if(response.data.projet.length!==0){ setProjetRole(response.data.projet[0])}
         else{ setProjetRole([])}
       })  });
  useEffect( () => {getProjetRole();},[]) ; 
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
                <div class="row mb-3 mt-2" style={{marginLeft:"20px"}}>
                   <div class="col-3"> 
                       <div class="row">
                           <div class="col-2"> 
                               <i class="fa  fa-fw fa-cube" style={{fontSize:"38px",color:"#06868D"}} ></i>
                            </div>
                            <div class="col-10"> 
                                <select  style={{fontSize:"19px",fontWeight:"bold"}} onChange={ (e) =>  change(e.target.value)} class="form-select border border-top-0 border-end-0 border-start-0">
                                     <option value={projet.id} selected > {projet.nom}</option>
                                   {role==="ROLE_ADMIN"&&proj.map((item,index)=>
                                      <option   key={item.id} value={item.id}>   {item.nom}</option>) }
                                    {role!=="ROLE_ADMIN"&&proj.map((item,index)=>
                                      <option   key={item.projet.id} value={item.projet.id}>   {item.projet.nom}</option>)}
                                </select> 
                            </div>
                        </div>
                    </div>
                    <div class="col-9">
                    </div> 
                </div> 
                <TableauDeBord user={user} userRole={userRole}  projetRole={projetRole.role} archive={projet.archive} id={id}/>
           </div>
        </div>
    </div>}</>
       )
}


