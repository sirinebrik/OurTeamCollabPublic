import React,{ useEffect, useState } from "react"
import UtilisateurList from "../utilisateurList/UtilisateurList"
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"
import { me } from "../../../service/user"


export default function UtilisateurPage({user,userRole}) {
       
      
return (
    <div class="container-scroller">
        <Navbar/>
        <div class="container-fluid page-body-wrapper">
          <Sidebar/>
           <div class="main-panel">
                <div class="content-wrapper">
                   <UtilisateurList user={user} userRole={userRole}/>
                </div>
          </div>
        </div>
    </div>
       )
}


