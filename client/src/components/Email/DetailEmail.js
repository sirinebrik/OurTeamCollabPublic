import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams} from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import 'moment/locale/fr';
import Navbar from "../Page/Navbar";
import Sidebar from "../Page/Sidebar";
import logo from "../../assets/img/logos/logo.png"

export default function DetailEmail() {
    const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
        const [email,setEmail]= useState([])
        const [contenu,setContenu]= useState("")
    const getEmail = (async () => {
    await Axios.get(`http://localhost:8000/detailEmail/${id}`
    )
    .then((response)=>{
    setEmail(response.data.email[0]) 
    setIsLoding(false);
    })  });
   
    useEffect( () => {getEmail() }, []);  
    if(email &&email.status===false) {
        Axios.post(`http://localhost:8000/marquerLuEmail/${id}`,{
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })}
    const date1 = moment(new Date());
    const date2 = moment(email.date);
    const diffInDays = date2.diff(date1, 'days');
    const diffInDaysYear = date1.diff(date2, 'year');
    const date2Month = date2.locale('fr').format('MMMM');
    const date2Day = date2.date();  

    const Delete =() =>{
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mail ? ")){
                  Axios.post(`http://localhost:8000/deleteEmailDetail/${id}`)
                  .then((res) => { 
                    window.location='/emails'})
                }
                  }
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
                <div class="content-wrapper">
                    <div class="col-6 ">
                       <Link to={ `/emails`} style={{textDecoration:"none",color:"black"}}>
                           <span  class="me-4 " style={{fontWeight:"bold",fontSize:"13px"}}  > <i class="fa fa-arrow-left "></i> Retour</span>     
                       </Link>
                    </div>
                    <div class="card card-rounded border border-3 mt-2">
                       <div class="card-body" >
                           <div class="row  mb-2" >
                               <div class="col-1">
                                </div>
                               <div class="col-11 ">
                                   <span class=""style={{fontWeight:"bold",fontSize:"17px"}}>{email.objet}                         
                                      <i class="fa fa-trash ms-2 " type="button" style={{color:"red"}} onClick={(e)=>{Delete()}}></i>
                                   </span><br/>
                                </div>
                           </div>
                           <div class="row " >
                               <div class="col-1 mt-2">
                                   <img src={logo} alt="image" class="rounded-circle "  width="60px" height="60px" />
                                </div>
                               <div class="col-11 mt-3 mb-3">
                                   <div class="row " >
                                       <div class="col-10">
                                           <span class=""style={{fontWeight:"bold",fontSize:"14px"}}> ourteamcollab@gmail.com</span><br/>
                                           <span class=""style={{fontSize:"12px" ,color:"gray"}}> À moi</span> <br/>
                                        </div>
                                        <div class="col-2">
                                           <span class=""style={{fontSize:"12px" ,color:"gray"}}>    
                                               {diffInDays===0 && <>{email.heure}</>}
                                               {diffInDays!==0&&diffInDaysYear>0 && <>{email.date}</>}
                                               {diffInDays!==0&&diffInDaysYear===0 && <>  {date2Day} {date2Month}</>} </span> <br/>
                                        </div>
                                    </div>
                                   <div class="mt-3"style={{fontSize:"14px",whiteSpace: "pre-line",}}  > {email.contenu}</div>                              
                               </div>
                           </div>
                       </div>
                    </div>
                </div>
          </div>
        </div>
    </div>}
    </>

       )
}


