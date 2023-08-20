import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import Sidebar from "../Page/Sidebar";
import Navbar from "../Page/Navbar";
import "./MessageList.css"
import moment from 'moment';
import 'moment/locale/fr';
import Message from "./Message";

export default function Contact({id,heure,date,messageLu,contenu,toUser,fromUser,changeId,idM,change,nouveau}) {
    let user1 = jwt_decode(localStorage.getItem("token"));
    let role1=user1.roles[0]  
    const date1 = moment(new Date());
    const date2 = moment(date);
    const diffInDays = date2.diff(date1, 'days');
    const diffInDaysYear = date1.diff(date2, 'year');
    const date2Month = date2.locale('fr').format('MMMM');
    const date2Day = date2.date();  
  
    const onSubmitHandler = (idd) => {
     changeId(idd,toUser,fromUser) 
     change()
   }
   
return (

<>
{idM===id&&nouveau===false&&
<>
                        <div type="button" onClick={(text) => {onSubmitHandler(id)}} class="mb-2 " style={{backgroundColor:"#ECF3FF" ,borderRadius:"5px"}}>
                            {user1.id===fromUser.id&&
                            <>
                            <div class="row">
                               <div class="col-2">
                              {toUser.photo&&
                                  <img class="rounded-circle border  " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require(`../../assets/uploads/${toUser.photo}`)} width="39px" height="39px" alt=""/>
                               }
                              {!toUser.photo  &&  <img class="rounded-circle border " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require('../../assets/img/logos/user.png')} width="39px" height="39px" alt="Profile image"/>} 
                                </div>
                                <div class="col-10">
                                   <span class="" style={{fontSize:"13px"}}>{toUser.username} {toUser.lastname}</span> 
                                 
                                   <p class="" style={{fontSize:"10px"}}>Vous: 
                                    {contenu.slice(0,50).length<contenu.length&&
                                      <span > {contenu.slice(0,50)}...</span>}
                                    {contenu.slice(0,50).length===contenu.length&&
                                      <span class="" > {contenu.slice(0,50)}</span>}
                                        <span class="me-2" style={{fontSize:"10px",fontWeight:"bold"}}>    
                                    {diffInDays===0 && <>{heure}</>}
                                    {diffInDays!==0&&diffInDaysYear>0 && <>{date}</>}
                                    {diffInDays!==0&&diffInDaysYear===0 && <>  {date2Day} {date2Month}</>} 
                                    </span> 
                                   </p> 
                                </div>
                            </div>
                            </>}
                           
                            {user1.id===toUser.id&&
                            <>
                            <div class="row">
                                <div class="col-2">
                             {fromUser.photo&&
                                  <img class="rounded-circle border  " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require(`../../assets/uploads/${fromUser.photo}`)} width="39px" height="39px" alt=""/>
                             } 
                              {!fromUser.photo  &&  <img class="rounded-circle border " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require('../../assets/img/logos/user.png')} width="39px" height="39px" alt="Profile image"/>} 
                                </div>
                                <div class="col-10">
                                {messageLu===false&&
                                <>
                                   <span class="" style={{fontSize:"13px",fontWeight:"bold"}}>{fromUser.username} {fromUser.lastname}</span> 
                                 
                                   <p class="" style={{fontSize:"10px",fontWeight:"bold"}}>
                                    {contenu.slice(0,50).length<contenu.length&&
                                      <span > {contenu.slice(0,50)}...</span>}
                                    {contenu.slice(0,50).length===contenu.length&&
                                      <span class="" > {contenu.slice(0,50)}</span>}
                                           <span class="me-2" style={{fontSize:"10px",fontWeight:"bold"}}>    
                                    {diffInDays===0 && <>{heure}</>}
                                    {diffInDays!==0&&diffInDaysYear>0 && <>{date}</>}
                                    {diffInDays!==0&&diffInDaysYear===0 && <>  {date2Day} {date2Month}</>} 
                                    </span> 
                                    </p></> }
                                    {messageLu===true&&
                                    <>
                                   <span class="" style={{fontSize:"13px"}}>{fromUser.username} {fromUser.lastname}</span> 
                                   <p class="" style={{fontSize:"10px"}}>
                                    {contenu.slice(0,50).length<contenu.length&&
                                      <span > {contenu.slice(0,50)}...</span>}
                                    {contenu.slice(0,50).length===contenu.length&&
                                      <span class="" > {contenu.slice(0,50)}</span>}
                                           <span class="me-2" style={{fontSize:"10px",fontWeight:"bold"}}>    
                                    {diffInDays===0 && <>{heure}</>}
                                    {diffInDays!==0&&diffInDaysYear>0 && <>{date}</>}
                                    {diffInDays!==0&&diffInDaysYear===0 && <>  {date2Day} {date2Month}</>} 
                                    </span> 
                                    </p></> }
                                </div>
                            </div>
                            </>
                           }
                           </div>
</>}
{(idM!==id||(idM===id&&nouveau===true))&&
<>
                        <div class="mb-2" type="button" onClick={(text) => {onSubmitHandler(id)}} >
                            {user1.id===fromUser.id&&
                            <>
                            <div class="row">
                               <div class="col-2">
                              {toUser.photo&&
                                  <img class="rounded-circle border  " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require(`../../assets/uploads/${toUser.photo}`)} width="39px" height="39px" alt=""/>
                               }
                              {!toUser.photo  &&  <img class="rounded-circle border " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require('../../assets/img/logos/user.png')} width="39px" height="39px" alt="Profile image"/>} 
                                </div>
                                <div class="col-10">
                                   <span class="" style={{fontSize:"13px"}}>{toUser.username} {toUser.lastname}</span> 
                                 
                                   <p class="" style={{fontSize:"10px"}}>Vous: 
                                    {contenu.slice(0,50).length<contenu.length&&
                                      <span > {contenu.slice(0,50)}...</span>}
                                    {contenu.slice(0,50).length===contenu.length&&
                                      <span class="" > {contenu.slice(0,50)}</span>}
                                        <span class="me-2" style={{fontSize:"10px",fontWeight:"bold"}}>    
                                    {diffInDays===0 && <>{heure}</>}
                                    {diffInDays!==0&&diffInDaysYear>0 && <>{date}</>}
                                    {diffInDays!==0&&diffInDaysYear===0 && <>  {date2Day} {date2Month}</>} 
                                    </span> 
                                   </p> 
                                </div>
                            </div>
                            </>}
                           
                            {user1.id===toUser.id&&
                            <>
                            <div class="row">
                                <div class="col-2">
                             {fromUser.photo&&
                                  <img class="rounded-circle border  " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require(`../../assets/uploads/${fromUser.photo}`)} width="39px" height="39px" alt=""/>
                             } 
                              {!fromUser.photo  &&  <img class="rounded-circle border " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require('../../assets/img/logos/user.png')} width="39px" height="39px" alt="Profile image"/>} 
                                </div>
                                <div class="col-10">
                                  {messageLu===false&&
                                  <>
                                     <span class="" style={{fontSize:"13px",fontWeight:"bold"}}>{fromUser.username} {fromUser.lastname}</span> 
                                     <p class="" style={{fontSize:"10px",fontWeight:"bold"}}>
                                    {contenu.slice(0,50).length<contenu.length&&
                                      <span > {contenu.slice(0,50)}...</span>}
                                    {contenu.slice(0,50).length===contenu.length&&
                                      <span class="" > {contenu.slice(0,50)}</span>}
                                           <span class="me-2" style={{fontSize:"10px",fontWeight:"bold"}}>    
                                    {diffInDays===0 && <>{heure}</>}
                                    {diffInDays!==0&&diffInDaysYear>0 && <>{date}</>}
                                    {diffInDays!==0&&diffInDaysYear===0 && <>  {date2Day} {date2Month}</>} 
                                    </span> 
                                    </p> </>}
                                    {messageLu===true&&
                                    <>
                                    <span class="" style={{fontSize:"13px"}}>{fromUser.username} {fromUser.lastname}</span> 
                                   <p class="" style={{fontSize:"10px"}}>
                                    {contenu.slice(0,50).length<contenu.length&&
                                      <span > {contenu.slice(0,50)}...</span>}
                                    {contenu.slice(0,50).length===contenu.length&&
                                      <span class="" > {contenu.slice(0,50)}</span>}
                                           <span class="me-2" style={{fontSize:"10px",fontWeight:"bold"}}>    
                                    {diffInDays===0 && <>{heure}</>}
                                    {diffInDays!==0&&diffInDaysYear>0 && <>{date}</>}
                                    {diffInDays!==0&&diffInDaysYear===0 && <>  {date2Day} {date2Month}</>} 
                                    </span> 
                                    </p></> }
                                </div>
                            </div>
                            </>
                           }
                           </div>
</>}
</>
 )
}

  

