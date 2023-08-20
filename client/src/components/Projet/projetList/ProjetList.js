import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import "./ProjetList.css"
import Modal from 'react-bootstrap/Modal';
import Projet from "../projet/Projet";
import jwt_decode from "jwt-decode";
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
import { MultiSelect } from "react-multi-select-component";
import Select from 'react-select';
import moment from 'moment'
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"

export default function ProjetList() {
    const [isLoding, setIsLoding] = useState(true);
    const [typeSelect, setTypeSelect] = useState("nonArchivé")  
    const [type, setType] = useState("Liste")  
    const [nom, setNom] = useState("") 
    const [description, setDescription] = useState("")  
    const [dateDebut, setDateDébut] = useState("")  
    const [dateFin, setDateFin] = useState("") 
    const [document, setDocument] = useState("")  
    const [typeSelectUser, setTypeSelectUser] = useState("nonArchivé")   
    const [typeUserClient, setTypeUserClient] = useState("Secteur")   
    const [typeUserChef, setTypeUserChef] = useState("Secteur")   
    const [projets,setProjets]= useState([])
    const [projetsA,setProjetsA]= useState([])
    const [projetsAUser,setProjetsAUser]= useState([])
    const [projetsUser,setProjetsUser]= useState([])
    const [show, setShow] = useState(false);
    const [secteurs,setSecteurs]= useState([])
    const [secteur,setSecteur]= useState("")
    const [secteurClients,setSecteurClients]= useState([])
    const [client,setClient]= useState([])
    const [secteurChefs,setSecteurChefs]= useState([])
    const [chef,setChef]= useState([])
    const [clients,setClients]= useState([])
    const [chefProjets,setChefProjets]= useState([])
    const [checked, setChecked] = useState(false);
    const [membre,setMembre]= useState([])
    const [membres,setMembres]= useState([])
    const [filteredProjets, setFilteredProjets] = useState([]);
    const [filteredProjetsA, setFilteredProjetsA] = useState([]);
    const [filteredProjetsUser, setFilteredProjetsUser] = useState([]);
    const [filteredProjetsAUser, setFilteredProjetsAUser] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    function onKeyUpHandler(e) {
        setSearch(e);
      }
    //search
    useEffect(() => {
        if(typeSelect==="nonArchivé"){
            const newData = filteredProjets.filter(function (item) {
                const itemData = item.nom
                    ? item.nom.toUpperCase()
                    : ''.toUpperCase();
                const textData = search.toString().toUpperCase();
                return itemData.indexOf(textData) > -1;});
                setProjets(newData);}
        if(typeSelect==="archivé"){       
            const newDataA = filteredProjetsA.filter(function (item) {
                const itemDataA = item.nom
                        ? item.nom.toUpperCase()
                        : ''.toUpperCase();
                const textDataA = search.toString().toUpperCase();
                    return itemDataA.indexOf(textDataA) > -1;});
                    setProjetsA(newDataA);}
        if(typeSelectUser==="nonArchivé"){         
            const newDataUser = filteredProjetsUser.filter(function (item) {
                const itemDataUser = item.projet.nom
                        ? item.projet.nom.toUpperCase()
                        : ''.toUpperCase();
                const textDataUser = search.toString().toUpperCase();
                    return itemDataUser.indexOf(textDataUser) > -1; });
                    setProjetsUser(newDataUser);}
        if(typeSelectUser==="archivé"){           
            const newDataAUser = filteredProjetsAUser.filter(function (item) {
                const itemDataAUser = item.projet.nom
                        ? item.projet.nom.toUpperCase()
                        : ''.toUpperCase();
                const textDataAUser = search.toString().toUpperCase();
                    return itemDataAUser.indexOf(textDataAUser) > -1;});
                    setProjetsAUser(newDataAUser);}
           },[search]);
   
    //Modal
    const handleClose = () => {setShow(false);if (type==="Liste"){window.location='./projets'}}
    const handleShow = () => {setShow(true); let months=(new Date().getMonth())+1
        let years=new Date().getFullYear()
        let day=new Date().getDate()
        if(months<10){months="0"+months}
        if(day<10){ day="0"+day}
        setDateDébut(years+"-"+months+"-"+day)
        setDateFin("")}
    //checkbox
    const handleChange = () => {
        setChecked(!checked);
        setChef([]);
        setTypeUserChef("Secteur");
        setMembre([])
      };
    //file
    const handleDocument = (file) => {
        setDocument(file[0]);
      };
    let user = jwt_decode(localStorage.getItem("token"));
    let userRole=user.roles[0]
//les projets non archivés 
   const getProjets = (async () => {
    await Axios.get(`http://localhost:8000/projet/acces`).then((response)=>{
     setProjets(response.data.projet)
     setFilteredProjets(response.data.projet)
     setIsLoding(false);
    })  });
    useEffect( () => {getProjets();},[]) ;
//les projets archivés    
    const getProjetsA = (async () => {
        await Axios.get(`http://localhost:8000/projet/accesArchive`).then((response)=>{
         setProjetsA(response.data.projet)
         setFilteredProjetsA(response.data.projet)
         
        })  });
    useEffect( () => {getProjetsA();},[]) ;
//mes projets non archivés 
    const getProjetsUser = (async () => {
        await Axios.get(`http://localhost:8000/droit/accesU/${user.id}`
      )
        .then((response)=>{
        setProjetsUser(response.data.projet)
        setFilteredProjetsUser(response.data.projet)
        setIsLoding(false);
            })  });
    useEffect( () => {getProjetsUser();},[]) ;
//mes projets archivés    
    const getProjetsAUser = (async () => {
        await Axios.get(`http://localhost:8000/droit/accesArchiveU/${user.id}`)
        .then((response)=>{
        setProjetsAUser(response.data.projet)
        setFilteredProjetsAUser(response.data.projet)
                })  });
    useEffect( () => {getProjetsAUser();},[]) ;
//Désarchivé un projet     
        const Désarchivé =(id) =>{
            if (window.confirm("Voulez-vous désarchiver cet projet ?"))
                                     Axios.post(`http://localhost:8000/désarchivéP/${id}`)
                                     }
//archivé un projet   
     const Archivé =(id) =>{
         if (window.confirm("Vous pourrez à tout moment le consulter via la liste des projets archivés. Souhaitez-vous archiver le projet ?"))
                      Axios.post(`http://localhost:8000/archivéP/${id}`)
                       }
//delete un projet   
    const Delete =(id) =>{
          if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Attention cette action est irréversible, et tous les contenus de ce projet seront supprimés."))
                    Axios.post(`http://localhost:8000/deleteProjet/${id}`)
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
    projets.map((item,index)=>{
        myEventsListA.push({
            id: item.id,
            title: item.nom,
            start: new Date(item.dateDebut),
            end: new Date(item.dateFin),
            allDay: false,
          })
})
let myEventsList = [] 
    projetsUser.map((item,index)=>{
        myEventsList.push({
            id:item.projet.id,
            title: item.projet.nom,
            start: new Date(item.projet.dateDebut),
            end: new Date(item.projet.dateFin),
            allDay: false,
          })})

  

  const handleSelect = (eventItem) => {
    let month=eventItem.start.getMonth()+1
    if(month<10){
        month="0"+month
    }
    let day=eventItem.start.getDate()
    if(day<10){
       day="0"+day
    }
    setDateDébut(eventItem.start.getFullYear()+"-"+month+"-"+day)
    setDateFin(eventItem.start.getFullYear()+"-"+month+"-"+day)
    setShow(true)
    
   };


//les secteurs  
  const getSecteurs = (async () => {
   
    await Axios.get("http://localhost:8000/secteur").then((response)=>{
       setSecteurs(response.data.secteur)})  
});
 useEffect( () => {getSecteurs();},[]) ; 
//get client par secteur                   
const getSecteurClients = (async () => {
    await Axios.get(`http://localhost:8000/secteurClient/${secteur}`).then((response)=>{
                      setSecteurClients(response.data.user)
                    })  });
    useEffect( () => {getSecteurClients(); },[]) ;
    const optionsCSecteur=[]
        secteurClients.map((item,index)=>(
        optionsCSecteur.push( { label: item.utilisateur.username+" "+item.utilisateur.lastname, value: item.utilisateur.id }) ))                       
//get chef projet par secteur               
const getSecteurChefProjets = (async () => {
     await Axios.get(`http://localhost:8000/secteurChefProjet/${secteur}`).then((response)=>{
                      
                        setSecteurChefs(response.data.user)
                        })  });
    useEffect( () => {getSecteurChefProjets();},[]) ;
    const optionsChSecteur=[]
            secteurChefs.map((item,index)=>(
             optionsChSecteur.push( { label: item.utilisateur.username+" "+item.utilisateur.lastname, value: item.utilisateur.id }) ))                       
//tous les clients
const getClients = (async () => {
    await Axios.get(`http://localhost:8000/indexClient`).then((response)=>{
     setClients(response.data.user)
    })  });
    useEffect( () => {getClients();},[]) ;
    const optionsC=[]
         clients.map((item,index)=>(
         optionsC.push( { label: item.utilisateur.username+" "+item.utilisateur.lastname, value: item.utilisateur.id }) ))                       
//tous les chefs de projets
const getChefProjets = (async () => {
        await Axios.get(`http://localhost:8000/indexChefProjet`).then((response)=>{
         setChefProjets(response.data.user)
        })  });
        useEffect( () => {getChefProjets();},[]) ;     
    const optionsCh=[]
        chefProjets.map((item,index)=>(
        optionsCh.push( { label: item.utilisateur.username+" "+item.utilisateur.lastname, value: item.utilisateur.id }) ))  
//les membres
const getMembres = (async () => {
    await Axios.get(`http://localhost:8000/indexMembre`).then((response)=>{
     setMembres(response.data.user)
    })  });
    useEffect( () => {getMembres();},[]) ;  
    const optionsM=[]
        membres.map((item,index)=>(
        optionsM.push( { label: item.utilisateur.username+" "+item.utilisateur.lastname+" ("+item.departement+")", value: item.utilisateur.id }) )) 
//change TypeUserChef           
const ChangeTypeUserChef= (e) =>{
    setTypeUserChef(e);
    if(e==="Tous"&&typeUserClient==="Tous"){setSecteur("")}
}
//change TypeUserClient 
const ChangeTypeUserClient= (e) =>{
    setTypeUserClient(e);
    if(typeUserChef==="Tous"&&e==="Tous"){setSecteur("")}
}
const handleHref= (e) =>{
    window.location= `./tableauDeBord/${e}`
}
console.error = () => {}
const onSubmitHandler = (e) => {
    e.preventDefault()
     const formData ={
          "nom" : nom,
          "description":description,
          "dateDebut":dateDebut,
          "dateFin":dateFin,
          "client":client,
          "chef":chef,
          "membre":membre,
          "document":document,
         
        }
    Axios.post(`http://localhost:8000/ajouterProjet`, formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
      .then((res) => { 
        window.location='./projets'  
   
   })
   .catch((err) => setError(err.response.data.danger))
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
<>
<div class="container-scroller">
        <Navbar/>
        <div class="container-fluid page-body-wrapper">
          <Sidebar/>
           <div class="main-panel">
                <div class="content-wrapper">
<div  style={{textAlign:"right"}}>
   
    {userRole==="ROLE_ADMIN"&&
        <>
    <div class="row mb-2">
        <div class="col-7"> </div>
        <div class="col-5">
            <div class="row ">
                <div class="col-6"> 
                    <div className="form-icon-container1 ">
                        <input className="form-control  form-icon-input1" value={search} name="filter"  type="text" onChange={(text) =>{onKeyUpHandler(text.target.value)}} placeholder="Recherche" style={{paddingTop:"15px",paddingBottom:"15px" ,borderColor:"#06868D"}}/>
                        <span className="fa fa-search text-900 fs--1 form-icon1"></span>
                    </div> 
                </div>
                <div class="col-6">
                   <button type="button" className="btn pt-2 pb-2 pe-5 ps-5 " onClick={handleShow} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}><i class="fa fa-fw fa-plus" style={{fontSize:"14px"}}></i> Créer un projet</button>
                </div> 
            </div> 
        </div> 
    </div>
   <div class="row mb-2">
        <center> 
            {type==="Calendrier"&&
            <>
              <button class=" btn type" title="Liste" style={{color:"#06868D" ,padding:"12px"}}><i class="fa fa-fw fa-list" style={{fontSize:"18px"}}  onClick={ (e) =>  {setType("Liste")}}  ></i></button> 
              <button class="btn  type" title="Calendrier"  style={{backgroundColor:"#06868D",color:"white" ,padding:"12px" }}><i class="fa fa-fw fa-calendar" style={{fontSize:"18px"}} onClick={ (e) =>  {setType("Calendrier")}} ></i></button> 
             </> }
             {type==="Liste"&&
            <>
              <button class=" btn  type" title="Liste" style={{color:"white",backgroundColor:"#06868D" ,padding:"12px"}}><i class="fa fa-fw fa-list"  style={{fontSize:"18px"}} onClick={ (e) =>  {setType("Liste")}}  ></i></button> 
              <button class="btn type" title="Calendrier" style={{color:"#06868D" ,padding:"12px" }}><i class="fa fa-fw fa-calendar"  style={{fontSize:"18px"}} onClick={ (e) =>  {setType("Calendrier")}} ></i></button> 
             </> }
        </center>
    </div>
    <div class="row ">
        <div class="col-5" >
       {type==="Liste"   &&
           <div class=" " style={{color:'white' ,borderColor:"#06868D",textAlign:"center" }}>
                <ul class="nav " >
                    <li class="nav-item">
                        {typeSelect==="nonArchivé"&&
                        <button  class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("nonArchivé");setSearch("");getProjetsA()}}   style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                            <span class="menu-title" > Tous les Projets</span>
                        </button>}
                        {typeSelect==="archivé"&&
                        <button type="button" class="nav-link border border-top-0 border-end-0 border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("nonArchivé");setSearch("");getProjetsA()}}   style={{color:"#06868D",fontSize:"14px", borderBottom: "4px solid black" }}>
                            <span class="menu-title" > Tous les Projets</span>
                        </button>}
                    </li>
                    <li class="nav-item ">
                    {typeSelect==="archivé"&&
                       <button class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("archivé");setSearch("");getProjets()}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                           <span class="menu-title">  Projets archivés</span>
                       </button>
                    }
                    {typeSelect==="nonArchivé"&&
                        <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("archivé");setSearch("");getProjets()}} style={{color:"#06868D",fontSize:"14px" }}>
                            <span class="menu-title">  Projets archivés</span>
                        </button>}
                    </li>
                </ul>
            </div>  
      }
        </div> 
        <div class="col-7">
        </div>
    </div>
    </> }
   {(userRole==="ROLE_CLIENT"||userRole==="ROLE_MEMBRE"||userRole==="ROLE_CHEFPROJET")&&
        <>
    <div class="row mb-2">
        <div class="col-7"> </div>
        <div class="col-5">
            <div class="row ">
                <div class="col-6"> 
                </div>
                <div class="col-6">
                    <div className="form-icon-container1 ">
                        <input className="form-control  form-icon-input1" value={search} name="filter"  type="text" onChange={(text) => {onKeyUpHandler(text.target.value)}} placeholder="Recherche" style={{paddingTop:"15px",paddingBottom:"15px" ,borderColor:"#06868D"}}/>
                        <span className="fa fa-search text-900 fs--1 form-icon1"></span>
                    </div> 
                </div> 
            </div> 
        </div> 
    </div>
    <div class="row mb-2">
        <center> 
            {type==="Calendrier"&&
            <>
              <button class=" btn type" title="Liste" style={{color:"#06868D" ,padding:"12px"}}><i class="fa fa-fw fa-list" style={{fontSize:"18px"}}  onClick={ (e) =>  {setType("Liste")}}  ></i></button> 
              <button class="btn  type" title="Calendrier"  style={{backgroundColor:"#06868D",color:"white" ,padding:"12px" }}><i class="fa fa-fw fa-calendar" style={{fontSize:"18px"}} onClick={ (e) =>  {setType("Calendrier")}} ></i></button> 
             </> }
             {type==="Liste"&&
            <>
              <button class=" btn  type" title="Liste" style={{color:"white",backgroundColor:"#06868D" ,padding:"12px"}}><i class="fa fa-fw fa-list"  style={{fontSize:"18px"}} onClick={ (e) =>  {setType("Liste")}}  ></i></button> 
              <button class="btn type" title="Calendrier" style={{color:"#06868D" ,padding:"12px" }}><i class="fa fa-fw fa-calendar"  style={{fontSize:"18px"}} onClick={ (e) =>  {setType("Calendrier")}} ></i></button> 
             </> }
        </center>
    </div>
    <div class="row">
        <div class="col-5"> 
        {type==="Liste"   &&
            <div class=" " style={{color:'white' ,borderColor:"#06868D",textAlign:"center" }}>
            <ul class="nav " >
                <li class="nav-item">
                    {typeSelectUser==="nonArchivé"&&
                    <button  class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelectUser("nonArchivé");setSearch("");getProjetsAUser()}}   style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                        <span class="menu-title" > Mes Projets</span>
                    </button>}
                    {typeSelectUser==="archivé"&&
                    <button type="button" class="nav-link border border-top-0 border-end-0 border-start-0 border-info"  onClick={ (e) =>  {setTypeSelectUser("nonArchivé");setSearch("");getProjetsAUser()}}   style={{color:"#06868D",fontSize:"14px", borderBottom: "4px solid black" }}>
                        <span class="menu-title" > Mes Projets</span>
                    </button>}
                </li>
                <li class="nav-item ">
                {typeSelectUser==="archivé"&&
                   <button class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelectUser("archivé");setSearch("");getProjetsUser()}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                       <span class="menu-title">  Projets archivés</span>
                   </button>
                }
                {typeSelectUser==="nonArchivé"&&
                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info"  onClick={ (e) =>  {setTypeSelectUser("archivé");setSearch("");getProjetsUser()}} style={{color:"#06868D",fontSize:"14px" }}>
                        <span class="menu-title">  Projets archivés</span>
                    </button>}
                </li>
            </ul>
        </div>  }
        </div>
        <div class="col-7">
        </div>
        
    </div>
        </> 
  }   
   
</div>
{type==="Liste"   &&
<div class="row flex-grow " >
    {typeSelect==="nonArchivé"&&userRole==="ROLE_ADMIN"&&projets.length!==0&&
                               projets.map((item,index)=>(
                                 <Projet key={index} id={item.id} nom={item.nom} description={item.description} userRole={userRole}
                                         archivé={item.archive} dateDebut={item.dateDebut} dateFin={item.dateFin} type={typeSelect} Désarchivé={Désarchivé} Delete={Delete}  Archivé={Archivé} 
                                         />))}

    {typeSelect==="archivé"&&userRole==="ROLE_ADMIN"&&projetsA.length!==0&&
                               projetsA.map((item,index)=>(
                                    <Projet  key={index} id={item.id} nom={item.nom} description={item.description} userRole={userRole}
                                         archivé={item.archive} dateDebut={item.dateDebut} dateFin={item.dateFin} type={typeSelect} Désarchivé={Désarchivé} Delete={Delete}  Archivé={Archivé}
                                         />)) }
    {typeSelect==="archivé"&&userRole==="ROLE_ADMIN"&&projetsA.length===0&&
        <center style={{fontSize:"15px",marginTop:"180px"}}> La liste des projets archivés est vide.</center>}

    {typeSelectUser==="nonArchivé"&&userRole!=="ROLE_ADMIN"&&projetsUser.length!==0&&
                               projetsUser.map((item,index)=>(
                                 <Projet key={index} id={item.projet.id} nom={item.projet.nom} description={item.projet.description} userRole={userRole}
                                         archivé={item.projet.archive} dateDebut={item.projet.dateDebut} dateFin={item.projet.dateFin}  type={typeSelectUser} Archivé={Archivé} Désarchivé={Désarchivé} Delete={Delete}
                                         />))}

    {typeSelectUser==="archivé"&&userRole!=="ROLE_ADMIN"&&projetsAUser.length!==0&&
                               projetsAUser.map((item,index)=>(
                                    <Projet  key={index} id={item.projet.id} nom={item.projet.nom} description={item.projet.description} userRole={userRole}
                                         archivé={item.projet.archive} dateDebut={item.projet.dateDebut} dateFin={item.projet.dateFin} type={typeSelectUser} Désarchivé={Désarchivé} Delete={Delete}  Archivé={Archivé}
                                         />))}
    {typeSelectUser==="archivé"&&userRole!=="ROLE_ADMIN"&&projetsAUser.length===0&&
        <center style={{fontSize:"15px",marginTop:"180px"}}> La liste de mes projets archivés est vide.</center>}
  
</div>}

{type==="Calendrier"   && userRole==="ROLE_ADMIN"&&
       <div class="row flex-grow mb-6" >
            <div class="col-12 grid-margin stretch-card mt-3" >
                <div class="card card-rounded border border-3">
                    <div class="card-body">
                       <div class="row mb-1">
                           <div className="py-3 d-flex">
                                <div class="col-12" >
                                    <div className="flex-sm-column">
                                       <Calendar
                                           selectable={true}
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
                                           startAccessor="start"
                                           endAccessor="end"
                                          
                                           onSelectSlot={handleSelect}
                                           onSelectEvent={(event) => handleHref(event.id)}
                                           defaultView={Views.MONTH}
                                           defaultDate={new Date(year, month, days)}
                                           style={{ height: 450,fontSize:"14px" }}
                                           localizer={localizer}
                                           
                                        />
                                    </div> 
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </div>}
        {type==="Calendrier" && userRole!=="ROLE_ADMIN"&&
       <div class="row flex-grow mb-6" >
            <div class="col-12 grid-margin stretch-card mt-3" >
                <div class="card card-rounded border border-3">
                    <div class="card-body">
                       <div class="row mb-1">
                           <div className="py-3 d-flex">
                                <div class="col-12" >
                                    <div className="flex-sm-column">
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
                                           events={ myEventsList}
                                          
                                           startAccessor="start"
                                           endAccessor="end"
                                           onSelectEvent={(event) => handleHref(event.id)}
                                           defaultView={Views.MONTH}
                                           defaultDate={new Date(year, month, days)}
                                           style={{ height: 450,fontSize:"14px" }}
                                           localizer={localizer}
                                           
                                        />
                                    </div> 
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </div>}
        <Modal show={show}   size="xl" >
        <Modal.Header  >
          <Modal.Title>Créer un projet   
            <button  onClick={handleClose} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"940px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
           </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {    error &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{error } <br/></p>}

            <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} >
               <div class="row">
                   <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Nom de projet <span style={{color:"red"}}>*</span></label>
                            <input className="form-control  form-icon-input" name="nom"  type="text" onChange={(e)=>setNom(e.target.value)} placeholder="saisir nom de projet" pattern=".{3,}" title="3 caractères ou plus"required="required"/>
                        </div>
                        <div class="col-12">
                            <div class="row">
                                <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de début <span style={{color:"red"}}>*</span></label>
                                       <input className="form-control  form-icon-input" name="dateDebut" type="date" value={dateDebut}  onChange={(e)=>setDateDébut(e.target.value)} required="required"/>
                                    </div>
                                </div>
                                 <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de fin <span style={{color:"red"}}>*</span></label>
                                         <input className="form-control  form-icon-input" name="dateFin" type="date"  onChange={(e)=>setDateFin(e.target.value)}  required="required"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Description de projet <span style={{color:"red"}}>*</span></label>
                            <br></br><textarea className="" name="description"  rows="4" cols="70"  onChange={(e)=>setDescription(e.target.value)} placeholder="saisir description de projet" pattern=".{3,}" title="3 caractères ou plus"required="required"></textarea>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le secteur de projet <span style={{color:"red"}}>*</span></label>
                            <select value={secteur} onChange={ (e) =>  setSecteur(e.target.value)} onClick={() => { getSecteurChefProjets(); getSecteurClients();}} style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                                <option value="" selected disabled> Choisir le secteur</option>
                                {
                                  secteurs.map((item,index)=>(
                                    <option   key={item.id} value={item.id}>{item.titre}</option>
                                    )) }
                            </select> 
                        </div>
                    </div> 
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Document </label>
                            <div class="mb-2" >
                                <input className="form-control"  type="file" id="document"  name="document" onChange={e => handleDocument(e.target.files)} />
                            </div>
                        </div>
                    </div> 
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="row">
                            <div class="col-9">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le client  <span style={{color:"red"}}>*</span></label>
                                {typeUserClient==="Secteur"&& 
                                <Select
                                options={optionsCSecteur}
                                value={client}
                                onChange={setClient}
                                labelledBy={"Select"}
                               placeholder= "Choisir le client"
                               className="select fs-9"
                               
                             
                              /> 
                                     }

                                    {typeUserClient==="Tous"&& 
                                    <Select
                                    options={optionsC}
                                    value={client}
                                    onChange={setClient}
                                    labelledBy={"Select"}
                                    placeholder= "Choisir le client"
                                    className="select fs-9"
                                  /> 
                                    }
                                </div>
                            </div>
                            <div class="col-3">
                                <div className="mb-3 mt-2 text-start"><label className="form-label" style={{color:"#06868D"}}> </label>
                                   <select value={typeUserClient} onChange={ (e) =>  {ChangeTypeUserClient(e.target.value)}}  style ={{fontSize:"13px",paddingBottom:"8px",paddingTop:"8px"}}class="form-select">
                                       <option value="Secteur" > Secteur</option>
                                       <option value="Tous" > Tous</option>
                                    </select> 
                                </div>
                            </div>
                        </div>
                    </div> 
                    <div class="col-6">
                        <div class="row">
                        {checked===true&&
                            <div class="col-12">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le chef de projet <span style={{color:"red"}}>*</span></label>
                              
                              <Select
                                 options={optionsM}
                                 value={membre}
                                 onChange={setMembre}
                                 labelledBy={"Select"}
                                placeholder= "Choisir le membre"
                                 className="select fs-9"
                               /> 
                           </div>
                            </div> }    
                        {checked===false&&
                        <>
                          <div class="col-9">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le chef de projet <span style={{color:"red"}}>*</span></label>
                              
                                {typeUserChef==="Secteur"&& 
                                 <Select
                                 options={optionsChSecteur}
                                 value={chef}
                                 onChange={setChef}
                                 labelledBy={"Select"}
                                 placeholder="Choisir le chef de projet"
                                 className="select fs-9"
                               /> 
                                     }

                                    {typeUserChef==="Tous"&& 
                                     <Select
                                     options={optionsCh}
                                     value={chef}
                                     onChange={setChef}
                                     labelledBy={"Select"}
                                     placeholder="Choisir le chef de projet"
                                    className="select fs-9"
                                   />
                                    
                                    } </div>
                                    </div>
                                    <div class="col-3">
                                <div className="mb-3 mt-2 text-start"><label className="form-label" style={{color:"#06868D"}}></label>
                                    <select value={typeUserChef} onChange={ (e) =>  {ChangeTypeUserChef(e.target.value) }}  style ={{fontSize:"13px",paddingBottom:"8px",paddingTop:"8px"}}class="form-select">
                                       <option value="Secteur" > Secteur</option>
                                       <option value="Tous" > Tous</option>
                                    </select> 
                                </div>
                            </div></>}
                        </div>
                    </div> 
                </div>
                <div class="row">
                    <div class="col-6 mt-4">
                        <input class="form-check-input" type="checkbox" checked={checked} onChange={handleChange} id="flexCheckDefault"/>
                        <label style={{color:"#06868D"}} className="form-label" >Si vous pouvez ajouter un membre comme un chef de projet </label>
                    </div>

                </div>
                <div class="mt-4" style={{ textAlign:"right" }}>
                  
                    <button type="submit" class="btn"    disabled={(!description ||client.length === 0||!nom||(chef.length === 0&&membre.length === 0)||!dateDebut||!dateFin) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                       Ajouter
                    </button>
                </div>
            </form>
        </Modal.Body>
    </Modal>
    </div> </div> </div> </div>
</>}</>
       )
}

  

