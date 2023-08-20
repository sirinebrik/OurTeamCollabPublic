import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams} from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import 'moment/locale/fr';

export default function Email({id,status,objet,date,heure,logo,contenu,Checked}) {
    const date1 = moment(new Date());
    const date2 = moment(date);
    const diffInDays = date2.diff(date1, 'days');
    const diffInDaysYear = date1.diff(date2, 'year');
    const date2Month = date2.locale('fr').format('MMMM');
    const date2Day = date2.date();  
    const [check,setCheck]= useState(false)

    const handleChecked = () => {
        Checked(id,!check);
      };
return (
    <>
      
        <tr class="">
            <td class="inbox-small-cells">
                <input type="checkbox" class="mail-checkbox" onClick={(e)=>{setCheck(!check);handleChecked()}} />
            </td>
           <td class="dont-show">
                <Link to={ `/détailEmail/${id}`} style={{textDecoration:"none",color:"black"}}>
                    {status===false&&
                       <span style={{fontWeight:"bold"}}>  ourteamcollab 
                         {diffInDays===0 &&
                       <span class="me-1 "style={{backgroundColor:"#06868D" ,color:"white",borderRadius:"5px"}}> Nouveau</span>} </span>  }
                    
                    {status===true&&
                    <span class="fw-light">  ourteamcollab </span>  }
                </Link>
            </td>
            <td class="view-message">  
                <Link to={ `/détailEmail/${id}`} style={{textDecoration:"none",color:"black"}}>
                    {status===false&&
                     <span style={{fontWeight:"bold"}}>{objet} </span>  }
                    {status===true&&
                     <span class="fw-light">{objet} </span>  }
                       - 
                     <span class="fw-light">
                       {contenu.slice(0,140).length<contenu.length&&
                          <span > {contenu.slice(0,140)}...</span>}
                       {contenu.slice(0,140).length===contenu.length&&
                          <span class="" > {contenu.slice(0,140)}...</span>}
                    </span> 
                </Link>
           </td>
           <td class="view-message text-right">  
               <Link to={ `/détailEmail/${id}`} style={{textDecoration:"none",color:"black"}}>
                  {status===false&&
                      <span style={{fontWeight:"bold"}}>    
                         {diffInDays===0 && <>{heure}</>}
                         {diffInDays!==0&&diffInDaysYear>0 && <>{date}</>}
                         {diffInDays!==0&&diffInDaysYear===0 && <>  {date2Day} {date2Month}</>} 
                       </span>  }
                  {status===true&&
                    <span class="fw-light">  
                    {diffInDays===0 && <>{heure}</>}
                    {diffInDays!==0&&diffInDaysYear>0 && <>{date}</>}
                    {diffInDays!==0&&diffInDaysYear===0 && <>  {date2Day} {date2Month}</>} 
                    </span>  }
                 </Link>
          </td>
        
        </tr>
          
    </>

       )
}


