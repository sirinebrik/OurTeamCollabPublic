/* eslint-disable no-unused-vars */
import React,{ useEffect, useState } from 'react'

import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom"

export default function Utilisateur({id,email,username,lastname,photo,role,sexe,etat,type,Désactive,Active,userRole}) {
    const navigate = useNavigate ()

    const handleDésactiveUser = () => {
        Désactive(id);
      };
      const handleActiveUser = () => {
        Active(id);
      };
      console.error = () => {}
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
                       <div class="col-9"> 
                       {(role[0]==="ROLE_CHEFPROJET")&&
                       <Link to={ `/profile/${id}`} style={{textDecoration:"none"}}>  
                            <h6>{username} {lastname}</h6>
                            {type==="tous"&&<>
                             {(role[0]==="ROLE_CHEFPROJET")&&(<p style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Chef de projet</p>)}
                               {(role[0]==="ROLE_MEMBRE")&&(<p style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Membre</p>)}
                                {(role[0]==="ROLE_CLIENT")&&(<p style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Client</p>)}
                                </> }
                                <p  style={{color:"black"}}> <i class=" me-1  fa fa-envelope" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{email}</p>
                            
                        </Link>
                        }
                         {(role[0]==="ROLE_MEMBRE")&&
                       <Link to={ `/profileM/${id}`} style={{textDecoration:"none"}}>  
                            <h6>{username} {lastname}</h6>
                            {type==="tous"&&<>
                             {(role[0]==="ROLE_CHEFPROJET")&&(<p style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Chef de projet</p>)}
                               {(role[0]==="ROLE_MEMBRE")&&(<p style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Membre</p>)}
                                {(role[0]==="ROLE_CLIENT")&&(<p style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Client</p>)}
                                </> }
                                <p  style={{color:"black"}}> <i class=" me-1  fa fa-envelope" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{email}</p>
                            
                        </Link>
                        }
                         {(role[0]==="ROLE_CLIENT")&&
                       <Link to={ `/profileC/${id}`} style={{textDecoration:"none"}}>  
                            <h6>{username} {lastname}</h6>
                            {type==="tous"&&<>
                             {(role[0]==="ROLE_CHEFPROJET")&&(<p style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Chef de projet</p>)}
                               {(role[0]==="ROLE_MEMBRE")&&(<p style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Membre</p>)}
                                {(role[0]==="ROLE_CLIENT")&&(<p style={{color:"black"}}><i class=" me-1  fa fa-user" style={{fontSize:"13px",color:"#0B0A42"}}></i>Client</p>)}
                                </> }
                                <p  style={{color:"black"}}> <i class=" me-1  fa fa-envelope" style={{fontSize:"13px",color:"#0B0A42"}} ></i>{email}</p>
                            
                        </Link>
                        }
                        </div> 
                        </div>   
                    </div> 
                </div>
                {(userRole==="ROLE_ADMIN")&&(
                <div class="col-2"> 
                    <div class="d-sm-flex justify-content-between align-items-start">
                        <div >
                            {etat && < a title="Désactivé" className='button' href="" onClick={handleDésactiveUser}><i class="fa fa-lock" style={{fontSize:"16px",color:"#06868D"}}></i></a>}
                            {!etat && <a title="Activé" type="button" href="" className='button' onClick={handleActiveUser}><i class="fa fa-unlock" style={{fontSize:"16px",color:"#06868D"}}></i></a>}
                        </div>
                    </div> 
                </div>
                )}
            </div>
        </div>
    </div>
</div>
      );       

  };

  
