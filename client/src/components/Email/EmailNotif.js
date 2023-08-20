import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import 'moment/locale/fr';


export default function EmailNotif({id,status,objet,date,heure,logo}) {
    const date1 = moment(new Date());
const date2 = moment(date);
const diffInDays = date2.diff(date1, 'days');
const diffInDaysYear = date1.diff(date2, 'year');
const date2Month = date2.locale('fr').format('MMMM');
const date2Day = date2.date();
return (
<>   
       <Link to={ `/détailEmail/${id}`}  class="dropdown-item preview-item">
            <div class="preview-thumbnail">
              <img src={logo} alt="image" class=" " />
            </div>
            <div class="preview-item-content flex-grow py-2">
                <div class="row">
                {diffInDays===0 && <>
                     <div class="col-8">
                        <p class="preview-subject ellipsis font-weight-medium text-dark">ourteamcollab </p>
                    </div>
                    <div class="col-4">
                        <p class="preview-subject ellipsis font-weight-medium fw-light">
                        {heure}
                        </p>
                    </div></>}
                    {diffInDays!==0&&diffInDaysYear>0&& <>
                     <div class="col-8">
                        <p class="preview-subject ellipsis font-weight-medium text-dark">ourteamcollab </p>
                    </div>
                    <div class="col-4">
                        <p class="preview-subject ellipsis font-weight-medium fw-light">
                        {date}
                        </p>
                    </div></>}
                    {diffInDays!==0&&diffInDaysYear===0&& <>
                     <div class="col-8">
                        <p class="preview-subject ellipsis font-weight-medium text-dark">ourteamcollab </p>
                    </div>
                    <div class="col-4">
                        <p class="preview-subject ellipsis font-weight-medium fw-light ">
                        {date2Day} {date2Month}
                        </p>
                    </div></>}
                </div>
              {status===true&&
              <p class="fw-light  mb-0" style={{fontSize:"13px"}}> {objet}</p>}
              {status===false&&
              <p class=" mb-0" style={{fontSize:"12px"}}> {objet}</p>}
            </div>
          </Link>
</>



       )
}

  

