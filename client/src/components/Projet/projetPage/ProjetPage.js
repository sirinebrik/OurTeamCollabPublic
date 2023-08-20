import React,{ useEffect, useState } from "react"
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"
import { me } from "../../../service/user"

import ProjetList from "../projetList/ProjetList"

export default function ProjetPage({user,userRole}) {
       
      
return (
    <div class="container-scroller">
        <Navbar/>
        <div class="container-fluid page-body-wrapper">
          <Sidebar/>
           <div class="main-panel">
                <div class="content-wrapper">
                   <ProjetList user={user} userRole={userRole}/>
                </div>
          </div>
        </div>
    </div>
       )
}


