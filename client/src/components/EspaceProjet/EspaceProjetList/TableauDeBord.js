import React,{ useEffect, useState } from "react"
import { Link,useNavigate,useParams } from "react-router-dom"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import "./EspaceProjetList.css"
import { Pie ,Line,Bar} from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend  ,CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend,CategoryScale, LinearScale, PointElement, LineElement, Title,BarElement);
export default function TableauDeBord({projetRole,archive,id}) {
    let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]
    const [taskFaire,setTaskFaire]= useState([])
    const [tasksUser,setTasksUser]= useState([])
    const [tasksUserNull,setTasksUserNull]= useState([])
    const [tasksUserClient,setTasksUserClient]= useState([])
    const [tasksUserNullClient,setTasksUserNullClient]= useState([])
    const [taskCours,setTaskCours]= useState([])
    const [taskTerminéV,setTaskTerminéV]= useState([])
    const [taskTerminéNV,setTaskTerminéNV]= useState([])
    const [taskRetard,setTaskRetard]= useState()
    const [taskBloqué,setTaskBloqué]= useState([])
    const [taskTerminéAtt,setTaskTerminéAtt]= useState([])
    const [nbre,setNbre]= useState()
    const [taskFaireU,setTaskFaireU]= useState([])
    const [taskCoursU,setTaskCoursU]= useState([])
    const [taskTerminéVU,setTaskTerminéVU]= useState([])
    const [taskTerminéNVU,setTaskTerminéNVU]= useState([])
    const [taskTerminéAttU,setTaskTerminéAttU]= useState([])
    const [taskRetardU,setTaskRetardU]= useState()
    const [taskBloquéU,setTaskBloquéU]= useState([])
    const [nbreU,setNbreU]= useState()
    const [phases,setPhases]= useState([])
    const [membreProjet,setMembreProjet]= useState("")
    const [clientProjet,setClientProjet]= useState("")
    const [chefProjet,setChefProjet]= useState("")

    const [type,setType]= useState("Tous")

    const getTasksEtat = (async () => {
     if(type==="Tous"){
        await Axios.get(`http://localhost:8000/tasksEtat/${id}`)
        .then((response)=>{
            setTaskFaire(response.data.taskFaire[0].counter)
            setTaskCours(response.data.taskCours[0].counter)
            setTaskTerminéV(response.data.taskTerminéV[0].counter)
            setTaskTerminéNV(response.data.taskTerminéNV[0].counter)
            setTaskRetard(response.data.counter)
            setTaskBloqué(response.data.taskBloqué[0].counter)
            setTaskTerminéAtt(response.data.taskTerminéAtt[0].counter)
            setNbre(response.data.nbre)
                })}
       else{
                    await Axios.get(`http://localhost:8000/tasksEtatPhase/${id}/${type}`)
                    .then((response)=>{
                        setTaskFaire(response.data.taskFaire[0].counter)
                        setTaskCours(response.data.taskCours[0].counter)
                        setTaskTerminéV(response.data.taskTerminéV[0].counter)
                        setTaskTerminéNV(response.data.taskTerminéNV[0].counter)
                        setTaskRetard(response.data.counter)
                        setTaskBloqué(response.data.taskBloqué[0].counter)
                        setTaskTerminéAtt(response.data.taskTerminéAtt[0].counter)
                        setNbre(response.data.nbre)
                            })} 
            
            });
    useEffect( () => {getTasksEtat();},[]) ;
    
    const getTasksEtatUser = (async () => {
        if(type==="Tous"){
        await Axios.get(`http://localhost:8000/tasksEtatUser/${id}/${user.id}`)
        .then((response)=>{
            setTaskFaireU(response.data.taskFaire[0].counter)
            setTaskCoursU(response.data.taskCours[0].counter)
            setTaskTerminéVU(response.data.taskTerminéV[0].counter)
            setTaskTerminéNVU(response.data.taskTerminéNV[0].counter)
            setTaskRetardU(response.data.counter)
            setTaskBloquéU(response.data.taskBloqué[0].counter)
            setTaskTerminéAttU(response.data.taskTerminéAtt[0].counter)
            setNbreU(response.data.nbre)
                })}
                else{
                    await Axios.get(`http://localhost:8000/tasksEtatPhaseUser/${id}/${user.id}/${type}`)
                    .then((response)=>{
                        setTaskFaireU(response.data.taskFaire[0].counter)
                        setTaskCoursU(response.data.taskCours[0].counter)
                        setTaskTerminéVU(response.data.taskTerminéV[0].counter)
                        setTaskTerminéNVU(response.data.taskTerminéNV[0].counter)
                        setTaskRetardU(response.data.counter)
                        setTaskBloquéU(response.data.taskBloqué[0].counter)
                        setTaskTerminéAttU(response.data.taskTerminéAtt[0].counter)
                        setNbreU(response.data.nbre)
                            })}  });
    useEffect( () => {getTasksEtatUser();},[]) ;  

      //tous les phases de ce projet courant
  const getPhases = (async () => {
    await Axios.get(`http://localhost:8000/phase/${id}`
  )
    .then((response)=>{
     setPhases(response.data.phase) })  });

useEffect( () => {getPhases();},[]);
  
//tous les tasks terminé par phase pour client
   const [nbTaskRéalisé,setNbTaskRéalisé]= useState("")
   const [nbTerminé,setNbTerminé]= useState("")
   const getTasksTerminé = (async () => {
    if(type!=="Tous"){
    await Axios.get(`http://localhost:8000/taskPhaseTermine/${type}`
  ).then((response)=>{
    setNbTerminé(response.data.nb) 
    setNbTaskRéalisé(response.data.nbTaskRéalisé) 
  }) }
  if(type==="Tous"){
    await Axios.get(`http://localhost:8000/taskPhaseTermineTous/${id}`
  ).then((response)=>{
    setNbTerminé(response.data.nb) 
    setNbTaskRéalisé(response.data.nbTaskRéalisé) 
  }) }
});
  useEffect( () => {getTasksTerminé ();},[]);

  const [nbTaskRéaliséUser,setNbTaskRéaliséUser]= useState("")
  const [nbTerminéUser,setNbTerminéUser]= useState("")
  const getTasksTerminéUser = (async () => {
   if(type!=="Tous"){
   await Axios.get(`http://localhost:8000/taskTermineUserPhase/${type}/${user.id}`
 ).then((response)=>{
   setNbTerminéUser(response.data.nb) 
   setNbTaskRéaliséUser(response.data.nbTaskRéalisé) 
 }) }
 if(type==="Tous"){
   await Axios.get(`http://localhost:8000/taskTermineUser/${id}/${user.id}`
 ).then((response)=>{
   setNbTerminéUser(response.data.nb) 
   setNbTaskRéaliséUser(response.data.nbTaskRéalisé) 
 }) }
});
 useEffect( () => {getTasksTerminéUser ();},[]);
  const options = {
    plugins: {
      legend: {
        position: 'left',
      labels: {
          usePointStyle: true,
          pointStyle: 'circle',}}},}
  const data = {
    labels: ['À faire', 'En cours','Validée', 'Refusé','Bloquée','En retard','Attendre la validation'],
    datasets: [
      {label: 'nombre de tâches ',
        data: [taskFaire, taskCours,taskTerminéV,taskTerminéNV,taskBloqué,taskRetard,taskTerminéAtt],
        backgroundColor: [ '#cccccc', 'rgba(3,169,244,0.9)','rgba(85,185,0,0.9)','rgba(255, 99, 132, 0.2)','rgba(221,0,67,3)','rgb(215, 47, 47)',
          'orange'],
        borderWidth: 1,},],} 
  const dataClient = {
    labels: ['Tâches réalisées', 'Tâches non réalisées'],
    datasets: [
        {label: 'Pourcentage %',
        data: [nbTaskRéalisé, 100-nbTaskRéalisé],
        backgroundColor: ['rgba(85,185,0,0.9)','rgba(221,0,67,3)',],
        borderWidth: 1,},],    } 
        const dataMembre = {
            labels: ['Tâches réalisées', 'Tâches non réalisées'],
            datasets: [
                {label: 'Pourcentage %',
                data: [nbTaskRéaliséUser, 100-nbTaskRéaliséUser],
                backgroundColor: ['rgba(85,185,0,0.9)','rgba(221,0,67,3)',],
                borderWidth: 1,},],    } 

  const dataUser = {
    labels: ['À faire', 'En cours','Validée', 'Refusé','Bloquée','En retard','Attendre la validation'],
    datasets: [
        {label: 'nombre de tâches ',
         data: [taskFaireU, taskCoursU,taskTerminéVU,taskTerminéNVU,taskBloquéU,taskRetardU,taskTerminéAttU],
        backgroundColor: ['#cccccc','rgba(3,169,244,0.9)','rgba(85,185,0,0.9)','rgba(255, 99, 132, 0.2)','rgba(221,0,67,3)',
                          'rgb(215, 47, 47)','orange'],
        borderWidth: 1,},],    } 
          //tous les tasks  par user
   const getUserProjetTasks = (async () => {
    if(type==="Tous"){
    await Axios.get(`http://localhost:8000/userProjetTasks/${id}`
  )
    .then((response)=>{
     setTasksUser(response.data.tasksUser) 
     setTasksUserNull(response.data.tasksUserNull[0]) })} 
     else{
        await Axios.get(`http://localhost:8000/userProjetPhaseTasks/${id}/${type}`
      )
        .then((response)=>{
         setTasksUser(response.data.tasksUser) 
         setTasksUserNull(response.data.tasksUserNull[0]) })} 
     });
useEffect( () => {getUserProjetTasks();},[]);

let dataUserTask=[]
let dataNom=[]
let dataCounter=[]
tasksUser.map((item,index)=>(dataNom.push(item.username+" "+item.lastname,)    ))  
if(tasksUserNull.counter!==0){
    dataNom.push('Non affecté')}
  
tasksUser.map((item,index)=>(dataCounter.push( item.counter,)    ))   
if(tasksUserNull.counter!==0){ dataCounter.push(tasksUserNull.counter) }      
   dataUserTask= {
    labels: dataNom,
    datasets: [
        {label: 'nombre de tâches ',
        data: dataCounter,
        backgroundColor: ['#06868D',],
        borderWidth: 1,},],    } 


    //tous les tasks réalisées  par user
    const getTasksTermineClient = (async () => {
        if(type==="Tous"){
        await Axios.get(`http://localhost:8000/taskTermineClient/${id}`
      )
        .then((response)=>{
         setTasksUserClient(response.data.tasksUser) 
         setTasksUserNullClient(response.data.tasksUserNull[0])
        })} 
         else{
            await Axios.get(`http://localhost:8000/taskTermineClientPhase/${id}/${type}`
          )
            .then((response)=>{
             setTasksUserClient(response.data.tasksUser)
             setTasksUserNullClient(response.data.tasksUserNull[0])
 
             })} 
         });
    useEffect( () => {getTasksTermineClient();},[]);
    let dataUserTaskClient=[]
    let dataNomClient=[]
    let dataCounterClient=[]
    tasksUserClient.map((item,index)=>(dataNomClient.push(item.username+" "+item.lastname,)    ))  
    if(tasksUserNullClient.counter!==0){
        dataNomClient.push('Non affecté')}
   tasksUserClient.map((item,index)=>(dataCounterClient.push( item.counter,)    ))   
   if(tasksUserNullClient.counter!==0){ dataCounterClient.push(tasksUserNullClient.counter) }      
     dataUserTaskClient= {
        labels: dataNomClient,
        datasets: [
            {label: 'nombre de tâches réalisées ',
            data: dataCounterClient,
            backgroundColor: ['#06868D',],
            borderWidth: 1,},],    } 
   //tous les users de ce projet courant
   const getUsersProjet = (async () => {
    await Axios.get(`http://localhost:8000/userProjet/${id}`
  )
    .then((response)=>{
     setMembreProjet(response.data.userMembre)
     setClientProjet(response.data.userClient)
     setChefProjet(response.data.userChef) 
    })  });
useEffect( () => {getUsersProjet();},[]);
  
return (
<>
    <nav class="sidebar-offcanvas" style={{color:'white',backgroundColor:"#06868D" ,textAlign:"center" }}>
        <div class="row">
           <div class="col-3">
           </div>
           <div class="col-6" style={{marginLeft:"20px" }}>
               <ul class="nav " >
                    <li class="nav-item">
                        <Link class="nav-link test" to={ `/tableauDeBord/${id}`}   style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }}>
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
                       {(role==="ROLE_ADMIN"&&archive===false)&&
                       
                         <Link class="nav-link test"  to={ `/parametreProjet/${id}`}  style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                             <i class="fa fa-fw fa-cog "></i>
                              <span> Paramètres</span>
                        </Link>}
                          {
                           (projetRole==="chefProjet"&&archive===false)&&
                        <Link class="nav-link test"  to={ `/parametreProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                           <i class="fa fa-fw fa-cog "></i>
                           <span> Paramètres</span>
                        </Link>}
                         
                          {(projetRole==="client"||projetRole==="membre")&&
                        <Link class="nav-link test"   to={ `/detailProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                           <i class="fa fa-fw fa-cog "></i>
                           <span> Détails</span>
                        </Link>}
                        {(role==="ROLE_ADMIN"&&archive===true)&&
                        <Link class="nav-link test"   to={ `/detailProjet/${id}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }} >
                           <i class="fa fa-fw fa-cog "></i>
                           <span> Détails</span>
                        </Link>}
                        {(projetRole==="chefProjet"&&archive===true)&&
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
    <div class="content-wrapper">
        <div class="mt-3 " style={{ }}>  
           <div class="card card-rounded " style={{borderRadius:"8px"}} >
                <div class="card-body">
                   <div class="row"> 
                       <div class="col-10"> </div> 
                       <div class="col-2 "> 
                            <select value={type} style={{fontSize:"12px"}} onChange={ (e) => { setType(e.target.value)}}  onClick={ (e) => { getTasksEtat();getTasksTerminéUser();getTasksEtatUser();getTasksTerminé();getUserProjetTasks();getTasksTermineClient()}}   class="form-select ">
                                <option value="Tous" selected > Toutes les phases</option>
                          {phases.map((item,index)=>      
                        <>
                                <option   key={item.id} value={item.id}>   {item.titre}</option>       
                        </>)}  
                            </select> 
                        </div>                   
                    </div> 
                    {(projetRole==="chefProjet")&&
                    <>
                    <div class="row mt-3" style={{fontSize:"14px"}}>  
                        <div class="col-4" style={{fontWeight:'bold'}}> Toutes les tâches par état ({nbre})</div> 
                        <div class="col-4" style={{fontWeight:'bold'}}> Mes tâches par état ({nbreU})</div> 
                        <div class="col-4 " style={{fontWeight:'bold'}}>  Les tâches réalisées(Terminées et validées) ({nbTerminé})</div> 

                    </div> 
                    <div class="row" >
                        <div class="col-4">
                            <div class="" style={{height:'310px',width:'600px'}}>
                                <Pie data={data} options={options}  /> 
                            </div>  
                        </div> 
                        <div class="col-4 ">
                            <div class="" style={{height:'310px',width:'600px'}}>
                                <Pie data={dataUser} options={options}/> 
                            </div>  
                        </div> 
                    
                        <div class="col-4 ">
                            <div class="" style={{height:'310px',width:'600px'}}>
                                <Pie data={dataClient} options={options} /> 
                            </div>  
                        </div> 
                    </div> 
                    <div class="row" style={{fontSize:"14px"}}>  
                        <div class="col-6 mt-3" style={{fontWeight:'bold'}}> Toutes les tâches par utilisateur </div> 
                    </div> 
                    <div class="row" >
                        <div class="col-12">
                            <div class="" style={{height:'300px',width:'1100px'}}>
                                <Bar data={dataUserTask}  options={{scales: {x: {suggestedMin: 0,suggestedMax:20, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'y',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                 /> 
                            </div>  
                        </div> 
                    </div> 
                    <div class="row" style={{fontSize:"14px"}}>  
                        <div class="col-6 mt-3" style={{fontWeight:'bold'}}> Toutes les tâches réalisées par utilisateur </div> 
                    </div>
                    <div class="row" >
                        <div class="col-12">
                            <div class="" style={{height:'300px',width:'1100px'}}>
                                <Bar data={dataUserTaskClient}  options={{ scales: {x: {suggestedMin: 0,suggestedMax:20, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'y',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                 /> 
                            </div>  
                        </div> 
                    </div> 
                    <div class="row mt-5">
                       <div class="col-12">
                           <div class="mb-4" style={{fontSize:"14px",fontWeight:"bold"}}> Les utilisateurs de ce projet ({membreProjet+chefProjet+clientProjet})   </div>
                            <div class="row">
                                <div class="col-2"> </div>
                                <div class="col-10"> 
                                    <div class="statistics-details d-flex  align-items-center " >
                                        <div class="me-5 card card-rounded rounded-6 pt-2 pb-2 pe-4" style={{borderStyle: "solid",borderColor:"#06868D"}} >
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Chef de projet</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{chefProjet}</h3>
                                        </div>
                                        <div class="me-5 card card-rounded rounded-4 pt-2 pb-2 pe-6" style={{borderStyle: "solid",borderColor:"#06868D"}}>
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Membres</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{membreProjet}</h3>
                                        </div>
                                        <div class="me-5 card card-rounded rounded-4 pt-2 pb-2 pe-7" style={{borderStyle: "solid",borderColor:"#06868D"}}>
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Client</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{clientProjet}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> </> }
                    {(projetRole==="membre")&&
                    <>
                    <div class="row mt-3" style={{fontSize:"14px"}}>  
                        <div class="col-6" style={{fontWeight:'bold'}}> Mes tâches par état ({nbreU})</div> 
                        <div class="col-6 " style={{fontWeight:'bold'}}>  Mes tâches réalisées(Terminées et validées) ({nbTerminéUser})</div> 

                    </div> 
                    <div class="row" >
                        <div class="col-6">
                            <div class="" style={{height:'310px',width:'600px'}}>
                                <Pie data={dataUser} options={options}/> 
                            </div>  
                        </div> 
                    
                        <div class="col-6 ">
                            <div class="" style={{height:'310px',width:'600px'}}>
                                <Pie data={dataMembre} options={options} /> 
                            </div>  
                        </div> 
                    </div> 
                  
                    <div class="row mt-5">
                       <div class="col-12">
                           <div class="mb-4" style={{fontSize:"14px",fontWeight:"bold"}}> Les utilisateurs de ce projet ({membreProjet+chefProjet+clientProjet})   </div>
                            <div class="row">
                                <div class="col-2"> </div>
                                <div class="col-10"> 
                                    <div class="statistics-details d-flex  align-items-center " >
                                        <div class="me-5 card card-rounded rounded-6 pt-2 pb-2 pe-4" style={{borderStyle: "solid",borderColor:"#06868D"}} >
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Chef de projet</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{chefProjet}</h3>
                                        </div>
                                        <div class="me-5 card card-rounded rounded-4 pt-2 pb-2 pe-6" style={{borderStyle: "solid",borderColor:"#06868D"}}>
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Membres</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{membreProjet}</h3>
                                        </div>
                                        <div class="me-5 card card-rounded rounded-4 pt-2 pb-2 pe-7" style={{borderStyle: "solid",borderColor:"#06868D"}}>
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Client</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{clientProjet}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> </> }
                   {role==="ROLE_ADMIN"&&
                    <>
                    <div class="row" style={{fontSize:"14px"}}>  
                        <div class="col-6 mt-3" style={{fontWeight:'bold'}}> Toutes les tâches par état ({nbre})</div> 
                        <div class="col-6 mt-3" style={{fontWeight:'bold'}}>  Les tâches réalisées(Terminées et validées) ({nbTerminé})</div> 
                    </div> 
                    <div class="row">
                        <div class="col-6 mt-3">
                            <div class="" style={{height:'330px',width:'600px'}}>
                                <Pie data={data} options={options} /> 
                            </div>  
                        </div> 
                        <div class="col-6 mt-3">
                           <div class="" style={{height:'330px',width:'600px'}}>
                                <Pie data={dataClient} options={options} /> 
                            </div>  
                        </div> 
                   </div> 
                   <div class="row" style={{fontSize:"14px"}}>  
                        <div class="col-6 mt-3" style={{fontWeight:'bold'}}> Toutes les tâches par utilisateur </div> 
                    </div>
                   <div class="row" >
                        <div class="col-12">
                            <div class="" style={{height:'300px',width:'1100px'}}>
                                <Bar data={dataUserTask}  options={{scales: {x: {suggestedMin: 0,suggestedMax:20, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'y',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                 /> 
                            </div>  
                        </div> 
                    </div> 
                    <div class="row" style={{fontSize:"14px"}}>  
                        <div class="col-6 mt-3" style={{fontWeight:'bold'}}> Toutes les tâches réalisées par utilisateur </div> 
                    </div>
                    <div class="row" >
                        <div class="col-12">
                            <div class="" style={{height:'300px',width:'1100px'}}>
                                <Bar data={dataUserTaskClient}  options={{scales: {x: {suggestedMin: 0,suggestedMax:20, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'y',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                 /> 
                            </div>  
                        </div> 
                    </div> 
                    <div class="row mt-5">
                       <div class="col-12">
                           <div class="mb-4" style={{fontSize:"14px",fontWeight:"bold"}}> Les utilisateurs de ce projet ({membreProjet+chefProjet+clientProjet})   </div>
                            <div class="row">
                                <div class="col-2"> </div>
                                <div class="col-10"> 
                                    <div class="statistics-details d-flex  align-items-center " >
                                        <div class="me-5 card card-rounded rounded-6 pt-2 pb-2 pe-4" style={{borderStyle: "solid",borderColor:"#06868D"}} >
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Chef de projet</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{chefProjet}</h3>
                                        </div>
                                        <div class="me-5 card card-rounded rounded-4 pt-2 pb-2 pe-6" style={{borderStyle: "solid",borderColor:"#06868D"}}>
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Membres</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{membreProjet}</h3>
                                        </div>
                                        <div class="me-5 card card-rounded rounded-4 pt-2 pb-2 pe-7" style={{borderStyle: "solid",borderColor:"#06868D"}}>
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Client</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{clientProjet}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                   </> }
                   {projetRole==="client"&&
                    <>
                    <div class="row" style={{fontSize:"14px"}}>  
                        <div class="col-6 mt-3" style={{fontWeight:'bold'}}> Les tâches réalisées(Terminées et validées) ({nbTerminé})</div> 
                        <div class="col-6 mt-3" style={{fontWeight:'bold'}}>Les utilisateurs de ce projet ({membreProjet+chefProjet+clientProjet})</div> 

                    </div> 
                    <div class="row">
                        <div class="col-6 mt-3">
                            <div class="" style={{height:'330px',width:'600px'}}>
                                <Pie data={dataClient} options={options} /> 
                            </div>  
                        </div> 
                  
                       <div class="col-6 "  style={{marginTop:"100px"}}>
                            <div class="row">
                                <div class="col-1"> </div>
                                <div class="col-11"> 
                                    <div class="statistics-details d-flex  align-items-center " >
                                        <div class="me-1 card card-rounded rounded-6 pt-2 pb-2 pe-4" style={{borderStyle: "solid",borderColor:"#06868D"}} >
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Chef de projet</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{chefProjet}</h3>
                                        </div>
                                        <div class="me-1 card card-rounded rounded-4 pt-2 pb-2 pe-6" style={{borderStyle: "solid",borderColor:"#06868D"}}>
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Membres</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{membreProjet}</h3>
                                        </div>
                                        <div class="me-1 card card-rounded rounded-4 pt-2 pb-2 pe-7" style={{borderStyle: "solid",borderColor:"#06868D"}}>
                                            <p class="statistics-title" style={{color:"#06868D",fontWeight:"bold",fontSize:"13px"}}>Client</p>
                                            <h3 class="rate-percentage" style={{textAlign: "center"}}>{clientProjet}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row" style={{fontSize:"14px"}}>  
                        <div class="col-6 mt-3" style={{fontWeight:'bold'}}> Toutes les tâches réalisées par utilisateur </div> 
                    </div>
                    <div class="row" >
                        <div class="col-12">
                            <div class="" style={{height:'300px',width:'1100px'}}>
                                <Bar data={dataUserTaskClient}  options={{scales: {x: {suggestedMin: 0,suggestedMax:20, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'y',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                 /> 
                            </div>  
                        </div> 
                    </div> 
                    </> }
                  
                </div> 
            </div>   
        </div>  
    </div>
</>
       )
}

  

