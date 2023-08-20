/* eslint-disable no-unused-vars */
import React,{ useEffect, useState } from 'react'

import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom"

export default function EquipeProjetUser({id,email,username,lastname,photo,role,sexe,etat,type,userRole,roleProjet}) {
    const navigate = useNavigate ()

  return (

    <div class="col-4 grid-margin stretch-card mt-5" >
    <div class="card card-rounded border border-3">
        <div class="card-body">
          <div class="row ">
                 <div class="col-10"> 
                    <div class="d-flex ">
                    <div class="row ">
                      <div class="col-3"> 
                      {photo&&
                       <img class="rounded-circle" src={require(`../../../assets/uploads/${photo}`)} width="60px" height="60px" alt=""/>
                        }
                       {!photo  &&  <img class="rounded-circle"  src={require('../../../assets/img/logos/user.png')} width="60px" height="60px" alt="Profile image"/>} 
                       </div>
                       <div class="col-9 mt-2"> 
                       {(role[0]==="ROLE_CHEFPROJET")&&
                       <Link to={ `/profile/${id}`} style={{textDecoration:"none"}}>  
                            <h6>{username} {lastname}</h6>
                              <p  style={{color:"black"}}> <i class=" me-1  fa fa-envelope" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{email}</p>
                            
                        </Link>
                        }
                         {(role[0]==="ROLE_MEMBRE")&&
                       <Link to={ `/profileM/${id}`} style={{textDecoration:"none"}}>  
                            <h6>{username} {lastname}</h6>
                              <p  style={{color:"black"}}> <i class=" me-1  fa fa-envelope" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{email}</p>
                            
                        </Link>
                        }
                         {(role[0]==="ROLE_CLIENT")&&
                       <Link to={ `/profileC/${id}`} style={{textDecoration:"none"}}>  
                            <h6>{username} {lastname}</h6>
                            <p  style={{color:"black"}}> <i class=" me-1  fa fa-envelope" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{email}</p>
                            
                        </Link>
                        }  </div> 
                        </div>   
                    </div> 
                </div>
                 <div class="col-2"> 
                  {etat===true && <span class="me-2" style={{fontSize:"14px",color:"#06868D"}}><i class="fa fa-unlock"></i></span>} 
                  {etat===false && <span class="me-2" style={{fontSize:"14px",color:"red"}}><i class="fa fa-lock"></i></span>}
                        
                </div>
            
            </div>
        </div>
    </div>
</div>
      );       

  };

  
