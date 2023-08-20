/* eslint-disable no-unused-vars */
import React,{ useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";
import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import EtatProjet from './EtatProjet'
import Modal from 'react-bootstrap/Modal';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import "./EspaceProjetForm.css"
import 'pure-react-carousel/dist/react-carousel.es.css';
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
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import EtatProjetUser from './EtatProjetUser';
import EtatProjetNonAffec from './EtatProjetNonAffec';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Phase({id,titre,idP,projetRole,archive}) {
    const navigate = useNavigate ()
    let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]
    const [etats,setEtats]= useState([])
    const [type, setType] = useState("Tous") 
    const [typeResponsable, setTypeResponsable] = useState("Tous")  
    const [type1, setType1] = useState("Board")  
    const [nb,setNb]= useState("")
    const [nbTerminé,setNbTerminé]= useState("")
    const [nbTaskRéalisé,setNbTaskRéalisé]= useState("")
    const [typeSelect,setTypeSelect]= useState("")
    const [titreM,setTitreM]= useState(titre)
    const [showM, setShowM] = useState(false);
    const [errorM, setErrorM] = useState("");
    const handleShowM = () => {setShowM(true);}
    const handleCloseM = () => {setShowM(false);setErrorM("");setTitreM(titre)}
    const [showE, setShowE] = useState(false);
    const [errorE, setErrorE] = useState("");
    const [titreE,setTitreE]= useState("")
    const [showEU, setShowEU] = useState(false);
    const [showT, setShowT] = useState(false);
    const [errorEU, setErrorEU] = useState("");
    const [errorT, setErrorT] = useState("");
    const [titreEU,setTitreEU]= useState("")
    const [idE,setIdE]= useState("")
    const [testStatus,setTestStatus]= useState("")
    const [testTask,setTestTask]= useState("")
    const [test,setTest]= useState(false)
    const [titreT,setTitreT]= useState("")
    const [descriptionT,setDescriptionT]= useState("")
    const [prioritéT,setPrioritéT]= useState("")
    const [etatT,setEtatT]= useState("")
    const [userT,setUserT]= useState("")
    const [dateDebutT,setDateDébutT]= useState("")
    const [dateFinT,setDateFinT]= useState("")
    const handleShowEU = () => {setShowEU(true);}
    const handleCloseEU = () => {setShowEU(false);setErrorEU("")}
    const handleShowT = () => {setShowT(true); let months=(new Date().getMonth())+1
      let years=new Date().getFullYear()
      let day=new Date().getDate()
      if(months<10){months="0"+months}
      if(day<10){ day="0"+day}
      setDateDébutT(years+"-"+months+"-"+day)
      setDateFinT("")}
    const handleCloseT = () => {setShowT(false);setErrorT("")}
    const handleShowE = () => {setShowE(true);}
    const handleCloseE = () => {setShowE(false);setErrorE("")}
      //tous les etats par phase
      const getEtats = (async () => {
        await Axios.get(`http://localhost:8000/etat/${id}`
      )
        .then((response)=>{
        setEtats(response.data.etat) 
      setNb(response.data.nb)})  });
    useEffect( () => {getEtats ();},[]);
 //modifier une phase
 const onSubmitUpdateHandler = (e) => {
  e.preventDefault()
   const formData ={
        "titre" : titreM
     }
  Axios.post(`http://localhost:8000/updatePhase/${id}/${idP}`, formData,{
      headers: {
          "Content-Type": "multipart/form-data",
      }
  })
    .then((res) => { 
      if(role==="ROLE_ADMIN"){window.location=`./${idP}`} else{  window.location=`./${projetRole}`};
 
 })
 .catch((err) => setErrorM(err.response.data.danger))
}

//delete une phase
const onSubmitDeleteHandler = () => {
  if (window.confirm("Etes-vous sur de vouloir supprimer cette phase ? Attention cette action est irréversible, et tous les contenus de cette phase seront supprimés."))
  {Axios.post(`http://localhost:8000/deletePhase/${id}`) .then((res) => { 
  if(role==="ROLE_ADMIN"){window.location=`./${idP}`} else{  window.location=`./${projetRole}`}});}
  }
//ajout un etat
const onSubmitEtatHandler = (e) => {
  e.preventDefault()
   const formData ={
        "titre" : titreE
     }
  Axios.post(`http://localhost:8000/ajouterEtat/${id}`, formData,{
      headers: {
          "Content-Type": "multipart/form-data",
      }
  })
    .then((res) => { 
  if(role==="ROLE_ADMIN"){window.location=`./${idP}`} else{  window.location=`./${projetRole}`};}) 

 .catch((err) => setErrorE(err.response.data.danger))
}
//modal update etat
const UpdateEtat = (id,titre) => {
setTitreEU(titre)
setIdE(id)
handleShowEU()
  }
//modifier une etat
const onSubmitUpdateEtatHandler = (e) => {
  e.preventDefault()
   const formData ={
        "titre" : titreEU
     }
  Axios.post(`http://localhost:8000/updateEtat/${id}/${idE}`, formData,{
      headers: {
          "Content-Type": "multipart/form-data",
      }
  })
    .then((res) => { 
      Axios.get(`http://localhost:8000/etat/${id}`
      )
        .then((response)=>{
        setEtats(response.data.etat) 
        handleCloseEU()
        
      })
 
 })
 .catch((err) => setErrorEU(err.response.data.danger))
}

const onDragStart = evt => {
  let element = evt.currentTarget;
  element.classList.add("dragged");
  evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
  evt.dataTransfer.effectAllowed = "move";
};
const onDragEnd = evt => {
  evt.currentTarget.classList.remove("dragged");
};
const onDragEnter = evt => {
  evt.preventDefault();
  let element = evt.currentTarget;
  element.classList.add("dragged-over");
  evt.dataTransfer.dropEffect = "move";
};
const onDragLeave = evt => {
  let currentTarget = evt.currentTarget;
  let newTarget = evt.relatedTarget;
  if (newTarget.parentNode === currentTarget || newTarget === currentTarget)
    return;
  evt.preventDefault();
  let element = evt.currentTarget;
  element.classList.remove("dragged-over");
};
const onDragOver = evt => {
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "move";
};
const onDrop = (evt, value,status) => {
  evt.preventDefault();
  evt.currentTarget.classList.remove("dragged-over");
  let data = evt.dataTransfer.getData("text/plain");
 setTestStatus(status)
 setTestTask(data)
 
  Axios.post(`http://localhost:8000/updateTaskEtat/${data}/${status}`,{
      headers: {
          "Content-Type": "multipart/form-data",
      }
  })  .then((response)=>{
    if(response.data.task.valide===false){
      
      Axios.post(`http://localhost:8000/recommencerTask/${data}`,{
        headers: {
            "Content-Type": "multipart/form-data",}
    })}
   setTest(!test);})}

      //tous les users de ce projet
      const [users,setUsers]= useState([])
      const [nbu,setNbU]= useState("")
      const getUsers = (async () => {
        await Axios.get(`http://localhost:8000/usersProjet/${idP}`
      )
        .then((response)=>{
        setUsers(response.data.user)
      setNbU(response.data.nb)})  });
    useEffect( () => {getUsers ();},[]);
    const onSubmitHandler = (e) => {
      e.preventDefault()
       const formData ={
            "titre" : titreT,
            "description":descriptionT,
            "dateDebut":dateDebutT,
            "dateFin":dateFinT,
            "user":userT,
            "etat":etatT,
            "priorité":prioritéT,}
      Axios.post(`http://localhost:8000/ajouterTask`, formData,{
          headers: {
              "Content-Type": "multipart/form-data",
          }
      })
        .then((res) => { 
         setTest(!test);
         setPrioritéT("")
         setEtatT("")
         setTitreT("")
         setDescriptionT("")
         setUserT("")
         setDateDébutT("")
         setDateFinT("")
     handleCloseT();
    
     })
        .catch((err) => setErrorT(err.response.data.danger))
    }
    const [tasks,setTasks]= useState([])
    const [tasksUser,setTasksUser]= useState([])
    //tous les tasks par etat
 const getTasks = (async () => {
  if(typeResponsable==="Tous"){
  await Axios.get(`http://localhost:8000/taskPhase/${id}`
).then((response)=>{
  setTasks(response.data.task) 
})} 
else if(typeResponsable==="null"){
  await Axios.get(`http://localhost:8000/taskPhaseNonAffec/${id}`
).then((response)=>{
  setTasks(response.data.task) 
})
}
else{
  await Axios.get(`http://localhost:8000/taskPhaseUser/${id}/${typeResponsable}`
).then((response)=>{
  setTasks(response.data.task) 
})} 
 });
useEffect( () => {getTasks ();},[]);
//tous les tasks par etat et par user
const getTasksUser = (async () => {
  await Axios.get(`http://localhost:8000/taskUserPhase/${id}/${user.id}`
).then((response)=>{
  setTasksUser(response.data.task) 
})  });
useEffect( () => {getTasksUser ();},[]);

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
   tasks.map((item,index)=>{
       myEventsListA.push({
           id: item.id,
           title: item.titre+" ("+item.etat.titre+")",
           start: new Date(item.dateDebut),
           end: new Date(item.dateFin),
           allDay: false,
         })
})

let myEventsList = [] 
   tasksUser.map((item,index)=>{
       myEventsList.push({
           id:item.id,
           title: item.titre+" ("+item.etat.titre+")",
           start: new Date(item.dateDebut),
           end: new Date(item.dateFin),
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
          setDateDébutT(eventItem.start.getFullYear()+"-"+month+"-"+day)
          setDateFinT(eventItem.start.getFullYear()+"-"+month+"-"+day)
          setShowT(true)};
  const handleHref= (e) =>{
          if(role==="ROLE_ADMIN"){window.location=`/detailTâche/${idP}/${e}`} else{  window.location=`/detailTâche/${idP}/${e}/${projetRole}`};
        }
         //tous les tasks terminé par phase
         const [tasksTerminé,setTasksTerminé]= useState([])
 const getTasksTerminé = (async () => {
  await Axios.get(`http://localhost:8000/taskPhaseTermine/${id}`
).then((response)=>{
  setTasksTerminé(response.data.task) 
  setNbTerminé(response.data.nb) 
  setNbTaskRéalisé(response.data.nbTaskRéalisé) 
})  });
useEffect( () => {getTasksTerminé ();},[]);
let myEventsListTerminé = [] 
   tasksTerminé.map((item,index)=>{
    myEventsListTerminé.push({
           id:item.id,
           title: item.titre+" ("+item.etat.titre+")",
           start: new Date(item.dateDebut),
           end: new Date(item.dateFin),
           allDay: false,
         })})

         const data = {
          labels: ['Tâches réalisées', 'Tâches non réalisées'],
          datasets: [
            {
              label: 'Pourcentage %',
              data: [nbTaskRéalisé, 100-nbTaskRéalisé],
              backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
             ],
              borderWidth: 1,
            },
          ],    } 

          const [usersProjet,setUsersProjet]= useState([])

           //detailprojetUser
   const getDetailProjet = (async () => {
    await Axios.get(`http://localhost:8000/detailMembreProjet/${idP}`
  )
    .then((response)=>{
    setUsersProjet(response.data.projet) 
   })  });
useEffect( () => {getDetailProjet();},[]);
console.error = () => {}
  return (
    <>
     <div class="row mb-3 ">
      {type==="Tous"&&
       <div class="col-5">
        {(projetRole==="chefProjet"||projetRole==="membre")&&
        <>
            {type==="Tous"&&
              <>
                <button class="btn " title="Tous les tâches"  style={{backgroundColor:"#06868D",color:"white" ,padding:"8px" }}><i class="fa  fa-fw fa-users" style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Tous");setType1("Board")}} ></i></button> 
                <button class=" btn " title="Mes tâches" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px",marginRight:"40px"}}><i class="fa fa-fw fa-user" style={{fontSize:"14px"}}  onClick={ (e) =>  {setType("Mes");setType1("Board")}}  ></i></button> 
              </> }
               {type==="Mes"&&
              <>
                <button class="btn " title="Tous les tâches" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px" }}><i class="fa fa-fw fa-users"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Tous");setType1("Board")}} ></i></button> 
                <button class=" btn " title="Mes tâches" style={{color:"white",backgroundColor:"#06868D" ,padding:"8px",marginRight:"30px"}}><i class="fa fa-fw fa-user"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Mes");setType1("Board")}}  ></i></button> 
               </> }</>}
               {((projetRole==="membre")||(projetRole==="chefProjet")||(role==="ROLE_ADMIN")||(projetRole==="client"))&&
        <>
            {type1==="Board"&&
            <>
              <button class=" btn " title="Board" style={{color:"white",backgroundColor:"#06868D" ,padding:"8px"}}><i class="fa fa-fw fa-tasks"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType1("Board")}}  ></i></button> 
              <button class="btn " title="Calendrier" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px" }}><i class="fa fa-fw fa-calendar"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType1("Calendrier")}} ></i></button> 
             </> } 
            {type1==="Calendrier"&&
            <>
              <button class=" btn " title="Board" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px"}}><i class="fa fa-fw fa-tasks" style={{fontSize:"14px"}}  onClick={ (e) =>  {setType1("Board")}}  ></i></button> 
              <button class="btn " title="Calendrier"  style={{backgroundColor:"#06868D",color:"white" ,padding:"8px" }}><i class="fa fa-fw fa-calendar" style={{fontSize:"14px"}} onClick={ (e) =>  {setType1("Calendrier")}} ></i></button> 
             </> }
           
       
    </>} </div>}
    {type!=="Tous"&&
       <div class="col-7">
        {(projetRole==="chefProjet"||projetRole==="membre")&&
        <>
            {type==="Tous"&&
              <>
                <button class="btn " title="Tous les tâches"  style={{backgroundColor:"#06868D",color:"white" ,padding:"8px" }}><i class="fa  fa-fw fa-users" style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Tous");setType1("Board")}} ></i></button> 
                <button class=" btn " title="Mes tâches" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px",marginRight:"40px"}}><i class="fa fa-fw fa-user" style={{fontSize:"14px"}}  onClick={ (e) =>  {setType("Mes");setType1("Board")}}  ></i></button> 
              </> }
               {type==="Mes"&&
              <>
                <button class="btn " title="Tous les tâches" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px" }}><i class="fa fa-fw fa-users"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Tous");setType1("Board")}} ></i></button> 
                <button class=" btn " title="Mes tâches" style={{color:"white",backgroundColor:"#06868D" ,padding:"8px",marginRight:"30px"}}><i class="fa fa-fw fa-user"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType("Mes");setType1("Board")}}  ></i></button> 
               </> }</>}
               {((projetRole==="membre"&&type==="Mes")||(projetRole==="chefProjet")||(role==="ROLE_ADMIN")||(projetRole==="client"))&&
        <>
            {type1==="Board"&&
            <>
              <button class=" btn " title="Board" style={{color:"white",backgroundColor:"#06868D" ,padding:"8px"}}><i class="fa fa-fw fa-tasks"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType1("Board")}}  ></i></button> 
              <button class="btn " title="Calendrier" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px" }}><i class="fa fa-fw fa-calendar"  style={{fontSize:"14px"}} onClick={ (e) =>  {setType1("Calendrier")}} ></i></button> 
             </> } 
            {type1==="Calendrier"&&
            <>
              <button class=" btn " title="Board" style={{borderColor:"#06868D",color:"#06868D" ,padding:"8px"}}><i class="fa fa-fw fa-tasks" style={{fontSize:"14px"}}  onClick={ (e) =>  {setType1("Board")}}  ></i></button> 
              <button class="btn " title="Calendrier"  style={{backgroundColor:"#06868D",color:"white" ,padding:"8px" }}><i class="fa fa-fw fa-calendar" style={{fontSize:"14px"}} onClick={ (e) =>  {setType1("Calendrier")}} ></i></button> 
             </> }
           
       
    </>} </div>}
    {(projetRole==="chefProjet"&&type==="Tous")&&
    <div class="col-2">
    <select value={typeResponsable} style={{fontSize:"12px"}} onChange={ (e) => { setTypeResponsable(e.target.value);setTest(!test)}}  onClick={ (e) => { getDetailProjet();getTasks()}}   class="form-select ">
                                <option value="Tous" selected > Toutes les  tâches</option>
                          {usersProjet.map((item,index)=>      
                        <>
                                <option   key={item.user.id} value={item.user.id}>   {item.user.username} {item.user.lastname}</option>       
                        </>)}  
                        <option value="null"  > Non affectées</option>

                            </select> 
            </div>}
            {(projetRole!=="chefProjet"&&projetRole!=="client"&&type==="Tous")&&
             <>
 <div class="col-4"></div>
    <div class="col-3">
    <select value={typeResponsable} style={{fontSize:"12px"}} onChange={ (e) => { setTypeResponsable(e.target.value);setTest(!test)}}  onClick={ (e) => { getDetailProjet();getTasks()}}   class="form-select ">
                                <option value="Tous" selected > Toutes les  tâches</option>
                          {usersProjet.map((item,index)=>      
                        <>
                                <option   key={item.user.id} value={item.user.id}>   {item.user.username} {item.user.lastname}</option>       
                        </>)}  
                        <option value="null"  > Non affectées</option>

                            </select> 
            </div></>}
    {projetRole==="chefProjet"&&archive===false&&
      <>
         <div class="col-5">
              <div class="row ">
                <div class="col-4">
                  <button title="Gestion d'une phase" type="button" style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }} className="btn pt-2 pb-2  " onClick={handleShowM} >Gestion d'une phase</button>
                </div>
                <div class="col-4">
                  <button title="Ajouter un état" type="button" className="btn pt-2 pb-2"  onClick={handleShowE} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}  >
                    <i class="fa fa-plus" style={{fontSize:"13px"}}  ></i> Ajouter un état 
                  </button>
                </div>
                <div class="col-4">
                  <button title=" Ajouter une tâche" type="button" style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }} className="btn pt-2 pb-2  " onClick={handleShowT} ><i class="fa fa-plus" style={{fontSize:"13px"}}></i> Ajouter une tâche</button>
                </div>
              </div>
            </div>
        </>}
        </div>
       
    {type1==="Board"&&
    <>
        {(projetRole==="chefProjet"||(projetRole==="membre"&&type==="Mes"))&&archive===false&&
        <>
         <CarouselProvider   totalSlides={nb} visibleSlides={3} naturalSlideWidth={100} naturalSlideHeight={150} dragEnabled={false}  > 
     {nb>3&&etats.length!==0&&
        <center class="mb-1">
          <ButtonBack class=" border me-1 border-top-0 border-end-0  border-start-0 border-bottom-0" title="Back"><i class="fa fa-caret-left" style={{color:"#06868D",fontSize:"19px"}} ></i></ButtonBack>
          <ButtonNext class=" border border-top-0 border-end-0  border-start-0 border-bottom-0" title="Next"><i class="fa fa-caret-right" style={{color:"#06868D",fontSize:"19px"}}></i></ButtonNext>
        </center>}
        <div class="row  ">
          <div class="col-12">
            <Slider  >
              <ul class="nav "  id="sticky"   >
               {etats.map((item,index)=>
                <> 
                  <Slide index={index} style={{ "max-height": "220px","overflow": "auto"}} >
                    <li class="nav-item"   >
                    <div className={`${item.id} small-box`}
                          onDragLeave={(e) => onDragLeave(e)}
                          onDragEnter={(e) => onDragEnter(e)}
                           onDragEnd={(e) => onDragEnd(e)}
                           onDragOver={(e) => onDragOver(e)}
                           onDrop={(e) =>onDrop(e, false,item.id)}>
                      <div class="card card-rounded border border-2  me-1" style={{backgroundColor:"#f3f5f8"}}  >
                        <div class="card-body" >
                           <section className="drag_container" style={{" text-align": "justify"}} id="contenu">
                              <div className="">
                                <div className="drag_column">
                                  <div className="drag_row" >
                                    {(test===true&&typeResponsable==="Tous")&&
                                    <EtatProjet id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} type1={type1}/>
                                     }
                                      {(test===false&&typeResponsable==="Tous")&&
                                    <EtatProjet id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} type1={type1}/>
                                     }
                                       {(test===true&&typeResponsable!=="Tous"&&typeResponsable!=="null")&&
                                    <EtatProjetUser id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} typeResponsable={typeResponsable} type1={type1}/>
                                     }
                                      {(test===false&&typeResponsable!=="Tous"&&typeResponsable!=="null")&&
                                    <EtatProjetUser id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} typeResponsable={typeResponsable} type1={type1}/>
                                     }
                                    {(test===true&&typeResponsable==="null")&&
                                    <EtatProjetNonAffec id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} typeResponsable={typeResponsable} type1={type1}/>
                                     }
                                      {(test===false&&typeResponsable==="null")&&
                                    <EtatProjetNonAffec id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} typeResponsable={typeResponsable} type1={type1}/>
                                     }      
                                   </div>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      </div>
                    </li>
                  </Slide>  
                </>)}
                    <li class="nav-item">
                      <button className="btn">
                        <i class="fa fa-smile "  > </i> 
                      </button> 
                    </li>
              </ul>
            </Slider>
          </div>
          </div>
      </CarouselProvider>
          </>} 
          {(role==="ROLE_ADMIN"||(projetRole==="membre"&&type==="Tous")||(archive===true))&&
        <>
         <CarouselProvider  totalSlides={nb} visibleSlides={3} naturalSlideWidth={100} naturalSlideHeight={150}   > 
     {nb>3&&etats.length!==0&&
        <center class="mb-1">
          <ButtonBack class=" border me-1 border-top-0 border-end-0  border-start-0 border-bottom-0" title="Back"><i class="fa fa-caret-left" style={{color:"#06868D",fontSize:"19px"}} ></i></ButtonBack>
          <ButtonNext class=" border border-top-0 border-end-0  border-start-0 border-bottom-0" title="Next"><i class="fa fa-caret-right" style={{color:"#06868D",fontSize:"19px"}}></i></ButtonNext>
        </center>}
        <div class="row  ">
          <div class="col-12">
            <Slider >
              <ul class="nav "  >
               {etats.map((item,index)=>
                <>
                  <Slide index={index}style={{ "max-height": "220px","overflow": "auto"}}  >
                    <li class="nav-item">
                      <div class="card card-rounded border border-2  me-1" style={{backgroundColor:"#f3f5f8"}}>
                        <div class="card-body">
                       
                                     {(test===true&&typeResponsable==="Tous")&&
                                    <EtatProjet id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} type1={type1}/>
                                     }
                                      {(test===false&&typeResponsable==="Tous")&&
                                    <EtatProjet id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} type1={type1}/>
                                     }
                                       {(test===true&&typeResponsable!=="Tous"&&typeResponsable!=="null")&&
                                    <EtatProjetUser id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} typeResponsable={typeResponsable} type1={type1}/>
                                     }
                                      {(test===false&&typeResponsable!=="Tous"&&typeResponsable!=="null")&&
                                    <EtatProjetUser id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} typeResponsable={typeResponsable} type1={type1}/>
                                     }     
                                        {(test===true&&typeResponsable==="null")&&
                                    <EtatProjetNonAffec id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} typeResponsable={typeResponsable} type1={type1}/>
                                     }
                                      {(test===false&&typeResponsable==="null")&&
                                    <EtatProjetNonAffec id={item.id} titre={item.titre} idPh={id} idP={idP} projetRole={projetRole} archive={archive} UpdateEtat={UpdateEtat} testStatus={testStatus} testTask={testTask} type={type} typeResponsable={typeResponsable} type1={type1}/>
                                     }                                   
                                               </div>
                      </div>
                    </li>
                  </Slide>  
                </>)}
                    <li class="nav-item">
                      <button className="btn">
                        <i class="fa fa-smile "  > </i> 
                      </button> 
                    </li>
              </ul>
            </Slider>
          </div>
         
        </div>
      </CarouselProvider> </>}
      
      {(projetRole==="client")&&
        <>
        <div class="row">
          <div class="col-6 mt-3">
            <div class="" style={{height:'350px',width:'800px',marginLeft:"125px"}}>
              <Pie data={data} /> 
            </div>  
          </div> 
          <div class="col-6">
            <div class="card card-rounded border border-2" style={{backgroundColor:"#f3f5f8","max-height": "500px","overflow": "auto"}}   >
              <div class="card-body" >
                <div style={{fontWeight:"bold" ,fontSize:"14px"}} class="col-5 mb-2"> Terminé ({nbTerminé})</div>
                {tasksTerminé.map((item,index)=>
                <>
                  <div style={{backgroundColor:"white",fontSize:"14px"}} class="p-2 border border-3 rounded mt-2"> 
                    <Link to={ `/detailTâche/${idP}/${item.id}/${projetRole}`} style={{textDecoration:"none",color:"black"}}  >
                      <span style={{fontWeight:"bold"}}> {item.titre}</span>
                    </Link>
                    <p style={{fontSize:"12px" }} class="ms-1"><i class="mt-2 fa fa-calendar f-disabled m-r-xs"></i> Débute le {item.dateDebut} Termine le {item.dateFin}</p>
                    <div class="row ">
                      <div class="col-8">
                        <div class="dropdown mt-2 pe-2">
                          <div class="progress " style={{height: `17px`}}>
                            <div class="progress-bar" role="progressbar" style={{width: `${item.tauxAvancement}%`,fontSize:"9px"}} 
                               aria-valuenow={item.tauxAvancement} aria-valuemin="0" aria-valuemax="100">{item.tauxAvancement}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div title="Validée" className=' mt-2  border border-top-0 border-end-0  border-start-0 border-bottom-0'  style={{fontWeight:"bold",color:"#55b900",textAlign:"center",fontSize:"12px"}} >Validée </div>
                      </div>
                    </div>
                    <hr class="m-2"/>
                    <div class="row" >
                      <div class="col-6 ms-2" style={{fontSize:"12px"}}> 
                        <div class="dropdown">
                         {item.priorite==="Aucune"&&
                          <div class="pe-2" style={{backgroundColor:"rgb(184 188 194)",color:"white",borderRadius:"10px"}} >  
                              {item.priorite} priorité 
                          </div> }   
                         {item.priorite==="Basse"&&
                          <div  class="pe-2"  style={{backgroundColor:"rgb(78, 205, 151)",color:"white",borderRadius:"10px"}} >  
                          {item.priorite} priorité 
                          </div> }
                         {item.priorite==="Moyenne"&&
                          <div  class="pe-2"  style={{backgroundColor:"rgb(255, 198, 60)",color:"white",borderRadius:"10px"}} >  
                          {item.priorite} priorité   
                          </div> }  
                         {item.priorite==="Haute"&&
                          <div class="pe-2"  style={{backgroundColor:"rgb(225, 45, 66)",color:"white",borderRadius:"10px"}} >  
                          {item.priorite} priorité 
                          </div> } 
                        </div>
                      </div>
                      <div class="col-5" style={{fontSize:"12px" ,marginLeft:"25px"}}>
                        <div class="row" >
                          <div class="col-6" ></div>
                          <div class="col-6" >
                           {item.user&&item.user.user.photo&& <img class="rounded-circle" src={require(`../../../assets/uploads/${item.user.user.photo}`)} width="27px" height="27px" title={item.user.user.username+" "+item.user.user.lastname}/>}
                           {item.user&&!item.user.user.photo  &&  <img class="rounded-circle"  src={require('../../../assets/img/logos/user.png')} width="27px" height="27px" title={item.user.user.username+" "+item.user.user.lastname}/>} 
                          </div>
                        </div> 
                      </div>
                    </div>
                  </div>
                </>)}
              </div>
            </div>
          </div>
         </div>
         </>}
      </>}
      {type1==="Calendrier"&&
        <>
           {((projetRole==="chefProjet"&&type==="Tous")||role==="ROLE_ADMIN"||(projetRole==="membre"&&type==="Tous"))&&
          <>
          
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
                                           onSelectSlot={projetRole==="chefProjet"&&handleSelect}
                                           startAccessor="start"
                                           endAccessor="end"
                                           onSelectEvent={(event) => handleHref(event.id)}
                                           defaultView={Views.MONTH}
                                           defaultDate={new Date(year, month, days)}
                                           style={{ height: 450,fontSize:"14px" }}
                                           localizer={localizer}
                                           
                                        />
                                  
         </>}
          {((projetRole==="chefProjet"&&type==="Mes")||(projetRole==="membre"&&type==="Mes"))&&
          <>
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
                                           onSelectSlot={projetRole==="chefProjet"&&handleSelect}
                                           startAccessor="start"
                                           endAccessor="end"
                                           onSelectEvent={(event) => handleHref(event.id)}
                                           defaultView={Views.MONTH}
                                           defaultDate={new Date(year, month, days)}
                                           style={{ height: 450,fontSize:"14px" }}
                                           localizer={localizer}
                                           
                                        />
                                   
         </>}
         {(projetRole==="client")&&
          <>
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
                                           events={ myEventsListTerminé}
                                           startAccessor="start"
                                           endAccessor="end"
                                           onSelectEvent={(event) => handleHref(event.id)}
                                           defaultView={Views.MONTH}
                                           defaultDate={new Date(year, month, days)}
                                           style={{ height: 450,fontSize:"14px" }}
                                           localizer={localizer}
                                           
                                        />
                                   
         </>}
        </>
        }
      <Modal show={showM} >
        <Modal.Header  >
            <Modal.Title>Gestion d'une phase
                <button  onClick={handleCloseM} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"260px"}}>
                    <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {    errorM &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{errorM } </p>}
            <form  enctype="multipart/form-data" onSubmit={onSubmitUpdateHandler} >
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre <span style={{color:"red"}}>*</span></label>
                    <input className="form-control  form-icon-input" value={titreM} name="titre"  type="text" onChange={(e)=>setTitreM(e.target.value)} placeholder="saisir titre de phase" pattern=".{3,}" title="3 caractères ou plus" required="required"/>
                </div>
                <div class="mt-5" style={{ textAlign:"right" }}>
                <button type="button" class="btn me-2"    style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}  onClick={onSubmitDeleteHandler}>
                     Supprimer
                  </button>
                    <button type="submit" class="btn pe-3"    disabled={(!titreM) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Modifier
                  </button>
              </div>
            </form>
        </Modal.Body>
    </Modal>
    <Modal show={showE} >
        <Modal.Header  >
            <Modal.Title>Ajouter un état
                <button  onClick={handleCloseE} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"302px"}}>
                    <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {    errorE &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{errorE } </p>}
            <form  enctype="multipart/form-data" onSubmit={onSubmitEtatHandler} >
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre <span style={{color:"red"}}>*</span></label>
                    <input className="form-control  form-icon-input"  name="titre"  type="text" onChange={(e)=>setTitreE(e.target.value)} placeholder="saisir titre de l'état" pattern=".{3,}" title="3 caractères ou plus" required="required"/>
                </div>
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"    disabled={(!titreE) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Ajouter
                  </button>
              </div>
            </form>
        </Modal.Body>
    </Modal>
    <Modal show={showEU} >
        <Modal.Header  >
            <Modal.Title>Modifier un état
                <button  onClick={handleCloseEU} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"294px"}}>
                    <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {    errorEU &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{errorEU } </p>}
            <form  enctype="multipart/form-data" onSubmit={onSubmitUpdateEtatHandler} >
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre <span style={{color:"red"}}>*</span></label>
                    <input className="form-control  form-icon-input" value={titreEU} name="titre"  type="text" onChange={(e)=>setTitreEU(e.target.value)} placeholder="saisir titre d'un état" pattern=".{3,}" title="3 caractères ou plus" required="required"/>
                </div>
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"    disabled={(!titreEU) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Modifier
                  </button>
              </div>
            </form>
        </Modal.Body>
    </Modal>
    <Modal show={showT} >
        <Modal.Header  >
            <Modal.Title> Ajouter une tâche
                <button  onClick={handleCloseT} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"280px"}}>
                    <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {    errorT &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{errorT } </p>}
              <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} >
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre de la tâche <span style={{color:"red"}}>*</span></label>
                    <input className="form-control  form-icon-input"  name="titreTache"  type="text" onChange={(e)=>setTitreT(e.target.value)} placeholder="saisir titre de la tâche" pattern=".{3,}" title="3 caractères ou plus" required="required"/>
                </div>
                <div class="row">
                  <div class="col-6">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de début <span style={{color:"red"}}>*</span></label>
                      <input className="form-control  form-icon-input" name="dateDebut" type="date" value={dateDebutT}  onChange={(e)=>setDateDébutT(e.target.value)} required="required"/>
                    </div>
                  </div>
                  <div class="col-6">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de fin <span style={{color:"red"}}>*</span></label>
                      <input className="form-control  form-icon-input" name="dateFin" type="date"  onChange={(e)=>setDateFinT(e.target.value)}  required="required"/>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Etat <span style={{color:"red"}}>*</span></label>
                      <select value={etatT} onChange={ (e) =>  setEtatT(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                        <option value="" selected disabled> Choisir l'état</option>
                              {
                                   etats.map((item,index)=>(
                        <option   key={item.id} value={item.id}>{item.titre}</option>
                                    )) }
                      </select>                                    
                    </div>
                  </div>
                  <div class="col-6">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Priorité <span style={{color:"red"}}>*</span></label>
                      <select value={prioritéT} onChange={ (e) =>  setPrioritéT(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                        <option value="" selected disabled> Choisir priorité</option>
                        <option   value="Aucune">Aucune</option>
                        <option   value="Basse">Basse</option>
                        <option   value="Moyenne">Moyenne</option>
                        <option   value="Haute">Haute</option>
                      </select>                            
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Description d'une tâche <span style={{color:"red"}}>*</span></label>
                         <br></br><textarea className="" name="description"  rows="4" cols="70"  onChange={(e)=>setDescriptionT(e.target.value)} placeholder="saisir description d'une tâche " pattern=".{3,}" title="3 caractères ou plus"required="required"></textarea>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Responsable </label>
                      <select value={userT} onChange={ (e) =>  setUserT(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                        <option value="" selected disabled> Choisir le responsable</option>
                        {
                                  users.map((item,index)=>(
                        <option   key={item.id} value={item.id}>{item.user.username} {item.user.lastname}</option>
                                    )) }
                      </select>                                    
                    </div>
                  </div>
                </div>
               
                <div class="mt-1" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"    disabled={(!titreT||!descriptionT||!dateDebutT||!dateFinT||!etatT||!prioritéT) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Ajouter
                  </button>
              </div>
            </form>
        </Modal.Body>
    </Modal>
    
    </>
    
      );       

  };

  
