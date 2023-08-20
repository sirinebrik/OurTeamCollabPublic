import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import 'moment/locale/fr';
import jwt_decode from "jwt-decode";


export default function ContactNotif({id,heure,date,messageLu,contenu,to,from}) {
    let user1 = jwt_decode(localStorage.getItem("token"));
    let role1=user1.roles[0] 
    const date1 = moment(new Date());
const date2 = moment(date);
const diffInDays = date2.diff(date1, 'days');
const diffInDaysYear = date1.diff(date2, 'year');
const date2Month = date2.locale('fr').format('MMMM');
const date2Day = date2.date();

return (
<>   
<div  class="dropdown-item preview-item">
            <div class="preview-thumbnail">
            {user1.id!==from.id&&
            <>
               {from.photo&&
                <img class=" "   src={require(`../../assets/uploads/${from.photo}`)} alt=""/>
             }
            {!from.photo  &&  <img class=""   src={require('../../assets/img/logos/user.png')}  alt="Profile image"/>} 
            </>}
            {user1.id!==to.id&&
            <>
               {to.photo&&
                <img class="rounded-circle border border-success "  src={require(`../../assets/uploads/${to.photo}`)} alt=""/>
             }
            {!to.photo  &&  <img class="rounded-circle border border-success"  src={require('../../assets/img/logos/user.png')}  alt="Profile image"/>} 
            </>}
            </div>
            <div class="preview-item-content flex-grow py-2">
                <div class="row">
                {diffInDays===0 && <>
                     <div class="col-8">
                     {user1.id!==from.id&&
                        <p class="preview-subject ellipsis font-weight-medium text-dark">{from.username} {from.lastname} </p>}
                        {user1.id!==to.id&&
                        <p class="preview-subject ellipsis font-weight-medium text-dark">{to.username} {to.lastname} </p>}
                    </div>
                    <div class="col-4">
                        <p class="preview-subject ellipsis font-weight-medium fw-light">
                        {heure}
                        </p>
                    </div></>}
                    {diffInDays!==0&&diffInDaysYear>0&& <>
                     <div class="col-8">
                     {user1.id!==from.id&&
                        <p class="preview-subject ellipsis font-weight-medium text-dark">{from.username} {from.lastname} </p>}
                        {user1.id!==to.id&&
                        <p class="preview-subject ellipsis font-weight-medium text-dark">{to.username} {to.lastname} </p>}                    </div>
                    <div class="col-4">
                        <p class="preview-subject ellipsis font-weight-medium fw-light">
                        {date}
                        </p>
                    </div></>}
                    {diffInDays!==0&&diffInDaysYear===0&& <>
                     <div class="col-8">
                     {user1.id!==from.id&&
                        <p class="preview-subject ellipsis font-weight-medium text-dark">{from.username} {from.lastname} </p>}
                        {user1.id!==to.id&&
                        <p class="preview-subject ellipsis font-weight-medium text-dark">{to.username} {to.lastname} </p>}                    </div>
                    <div class="col-4">
                        <p class="preview-subject ellipsis font-weight-medium fw-light ">
                        {date2Day} {date2Month}
                        </p>
                    </div></>}
                </div>
                {user1.id===to.id&&
                <>
              {messageLu===true&&
              <>
              <p class="fw-light  mb-0" style={{fontSize:"13px",}}> 
              {contenu.slice(0,50).length<contenu.length&&
                <span > {contenu.slice(0,50)}...</span>}
              {contenu.slice(0,50).length===contenu.length&&
                <span class="" > {contenu.slice(0,50)}</span>}</p>
              </>}
              {messageLu===false&&
               <>
              <p class=" mb-0" style={{fontSize:"12px",fontWeight:"bold"}}>
              {contenu.slice(0,50).length<contenu.length&&
                <span > {contenu.slice(0,50)}...</span>}
              {contenu.slice(0,50).length===contenu.length&&
                <span class="" > {contenu.slice(0,50)}</span>}
              </p> </>}
              </>}
              {user1.id===from.id&&
                <>
              <p class="fw-light  mb-0" style={{fontSize:"13px",}}> Vous: 
                                    {contenu.slice(0,50).length<contenu.length&&
                                      <span > {contenu.slice(0,50)}...</span>}
                                    {contenu.slice(0,50).length===contenu.length&&
                                      <span class="" > {contenu.slice(0,50)}</span>}
              </p>
              
              </>}
            </div>
            </div>
</>



       )
}

  

