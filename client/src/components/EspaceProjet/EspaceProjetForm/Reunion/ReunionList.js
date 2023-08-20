import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams } from "react-router-dom"
import Navbar from "../../../Page/Navbar";
import Sidebar from "../../../Page/Sidebar";
import Modal from 'react-bootstrap/Modal';
import Select  from "react-select";
import Reunion from "./Reunion";
import { Calendar, momentLocalizer, Views , dateFnsLocalizer} from "react-big-calendar";
import fr from "date-fns/locale/fr";
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import { DayPicker } from 'react-day-picker';
import { Container } from "react-bootstrap";
import 'react-day-picker/dist/style.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

export default function ReunionList() {
    const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
    const { projetRole } = useParams() 
    const [projet,setProjet]= useState([])
    const [projets,setProjets]= useState([])
    const [projetsUser,setProjetsUser]= useState([])
    const [show, setShow] = useState(false);
    const [titre,setTitre]= useState("")
    const [lien,setLien]= useState("")
    const [type,setType]= useState("Liste")
    const [description,setDescription]= useState("")
    const [date,setDate]= useState("")
    const [heureDébut,setHeureDébut]= useState("")
    const [heureFin,setHeureFin]= useState("")
    const [error,setError]= useState("")
    const [usersId,setUsersId]= useState([])
    const [users,setUsers]= useState([])
    const [reunions,setReunions]= useState([])
    const [reunionsAdmin,setReunionsAdmin]= useState([])
    const handleShow = () => {setShow(true);
        let months=(new Date().getMonth())+1
        let years=new Date().getFullYear()
        let day=new Date().getDate()
        if(months<10){months="0"+months}
        if(day<10){ day="0"+day}
        setDate(years+"-"+months+"-"+day)}
    const handleClose = () => {setShow(false);setHeureDébut("");setHeureFin("");setDescription("");random();setTitre("");setUsersId([]);setError("")}
     
    let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]
    //projet courant
    const getProjet = (async () => {
        await Axios.get(`http://localhost:8000/indexProjet/${id}`)
        .then((response)=>{
        setProjet(response.data.projet[0])
                })  });
    useEffect( () => {getProjet();},[]) ;  
      //mes projets non archivés 
    const getProjetsUser = (async () => {
        await Axios.get(`http://localhost:8000/droit/accesU/${user.id}`
      )
        .then((response)=>{
        setProjetsUser(response.data.projet)
            })  });
    useEffect( () => {getProjetsUser();},[]);
    //tous les projets pour Admin
    const getProjets = (async () => {
        await Axios.get(`http://localhost:8000/projet/acces`).then((response)=>{
         setProjets(response.data.projet)
        })  });
        useEffect( () => {getProjets();},[]) ;
    let proj=[]
    if(role==="ROLE_ADMIN") {proj = projets.filter(f => (f.id !== projet.id ))}
    else {proj = projetsUser.filter(f => (f.projet.id !== projet.id ))}
    const change = async(e) =>{  if(role==="ROLE_ADMIN"){window.location=`/réunion/${e}`} 
    else{
        await Axios.get(`http://localhost:8000/indexProjetU/${e}/${user.id}`)
        .then((response)=>{
           window.location=`/réunion/${e}/${response.data.projet[0].role}`
         }) ;
       };}
 //detailprojet
 const getUsers = (async () => {
    await Axios.get(`http://localhost:8000/detailProjet/${id}`
  )
    .then((response)=>{
    setUsers(response.data.projet) 
})  });
useEffect( () => {getUsers();},[]);
const optionso = [];
    users.map((item, index) => {
        if(item.role!=="chefProjet"){
        optionso.push({
            label: item.user.username+" "+item.user.lastname+" ("+item.role+")",value: item.id})}
          });
          
let result=""
const random=()=>{
  let chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
  maxPos = chars.length,
  i;
 for (i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * maxPos));
          }
    setLien(`http://localhost:3000/room/${id}/${result}`);
        }
        useEffect( () => {random();},[]) ;

    const onSubmitHandler = (e) => {
            e.preventDefault()
             const formData ={
                  "titre" : titre,
                  "description" : description,
                  "lien":lien,
                  "date":date,
                  "heureFin":heureFin,
                  "heureDebut":heureDébut,
                  "users":usersId,
                
                 
                }
            Axios.post(`http://localhost:8000/ajouterReunion/${id}`, formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
              .then((res) => { 
                if(role==="ROLE_ADMIN"){window.location=`./${id}`} else{  window.location=`./${projetRole}`};
           
           })
              .catch((err) => setError(err.response.data.danger))
          }
 
        //les reunions d'un utilisateur du projet courant
    const getReunions = (async () => {
            await Axios.get(`http://localhost:8000/mesReunions/${id}/${user.id}`)
            .then((response)=>{
            setReunions(response.data.reunion)
            setIsLoding(false);
                    })  });
        useEffect( () => {getReunions();},[]) ;  
          //tous les reunions  du projet courant
    const getReunionsAdmin = (async () => {
        await Axios.get(`http://localhost:8000/reunionsAdmin/${id}`)
        .then((response)=>{
        setReunionsAdmin(response.data.reunion)
        setIsLoding(false);
                })  });
    useEffect( () => {getReunionsAdmin();},[]) ;  
  //delete une réunion 
  const Delete = (idR) => {
    if (window.confirm("Voulez-vous supprimer définitivement cette réunion ?"))
    {Axios.post(`http://localhost:8000/deleteRéunion/${idR}`).then((response)=>{
    if(role==="ROLE_ADMIN"){window.location=`/réunion/${id}`} else{  window.location=`/réunion/${id}/${projetRole}`};})}
    } 
    //estPrésent
  const OuiPresence = (idParticip) => {
    if (window.confirm(" Voulez-vous participer à cette réunion  ?"))
    {Axios.post(`http://localhost:8000/presenceOuiReunion/${idParticip}`).then((response)=>{
    if(role==="ROLE_ADMIN"){window.location=`/réunion/${id}`} else{  window.location=`/réunion/${id}/${projetRole}`};})}
    } 
     //n'estPrésent
  const NonPresence = (idParticip) => {
    if (window.confirm("Voulez-vous annuler votre participation à cette réunion ?"))
    {Axios.post(`http://localhost:8000/presenceNonReunion/${idParticip}`).then((response)=>{
    if(role==="ROLE_ADMIN"){window.location=`/réunion/${id}`} else{  window.location=`/réunion/${id}/${projetRole}`};})}
    } 
     //calendar                                    
 //const localizer = momentLocalizer(moment)
 const [year, setYear] = useState(new Date().getFullYear());
 const [month, setMonth] = useState(new Date().getMonth());
 const [days, setDays] = useState(new Date().getDate());
 const locales = {
   fr: fr,
 }

 const localizer = dateFnsLocalizer({
   format,
   parse,
   startOfWeek,
   getDay,
   locales,
 })
    let myEventsListA = []
    if(role!=="ROLE_ADMIN")
   reunions.map((item,index)=>{
       myEventsListA.push({
           id: item.reunion.id,
           title: item.reunion.titre+" ("+item.reunion.heureDebut+"-"+item.reunion.heureFin+")",
           start: new Date(item.reunion.date),
           end: new Date(item.reunion.date),
           allDay: false,
         })})
         else{
            reunionsAdmin.map((item,index)=>{
                myEventsListA.push({
                    id: item.reunion.id,
                    title: item.reunion.titre+" ("+item.reunion.heureDebut+"-"+item.reunion.heureFin+")",
                    start: new Date(item.reunion.date),
                    end: new Date(item.reunion.date),
                    allDay: false,
                  })})  
         }
         const handleHref= (e) =>{
            if(role==="ROLE_ADMIN"){window.location=`/détailRéunion/${id}/${e}`} else{  window.location=`/détailRéunion/${id}/${projetRole}/${e}`};
          }
          const handleSelect = (eventItem) => {
            let month=eventItem.start.getMonth()+1
            if(month<10){
                month="0"+month
            }
            let day=eventItem.start.getDate()
            if(day<10){
               day="0"+day
            }
            setDate(eventItem.start.getFullYear()+"-"+month+"-"+day)
            setShow(true)};
            console.error = () => {}
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
                <div class="row mb-3 mt-2" style={{marginLeft:"20px"}}>
                   <div class="col-3"> 
                       <div class="row">
                           <div class="col-2"> 
                               <i class="fa  fa-fw fa-cube" style={{fontSize:"38px",color:"#06868D"}} ></i>
                            </div>
                            <div class="col-10"> 
                                <select  style={{fontSize:"19px",fontWeight:"bold"}} onChange={ (e) =>  change(e.target.value)} class="form-select border border-top-0 border-end-0 border-start-0">
                                     <option value={projet.id} selected > {projet.nom}</option>
                                   {role==="ROLE_ADMIN"&&proj.map((item,index)=>
                                      <option   key={item.id} value={item.id}>   {item.nom}</option>) }
                                    {role!=="ROLE_ADMIN"&&proj.map((item,index)=>
                                      <option   key={item.projet.id} value={item.projet.id}>   {item.projet.nom}</option>)}
                                </select> 
                            </div>
                        </div>
                    </div>
                    <div class="col-9">
                    </div> 
                </div> 
            <nav class="sidebar-offcanvas" style={{color:'white',backgroundColor:"#06868D" ,textAlign:"center" }}>
                <div class="row">
                    <div class="col-3">
                    </div>
                    <div class="col-6" style={{marginLeft:"20px" }}>
                        <ul class="nav " >
                            <li class="nav-item">
                                <Link class="nav-link test" to={ `/tableauDeBord/${id}`}   style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }}>
                                   <i class="fa fa-fw fa-bar-chart"></i>
                                   <span class="menu-title" > Tableau de bord</span>
                                </Link>
                            </li>
                            <li class="nav-item ">
                            {role==="ROLE_ADMIN"&&
                        <Link class="nav-link test "  to={ `/tâcheProjet/${id}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }}>
                           <i class="fa fa-fw fa-check"></i>
                           <span class="menu-title"> Tâches</span>
                        </Link>}
                    {(role==="ROLE_CLIENT"||role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                        <Link class="nav-link test "  to={ `/tâcheProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }}>
                           <i class="fa fa-fw fa-check"></i>
                           <span class="menu-title"> Tâches</span>
                        </Link>}
                            </li>
                            <li class="nav-item">
                            {role==="ROLE_ADMIN"&&
                        <Link class="nav-link test "  to={ `/réunion/${id}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }}>
                                   <i class="fa fa-fw fa-briefcase"></i>
                           <span class="menu-title"> Réunions</span>
                        </Link>}
                    {(role==="ROLE_CLIENT"||role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                        <Link class="nav-link test "  to={ `/réunion/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }}>
                                   <i class="fa fa-fw fa-briefcase"></i>
                           <span class="menu-title">Réunions</span>
                        </Link>}
                            </li>
                            <li class="nav-item ">
                            {role==="ROLE_ADMIN"&&
                                <Link class="nav-link test"  to={ `/equipeProjet/${id}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                                     <i class="fa fa-users fa-fw"></i>
                                     <span class="menu-title"> Equipe</span>
                                </Link>}
                          {(role==="ROLE_CLIENT"||role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                                <Link class="nav-link test"  to={ `/equipeProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                                      <i class="fa fa-users fa-fw"></i>
                                      <span class="menu-title"> Equipe</span>
                                </Link>}
                            </li>
                            <li class="nav-item ">
                           {role==="ROLE_ADMIN"&&projet.archive===false&&
                                <Link class="nav-link test"  to={ `/parametreProjet/${id}`}  style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px"}} >
                                   <i class="fa fa-fw fa-cog "></i>
                                   <span> Paramètres</span>
                                </Link>}
                          {
                            projetRole==="chefProjet"&&projet.archive===false&&
                                <Link class="nav-link test"  to={ `/parametreProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                                    <i class="fa fa-fw fa-cog "></i>
                                    <span> Paramètres</span>
                                </Link>}
                         {(projetRole==="client"||projetRole==="membre")&&
                                <Link class="nav-link test"   to={ `/detailProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                                    <i class="fa fa-fw fa-cog "></i>
                                    <span> Détails</span>
                                </Link>}
                        {(role==="ROLE_ADMIN"&&projet.archive===true)&&
                        <Link class="nav-link test"   to={ `/detailProjet/${id}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                           <i class="fa fa-fw fa-cog "></i>
                           <span> Détails</span>
                        </Link>}
                        {(projetRole==="chefProjet"&&projet.archive===true)&&
                        <Link class="nav-link test"   to={ `/detailProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                           <i class="fa fa-fw fa-cog "></i>
                           <span> Détails</span>
                        </Link>}
                            </li>
                        </ul>
                    </div> 
                    <div class="col-3">
                    </div>  
                 </div>
            </nav> 
            <div>
            {projetRole==="chefProjet"&&
                    <div class="row   ">
                        <div class="col-7"></div>
                        <div class="col-5">
                            <div class="row ">
                                <div class="col-4">
                                </div>
                                {type==="Liste"&&
                           <>  <div class="col-1 mt-2">
                                   <button class=" btn " title="Liste" style={{color:"white",backgroundColor:"#06868D" ,padding:"8px"}}><i class="fa fa-fw fa-list"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Liste")}}  ></i></button> 
                                </div>
                                <div class="col-1 mt-2">
                                   <button class="btn " title="Calendrier" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px" }}><i class="fa fa-fw fa-calendar"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Calendrier")}} ></i></button> 
                                </div>
                             </> } 
                                {type==="Calendrier"&&
                            <>
                                <div class="col-1 mt-2">
                                    <button class=" btn " title="Liste" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px"}}><i class="fa fa-fw fa-list" style={{fontSize:"14px"}}  onClick={ (e) =>  {setType("Liste")}}  ></i></button> 
                                </div>
                                <div class="col-1 mt-2">
                                    <button class="btn " title="Calendrier"  style={{backgroundColor:"#06868D",color:"white" ,padding:"8px" }}><i class="fa fa-fw fa-calendar" style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Calendrier")}} ></i></button> 
                                </div>
                            </> }
                               {projet.archive===false&&
                                <div class="col-6 mt-2">
                                    <button className="btn pt-2 pb-2 pe-4 ps-4"  onClick={ (e) =>  {handleShow()}} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}  >
                                        <i class="fa fa-fw fa-plus menu-title" style={{fontSize:"14px"}} > </i> Ajouter une réunion
                                    </button>                    
                                </div>}
                            </div>
                        </div>
                    </div>}
                    {projetRole!=="chefProjet"&&
                    <div class="row   mt-2">
                        <div class="col-7"></div>
                        <div class="col-5">
                            <div class="row ">
                                <div class="col-9">
                                </div>
                                {type==="Liste"&&
                           <>  <div class="col-1">
                                   <button class=" btn " title="Liste" style={{color:"white",backgroundColor:"#06868D" ,padding:"8px"}}><i class="fa fa-fw fa-list"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Liste")}}  ></i></button> 
                                </div>
                                <div class="col-1">
                                   <button class="btn " title="Calendrier" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px" }}><i class="fa fa-fw fa-calendar"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Calendrier")}} ></i></button> 
                                </div>
                             </> } 
                                {type==="Calendrier"&&
                            <>
                                <div class="col-1">
                                    <button class=" btn " title="Liste" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px"}}><i class="fa fa-fw fa-list" style={{fontSize:"14px"}}  onClick={ (e) =>  {setType("Liste")}}  ></i></button> 
                                </div>
                                <div class="col-1">
                                    <button class="btn " title="Calendrier"  style={{backgroundColor:"#06868D",color:"white" ,padding:"8px" }}><i class="fa fa-fw fa-calendar" style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Calendrier")}} ></i></button> 
                                </div>
                            </> }
                            </div>
                        </div>
                    </div>}
                    
                    {type==="Liste"&&
                    <>
                    <div class="table-responsive mt-6 me-2">
                        <table class="table">
                            <thead>
                                <tr style={{color:"#06868D",textAlign:"center"}}>
                                    <th>Titre</th>
                                    <th> Lien</th>
                                    <th> date</th>
                                    <th> Heure début</th>
                                    <th> HeureFin</th>
                                    <th> Annulée</th>
                                    {role!=="ROLE_ADMIN"&&
                                    <th>Présence</th>}
                                    <th>Actions</th>
                                    {role!=="ROLE_ADMIN"&&
                                    <th></th>}
                                 
                                </tr>
                            </thead>
                            <tbody  >
                            {role!=="ROLE_ADMIN"&&reunions.map((item,index)=>(
                               <tr  style={{textAlign:"center"}} >
                                   <td >{item.reunion.titre} </td >
                                   <td >{item.reunion.lien} </td >
                                   <td >{item.reunion.date} </td >
                                   <td >{item.reunion.heureDebut} </td >
                                   <td >{item.reunion.heureFin} </td >
                                 
                                      <Reunion id={id} projetRole={projetRole} idR={item.reunion.id} Delete={Delete} archive={projet.archive} raisonAnn={item.reunion.raisonAnnulation} annule={item.reunion.annule}
                                       presence={item.presence} date={item.reunion.date} lien={item.reunion.lien}  heureDebut={item.reunion.heureDebut} heureFin={item.reunion.heureFin} 
                                       idParticip={item.id} OuiPresence={OuiPresence} NonPresence={NonPresence} note={item.note}/>
                                  
                                </tr >))}
                                {role==="ROLE_ADMIN"&&reunionsAdmin.map((item,index)=>(
                               <tr  style={{textAlign:"center"}} >
                                   <td >{item.reunion.titre} </td >
                                   <td >{item.reunion.lien} </td >
                                   <td >{item.reunion.date} </td >
                                   <td >{item.reunion.heureDebut} </td >
                                   <td >{item.reunion.heureFin} </td >
                                 
                                       <Reunion id={id} projetRole={projetRole} idR={item.reunion.id} archive={projet.archive} raisonAnn={item.reunion.raisonAnnulation} annule={item.reunion.annule}/>
                                  
                                </tr >))}
                            </tbody>
                        </table>
                    </div> 
                    </>
                    }
                    {type==="Calendrier"&&
                    <>
                    
                            {role!=="ROLE_ADMIN"&&
                              <>
                              <div class="m-4">
                                 <Calendar
                                           selectable
                                           messages={{
                                            next: "Suivant",
                                            previous: "Précédent",
                                            today: "Aujourd'hui",
                                            month: "Mois",
                                            week: "Semaine",
                                            day: "Jour",
                                            agenda: "Planning",
                                            date: "date",}}
                                           events={ myEventsListA}
                                           onSelectEvent={(event) => handleHref(event.id)}
                                           onSelectSlot={projetRole==="chefProjet"&&handleSelect}
                                           startAccessor="start"
                                           endAccessor="end"
                                     
                                           defaultView={Views.MONTH}
                                           defaultDate={new Date(year, month, days)}
                                           style={{ height: 450,fontSize:"13px" }}
                                           localizer={localizer}
                                           
                                        /> </div>
                              </>
                            }
                                {role==="ROLE_ADMIN"&&
                                <>
                                  <div class="m-4">
                                   <Calendar
                                           selectable
                                           messages={{
                                            next: "Suivant",
                                            previous: "Précédent",
                                            today: "Aujourd'hui",
                                            month: "Mois",
                                            week: "Semaine",
                                            day: "Jour",
                                            agenda: "Planning",
                                            date: "date",}}
                                           events={ myEventsListA}
                                           onSelectEvent={(event) => handleHref(event.id)}

                                           startAccessor="start"
                                           endAccessor="end"
                                        
                                           defaultView={Views.MONTH}
                                           defaultDate={new Date(year, month, days)}
                                           style={{ height: 450,fontSize:"13px" }}
                                           localizer={localizer}
                                           
                                        /> </div>
                                </>
                                }
                           
                    </>
                    }
            </div>
        </div>
    </div>
 </div>}
 <Modal show={show} size="xl">
        <Modal.Header  >
          <Modal.Title>Ajouter une réunion
            <button  onClick={handleClose} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"895px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {    error &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{error } </p>}

            <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} >
                <div class="row">
                    <div class="col-6">
                    <div class="col-12">
                            <div class="row">
                                <div class="col-6">
                                   <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre <span style={{color:"red"}}>*</span></label>
                                        <input className="form-control  form-icon-input" name="titre"  type="text" onChange={(e)=>setTitre(e.target.value)} placeholder="saisir titre de la réunion" pattern=".{3,}" title="3 caractères ou plus"required="required"/>
                                    </div>
                                </div> 
                                <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date <span style={{color:"red"}}>*</span></label>
                                        <input className="form-control  form-icon-input" name="date" type="date" value={date}  onChange={(e)=>setDate(e.target.value)} required="required"/>
                                    </div>
                                </div> 
                            </div>  
                        </div> 
                        <div class="row">
                            <div class="col-10">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Lien <span style={{color:"red"}}>*</span></label>
                                    <input disabled className="form-control  form-icon-input" name="lien"  type="text" value={lien}  pattern=".{3,}" title="3 caractères ou plus"required="required"/>
                               </div>
                            </div>
                            <div class="col-2 mt-4">
                                <button type="button" className="btn "  onClick={ (e) =>  {random()}} style={{ color:"#06868D"  }}  >
                                        <i class="fa fa-fw fa-video-camera" style={{fontSize:"16px"}} > </i> 
                                </button> 
                            </div>
                        </div>
                    </div> 
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Description </label>
                             <br></br><textarea className="" name="description"  rows="4" cols="70"  onChange={(e)=>setDescription(e.target.value)} placeholder="saisir description d'une réunion " pattern=".{3,}" title="3 caractères ou plus"required="required"></textarea>
                        </div>
                    </div>
                </div>
                <div class="row">
                   <div class="col-6">
                       <div class="row">
                           <div class="col-6">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Heure début <span style={{color:"red"}}>*</span></label>
                                    <input className="form-control  form-icon-input" name="heureDebut" type="time"   onChange={(e)=>setHeureDébut(e.target.value)} required="required"/>
                                </div>
                            </div>
                            <div class="col-6">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Heure fin <span style={{color:"red"}}>*</span></label>
                                    <input className="form-control  form-icon-input" name="heureFin" type="time"  onChange={(e)=>setHeureFin(e.target.value)}  required="required"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Participants (Vous êtes un participant par défaut)</label>
                            <Select isMulti options={optionso} value={usersId}  isOptionDisabled={(option) => option.disabled} onChange={setUsersId} labelledBy={"Select"}      overrideStrings={{
                                  selectSomeItems: "Choisir le(s) participant(s)",

                                }}
                                className="select fs-9" />
                        </div>
                    </div>
                </div>
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"    disabled={(!titre||!lien||!heureDébut||!heureFin||!date) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Ajouter
                  </button>
                </div>
            </form>
        </Modal.Body>
    </Modal>
</>
       )
}

  

