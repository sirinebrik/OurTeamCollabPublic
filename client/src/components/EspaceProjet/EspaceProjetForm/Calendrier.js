import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
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
export default function Calendrier({idP,projetRole}) {
   
    const [tasks,setTasks]= useState([])
    const [type2,setType2]= useState("Tous")
    const [typeResponsable,setTypeResponsable]= useState("Tous")

    let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]

       
const getTasks = (async () => {
    if(type2==="Tous"&&projetRole!=="client"&&projetRole!=="membre"&&typeResponsable==="Tous"){
    await Axios.get(`http://localhost:8000/tasksTousProjet/${idP}`
  ).then((response)=>{
    setTasks(response.data.task) 
 
  })} 
 if(typeResponsable!=="Tous"&&type2==="Tous"&&typeResponsable!=="null"){
    await Axios.get(`http://localhost:8000/tasksUserProjet/${idP}/${typeResponsable}`
      ).then((response)=>{
        setTasks(response.data.task) 
     
      }) }
      if(type2==="Mes"||(type2==="Tous"&&projetRole==="membre")){
        await Axios.get(`http://localhost:8000/tasksUserProjet/${idP}/${user.id}`
          ).then((response)=>{
            setTasks(response.data.task) 
         
          }) }
      if(type2==="Tous"&&projetRole==="client"){
        await Axios.get(`http://localhost:8000/tasksTousRéaliséProjet/${idP}`
          ).then((response)=>{
            setTasks(response.data.task) 
         
          }) }
         
          if(typeResponsable==="null"){
            await Axios.get(`http://localhost:8000/tasksNonAffectéProjet/${idP}`
              ).then((response)=>{
                setTasks(response.data.task) 
             
              }) }
});
  useEffect( () => {getTasks ();},[]);
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
const [usersProjet,setUsersProjet]= useState([])

//detailprojetUser
const getDetailProjet = (async () => {
await Axios.get(`http://localhost:8000/detailMembreProjet/${idP}`
)
.then((response)=>{
setUsersProjet(response.data.projet) 
})  });
useEffect( () => {getDetailProjet();},[]);
const handleHref= (e) =>{
  if(role==="ROLE_ADMIN"){window.location=`/detailTâche/${idP}/${e}`} else{  window.location=`/detailTâche/${idP}/${e}/${projetRole}`};
}
return (
<>
{(projetRole==="chefProjet")&&
        <>
            <div class="row  mb-3 ">
                <div class="col-7"></div>
                <div class="col-5">
                            <div class="row ">
                                <div class="col-6">     
                                {type2==="Tous"&&projetRole!=="client"&&
                                <select value={typeResponsable} style={{fontSize:"12px"}} onChange={ (e) => { setTypeResponsable(e.target.value)}}  onClick={ (e) => { getTasks();}}   class="form-select ">
                                <option value="Tous" selected > Tous les responsables</option>
                          {usersProjet.map((item,index)=>      
                        <>
                                <option   key={item.user.id} value={item.user.id}>   {item.user.username} {item.user.lastname}</option>       
                        </>)}  
                        <option value="null"  > Non affectées</option>

                            </select> }
                    </div>
                     <div class="col-6">
                     <select value={type2} style={{fontSize:"12px"}} onChange={ (e) => { setType2(e.target.value);setTypeResponsable("Tous")}}  onClick={ (e) => { getTasks();}}   class="form-select ">
                                <option value="Tous" selected > Toutes les  tâches</option>
                         
                                <option   value="Mes">  Mes tâches</option>  </select>      
           
                                </div>
                            </div>
                        </div>
                    </div>
           </>}
           {(role==="ROLE_ADMIN")&&
        <>
            <div class="row  mb-3 ">
                <div class="col-7"></div>
                <div class="col-5">
                            <div class="row ">
                            <div class="col-4"></div>
                                <div class="col-8">     
                                {type2==="Tous"&&projetRole!=="client"&&
                                <select value={typeResponsable} style={{fontSize:"12px"}} onChange={ (e) => { setTypeResponsable(e.target.value)}}  onClick={ (e) => { getDetailProjet();getTasks()}}   class="form-select ">
                                <option value="Tous" selected > Toutes les  tâches</option>
                          {usersProjet.map((item,index)=>      
                        <>
                                <option   key={item.user.id} value={item.user.id}>   {item.user.username} {item.user.lastname}</option>       
                        </>)}  
                        <option value="null"  > Non affectées</option>

                            </select> }
                    </div>
                 
                            </div>
                        </div>
                    </div>
           </>}

           
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
                                           
                                        /> 
                  

</>
       )
}

  

