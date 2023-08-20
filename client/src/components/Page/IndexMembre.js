
import React,{ useEffect, useState } from 'react'
import $ from 'jquery'; 
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import logo from "../../assets/img/logos/logo.png"
import { me } from "../../service/user"
import { Link,useNavigate,useParams } from "react-router-dom"
import jwt_decode from "jwt-decode";
import Axios from 'axios'
import { Pie ,Line,Bar} from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend  ,CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend,CategoryScale, LinearScale, PointElement, LineElement, Title,BarElement);
export default function IndexMembre({type}) {

  const [nbTousProjetUM,setNbTousProjetUM]= useState()
  const [nbProjetNUM,setNbProjetNUM]= useState()
  const [nbProjetArchUM,setNbProjetArchUM]= useState()
  const [nbTousProjetUCH,setNbTousProjetUCH]= useState()
  const [nbProjetNUCH,setNbProjetNUCH]= useState()
  const [nbProjetArchUCH,setNbProjetArchUCH]= useState()
  const [projetMesTaskM,setProjetMesTaskM]= useState([])
  const [nbMesTaskM,setNbMesTaskM]= useState([])
  const [projetMesTaskRealiseM,setProjetMesTaskRealiseM]= useState([])
  const [nbMesTaskRealiseM,setNbMesTaskRealiseM]= useState([])
  const [projetMesTaskCH,setProjetMesTaskCH]= useState([])
  const [nbMesTaskCH,setNbMesTaskCH]= useState([])
  const [projetMesTaskRealiseCH,setProjetMesTaskRealiseCH]= useState([])
  const [nbMesTaskRealiseCH,setNbMesTaskRealiseCH]= useState([])
  const [nbUser,setNbUser]= useState([])
  const [projet,setProjet]= useState([])
  const [projetTask,setProjetTask]= useState([])
  const [nbTask,setNbTask]= useState([])

  let user1 = jwt_decode(localStorage.getItem("token"));
  let role1=user1.roles[0]
  const options = {
    plugins: {
      legend: {
        position: 'left',
      labels: {
          usePointStyle: true,
          pointStyle: 'circle',}}},}
   
//user
const getProjetUserM = (async () => {
  await Axios.get(`http://localhost:8000/dasboardProjetUM/${user1.id}`
  )
  .then((response)=>{
  setNbTousProjetUM(response.data.n)
  setNbProjetArchUM(response.data.nbAr)
  setNbProjetNUM(response.data.nb)  })})
  useEffect( () => {getProjetUserM();},[]);
const dataProjetUserM = {
labels: ['Projets non archivés', 'Projets archivés'],
datasets: [
    {label: 'nombre de projets',
    data: [nbProjetNUM, nbProjetArchUM],
    backgroundColor: ['#06868D','rgba(221,0,67,3)',],
    borderWidth: 1,},],    } 

const getProjetUserCH = (async () => {
        await Axios.get(`http://localhost:8000/dasboardProjetUCH/${user1.id}`
        )
        .then((response)=>{
        setNbTousProjetUCH(response.data.n)
        setNbProjetArchUCH(response.data.nbAr)
        setNbProjetNUCH(response.data.nb)  })})
        useEffect( () => {getProjetUserCH();},[]);
const dataProjetUserCH = {
      labels: ['Projets non archivés', 'Projets archivés'],
      datasets: [
          {label: 'nombre de projets',
          data: [nbProjetNUCH, nbProjetArchUCH],
          backgroundColor: ['#06868D','rgba(221,0,67,3)',],
          borderWidth: 1,},],    } 

    const getMesTaskUserM = (async () => {
        await Axios.get(`http://localhost:8000/membreProjetsMesTasks/${user1.id}`
        )
        .then((response)=>{
        setNbMesTaskM(response.data.task)
        setProjetMesTaskM(response.data.projet)

         })})
        useEffect( () => {getMesTaskUserM();},[]);

const dataMesTaskUserM = {
      labels: projetMesTaskM,
      datasets: [
          {label: "nombre de tâches",
          data: nbMesTaskM,
          backgroundColor: ['#06868D'],
          borderWidth: 1,},],    }  

          const getMesTaskRealiseUserM = (async () => {
            await Axios.get(`http://localhost:8000/membreProjetsMesTasksRealise/${user1.id}`
            )
            .then((response)=>{
            setNbMesTaskRealiseM(response.data.task)
            setProjetMesTaskRealiseM(response.data.projet)
    
             })})
            useEffect( () => {getMesTaskRealiseUserM();},[]);
const dataMesTaskRealiseUserM = {
          labels: projetMesTaskRealiseM,
          datasets: [
              {label: "pourcentage des tâches réalisées %",
              data: nbMesTaskRealiseM,
              backgroundColor: ['#06868D'],
              borderWidth: 1,},],    }  


              const getMesTaskUserCH = (async () => {
                await Axios.get(`http://localhost:8000/membreChProjetsMesTasks/${user1.id}`
                )
                .then((response)=>{
                setNbMesTaskCH(response.data.task)
                setProjetMesTaskCH(response.data.projet)
        
                 })})
                useEffect( () => {getMesTaskUserCH();},[]);
        
        const dataMesTaskUserCH = {
              labels: projetMesTaskCH,
              datasets: [
                  {label: "nombre de tâches",
                  data: nbMesTaskCH,
                  backgroundColor: ['#06868D'],
                  borderWidth: 1,},],    }  
        
const getMesTaskRealiseUserCH = (async () => {
                    await Axios.get(`http://localhost:8000/membreChProjetsMesTasksRealise/${user1.id}`
                    )
                    .then((response)=>{
                    setNbMesTaskRealiseCH(response.data.task)
                    setProjetMesTaskRealiseCH(response.data.projet)
            
                     })})
                    useEffect( () => {getMesTaskRealiseUserCH();},[]);
const dataMesTaskRealiseUserCH = {
                  labels: projetMesTaskRealiseCH,
                  datasets: [
                      {label: "pourcentage des tâches réalisées %",
                      data: nbMesTaskRealiseCH,
                      backgroundColor: ['#06868D'],
                      borderWidth: 1,},],    } 
                      
const getNbUser = (async () => {
                              await Axios.get(`http://localhost:8000/chefProjetsM/${user1.id}`
                              )
                              .then((response)=>{
                              setNbUser(response.data.user)
                              setProjet(response.data.projet)
                      
                               })})
                              useEffect( () => {getNbUser();},[]);
const dataNbUser = {
                            labels: projet,
                            datasets: [
                                {label: "nombre d'utilisateurs",
                                data: nbUser,
                                backgroundColor: ['#06868D'],
                                borderWidth: 1,},],    } 
                      
const getTaskUser = (async () => {
                                  await Axios.get(`http://localhost:8000/chefProjetsTasksM/${user1.id}`
                                  )
                                  .then((response)=>{
                                  setNbTask(response.data.task)
                                  setProjetTask(response.data.projet)
                          
                                   })})
                                  useEffect( () => {getTaskUser();},[]);
 const dataTaskUser = {
                                labels: projetTask,
                                datasets: [
                                    {label: "pourcentage des tâches réalisées %",
                                    data: nbTask,
                                    backgroundColor: ['#06868D'],
                                    borderWidth: 1,},],    } 
return(
<>
                {type==="membre"&&
                <>
                                <div class="row mt-2 " style={{fontSize:"14px"}}> 
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetUM})</div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                </div> 
                                <div class="row" >
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                  <div class="col-4" >
                                    <div class="" style={{height:'330px',width:'600px'}}>
                                     <Pie data={dataProjetUserM} options={options}/> 
                                    </div> 
                                  </div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                </div> 
                                <div class="row mb-2 mt-3 " style={{fontSize:"14px"}}> 
                                  <div class="col-6" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetUM}) et le nombre de mes tâches </div> 
                                  <div class="col-6" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetUM}) et mes tâches réalisées(terminées et validées)</div> 

                                </div> 
                                <div class="row" >
                                  <div class="col-6" >
                                  <div class="" style={{width:'550px', overflowX: 'auto'}}>

                                    <div class="" style={{height:'270px',width:'550px'}}>
                                     <Bar data={ dataMesTaskUserM}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize:1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                  <div class="col-6" >
                                  <div class="" style={{width:'550px', overflowX: 'auto'}}>

                                    <div class="" style={{height:'270px',width:'550px'}}>
                                     <Bar data={ dataMesTaskRealiseUserM}  options={{scales: {y: {suggestedMin: 0,suggestedMax:100, ticks: {reverse: false,stepSize:10
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div>
                                </> }

                                {type==="chef"&&
                <>
                                <div class="row mt-2 " style={{fontSize:"14px"}}> 
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetUCH})</div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                </div> 
                                <div class="row" >
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                  <div class="col-4" >
                                    <div class="" style={{height:'330px',width:'600px'}}>
                                     <Pie data={dataProjetUserCH} options={options}/> 
                                    </div> 
                                  </div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                </div> 
                                <div class="row mb-2 " style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetUCH}) et le nombre d'utilisateurs</div> 
                                </div> 
                                <div class="row" >
                                  <div class="col-12" >
                                  <div class="" style={{width:'1100px', overflowX: 'auto'}}>

                                    <div class="" style={{height:'270px',width:'1100px'}}>
                                     <Bar data={ dataNbUser}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize:1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div> 
                                <div class="row mb-2 mt-3 " style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetUCH}) et ses tâches réalisées(terminées et validées)</div> 
                                </div> 
                                <div class="row" >
                                  <div class="col-12" >
                                  <div class="" style={{width:'1100px', overflowX: 'auto'}}>

                                    <div class="" style={{height:'270px',width:'1100px'}}>
                                     <Bar data={ dataTaskUser}  options={{scales: {y: {suggestedMin: 0,suggestedMax:100, ticks: {reverse: false,stepSize:10
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div> 
                                <div class="row mb-2 mt-3 " style={{fontSize:"14px"}}> 
                                  <div class="col-6" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetUCH}) et le nombre de mes tâches </div> 
                                  <div class="col-6" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetUCH}) et mes tâches réalisées(terminées et validées)</div> 
                                </div> 
                                <div class="row" >
                                  <div class="col-6" >
                                  <div class="" style={{width:'550px', overflowX: 'auto'}}>

                                    <div class="" style={{height:'270px',width:'550px'}}>
                                     <Bar data={ dataMesTaskUserCH}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize:1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                  <div class="col-6" >
                                  <div class="" style={{width:'550px', overflowX: 'auto'}}>

                                    <div class="" style={{height:'270px',width:'550px'}}>
                                     <Bar data={ dataMesTaskRealiseUserCH}  options={{scales: {y: {suggestedMin: 0,suggestedMax:100, ticks: {reverse: false,stepSize:10
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div>
                                </> }
                        
                               
</>


)}
