
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
export default function IndexClient() {

  const [nbTousProjetU,setNbTousProjetU]= useState()
  const [nbProjetNU,setNbProjetNU]= useState()
  const [nbProjetArchU,setNbProjetArchU]= useState()
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
const getProjetUser = (async () => {
  await Axios.get(`http://localhost:8000/dasboardProjetU/${user1.id}`
  )
  .then((response)=>{
  setNbTousProjetU(response.data.n)
  setNbProjetArchU(response.data.nbAr)
  setNbProjetNU(response.data.nb)  })})
  useEffect( () => {getProjetUser();},[]);
const dataProjetUser = {
labels: ['Projets non archivés', 'Projets archivés'],
datasets: [
    {label: 'nombre de projets',
    data: [nbProjetNU, nbProjetArchU],
    backgroundColor: ['#06868D','rgba(221,0,67,3)',],
    borderWidth: 1,},],    } 

const getNbUser = (async () => {
        await Axios.get(`http://localhost:8000/chefProjets/${user1.id}`
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
            await Axios.get(`http://localhost:8000/chefProjetsTasks/${user1.id}`
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
                                <div class="row mt-2 " style={{fontSize:"14px"}}> 
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetU})</div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                </div> 
                                <div class="row" >
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                  <div class="col-4" >
                                    <div class="" style={{height:'330px',width:'600px'}}>
                                     <Pie data={dataProjetUser} options={options}/> 
                                    </div> 
                                  </div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}></div> 
                                </div> 
                                <div class="row mb-2  " style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetU}) et ses tâches réalisées(terminées et validées)</div> 
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
                                <div class="row mb-2 mt-3" style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Mes projets ({nbTousProjetU}) et le nombre d'utilisateurs</div> 
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
                               
</>


)}
