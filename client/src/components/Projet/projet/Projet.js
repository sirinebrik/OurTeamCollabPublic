/* eslint-disable no-unused-vars */
import React,{ useEffect, useState } from 'react'

import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom"

export default function Projet({id, nom, description ,userRole,
    archivé, dateDebut, dateFin, type,Archivé,Désarchivé,Delete}) {
    const navigate = useNavigate ()
    const [nb,setNb]= useState()
    let i=0;
    const handleArchivé = () => {
        Archivé(id);
      };
    const handleDésarchivé = () => {
        Désarchivé(id);
      };
    const handleDelete = () => {
        Delete(id);
      };
    
    console.error = () => {}
  
  return (
   
<div class="col-4 grid-margin stretch-card mt-5" >
  
    <div class="card card-rounded border border-3">
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-12"> 
                    <div class="d-flex ">
                        <div class="col-2"> 
                            <i class="fa fa-cube" style={{fontSize:"53px",color:"#06868D"}} ></i>
                        </div>
                        {(userRole==="ROLE_ADMIN"&&archivé===true)&&(
                            <>
                        <div class="col-9">
                        </div> 
                        <div class="col-3"> 
                            <div class="d-sm-flex justify-content-between align-items-start">
                                <div >
                                    <a title="Supprimer" type="button" href="" className='button' onClick={handleDelete}><i class="fa fa-trash" style={{fontSize:"16px",color:"red" }}></i></a>
                                </div>
                            </div>
                        </div></> )}
                            {(userRole==="ROLE_ADMIN"&&archivé===false)&&(
                                <>
                        <div class="col-9">
                        </div> 
                        <div class="col-3"> 
                            <div class="d-sm-flex justify-content-between align-items-start">
                                <div >
                                    <a title="Archivé" type="button" href="" className='button' onClick={handleArchivé}><i class="fa fa-lock" style={{fontSize:"16px",color:"#06868D"}}></i></a>
                                </div>
                            </div>
                        </div></>)}
                    </div> 
                </div>   
            </div>
            <div class="row ">
                <div class="col-12"> 
                <Link to={ `/tableauDeBord/${id}`} style={{textDecoration:"none"}}>  
                    <h6>{nom}</h6>
                    {description.slice(0,100).length<description.length&&
                    <p style={{color:"gray" ,fontSize:"12px"}}>{description.slice(0,100)}...</p>}
                      {description.slice(0,100).length===description.length&&
                    <p class="" style={{color:"gray" ,fontSize:"12px"}}>{description.slice(0,100)}</p>}
                    <p style={{fontSize:"12px" ,color:"black"}}><i class="fa fa-calendar f-disabled m-r-xs"></i> Débute le {dateDebut} Termine le {dateFin}</p>
                </Link>
                </div>   
            </div> 
        </div>
    </div>
</div>
 );       
};

  
