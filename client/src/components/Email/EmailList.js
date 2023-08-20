import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams} from "react-router-dom"
import Sidebar from "../Page/Sidebar";
import Modal from 'react-bootstrap/Modal';
import Select  from "react-select";
import Email from "./Email";
import logo from "../../assets/img/logos/logo.png"
import Navbar from "../Page/Navbar";
import "./EmailList.css"

export default function EmailList() {
  const [isLoding, setIsLoding] = useState(true);
    let user1 = jwt_decode(localStorage.getItem("token"));
    let role1=user1.roles[0]
    const [emailNotif,setEmailNotif]= useState([])
    const [filteredEmail,setFilteredEmail]= useState([])
    const [checked,setChecked]= useState([])
    const getEmailNotif = (async () => {
    await Axios.get(`http://localhost:8000/emailNotif/${user1.id}`
    )
    .then((response)=>{
    setEmailNotif(response.data.email) 
    setFilteredEmail(response.data.email)
    setIsLoding(false);
    })  });
    useEffect( () => {getEmailNotif() }, []);   

    const onSubmitHandler = (e) => {
        e.preventDefault()
       Axios.post(`http://localhost:8000/marquerLu/${user1.id}`,{
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
          .then((res) => { 
           getEmailNotif()})}  

           const Checked =(id,check) =>{
            if(check===true) {
           setChecked([...checked, id]) }
              else{
               const filteredData  = checked.filter((data) =>  data !== id);
               setChecked( filteredData)}
             }
          const onDelete =() =>{
               const formData ={
                    "id" : checked,
                  }
                  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce(s) mail(s) ? ")){
                   Axios.post(`http://localhost:8000/deleteEmail`,formData,{
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then((res) => { 
                    getEmailNotif()})}
              }
              const [search, setSearch] = useState("");
    
              function onKeyUpHandler(e) {
                  setSearch(e);
                }  
                
                useEffect(() => {
                  // on fait le filtre et on modifie la liste (rendu)
                    
                      const newData = filteredEmail.filter(function (item) {
                         const itemData = item.objet
                             ? item.objet.toUpperCase()
                             : ''.toUpperCase();
                         const textData = search.toString().toUpperCase();
                         return itemData.indexOf(textData) > -1;});
                         setEmailNotif(newData);
                      }, [search]);
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
<div class="container mt-4">
  <div class="mail-box">
    <aside class="lg-side">
      <div class="inbox-body">
        <div class="mail-option">
        <div class="row ">
                    <div class="col-9">
                    <div class="btn-group">
             <div class="dropdown">
                <a class="nav-link " id="countDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false" style={{color:"#06868D"}}>
                    <i class="fa fa-ellipsis-v ms-2 "></i>
                    <i class="fa fa-angle-down "></i>
                </a>
                <div class="dropdown-menu  pb-0 p-2 pb-2" type="button" onClick={onSubmitHandler} aria-labelledby="countDropdown" style={{backgroundColor:"#06868D",color:"white"}}>
                  Tout marquer comme lu
                </div>   
              </div>
            </div>
            {checked.length!==0&&
            <div class="btn-group">
               <i class="fa fa-trash ms-2 " type="button" style={{color:"red"}} onClick={(e)=>{onDelete()}}></i>
            </div>}
                    </div>
                    <div class="col-3">
                         <div className="form-icon-container5 ">
                            <input className="form-control  form-icon-input5" value={search} name="filter"  type="text" onChange={(text) => {onKeyUpHandler(text.target.value)}} placeholder="Recherche par objet" style={{paddingTop:"9px",paddingBottom:"9px" ,borderColor:"#06868D"}}/>
                            <span className="fa fa-search text-900 fs--1 form-icon5"></span>
                          </div>                    
                    </div>
                </div>
           
        </div>
        <div style={{maxHeight: "480px", "overflow-y": "auto"}}>
        <table class="table table-inbox table-hover" >
          <tbody >
             {emailNotif.map((item,index)=>
               <Email id={item.id} key={item.id} objet={item.objet} status={item.status} logo={logo} 
               date={item.date} heure={item.heure} contenu={item.contenu} Checked ={Checked} />
             )}
          </tbody>
        </table>
        </div>
      </div>
    </aside>
  </div>
</div>
</div>
</div>
</div>
</div>}</>
       )
}


