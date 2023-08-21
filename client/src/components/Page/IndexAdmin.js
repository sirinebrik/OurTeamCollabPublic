
import React,{ useEffect, useState } from 'react'
import $ from 'jquery'; 
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
export default function IndexAdmin({typeSelect}) {
    const [nbTousUser,setNbTousUser]= useState()
    const [nbUserN,setNbUserN]= useState()
    const [nbUserA,setNbUserA]= useState()
    const [nbTousProjet,setNbTousProjet]= useState()
    const [nbProjetN,setNbProjetN]= useState()
    const [nbProjetArch,setNbProjetArch]= useState()
  const [client,setClient]= useState()
  const [membre,setMembre]= useState()
  const [chef,setChef]= useState()
  const [taskProjet,setTaskProjet]= useState([])
  const [projetTask,setProjetTask]= useState([])
  const [secteurCh,setSecteurCh]= useState([])
  const [projetUser,setProjetUser]= useState([])
  const [userProjet,setUserProjet]= useState([])
  const [projetMembreChef,setProjetMembreChef]= useState([])
  const [projetMembreMembre,setProjetMembreMembre]= useState([])
  const [projetChefChef,setProjetChefChef]= useState([])
  const [projetClientClient,setProjetClientClient]= useState([])
  const [secteurC,setSecteurC]= useState([])
  const [departementM,setDepartementM]= useState([])
  const [secteurClient,setSecteurClient]= useState([])
  const [departement,setDepartement]= useState([])
  const [secteurChef,setSecteurChef]= useState([])
 
  

  let user1 = jwt_decode(localStorage.getItem("token"));
  let role1=user1.roles[0]
  const options = {
    plugins: {
      legend: {
        position: 'left',
      labels: {
          usePointStyle: true,
          pointStyle: 'circle',}}},}
  

  //admin
  const getUser = (async () => {
    await Axios.get(`http://localhost:8000/dashboardUser/${user1.org}`
    )
    .then((response)=>{
  setNbTousUser(response.data.nb)
  setNbUserN(response.data.nbN)
    setNbUserA(response.data.nbA)  })})
    useEffect( () => {getUser();},[]);
    const dataUser = {
      labels: ['Utilisateurs actifs', 'Utilisateurs désactivés'],
      datasets: [
          {label: "nombre d'utilisateurs",
          data: [nbUserA, nbUserN],
          backgroundColor: ['#06868D','rgba(221,0,67,3)',],
          borderWidth: 1,},],    } 
  const getProjet = (async () => {
    await Axios.get(`http://localhost:8000/dashboardProjet/${user1.org}`
    )
    .then((response)=>{
    setNbTousProjet(response.data.n)
    setNbProjetArch(response.data.nbAr)
    setNbProjetN(response.data.nb)  })})
    useEffect( () => {getProjet();},[]);
    const dataProjet = {
      labels: ['Projets non archivés', 'Projets archivés'],
      datasets: [
          {label: 'nombre de projets',
          data: [nbProjetN, nbProjetArch],
          backgroundColor: ['#06868D','rgba(221,0,67,3)',],
          borderWidth: 1,},],    } 


    const getTaskProjet = (async () => {
            await Axios.get(`http://localhost:8000/taskProjetRealise/${user1.org}`
            )
            .then((response)=>{
            setProjetTask(response.data.projet)
            setTaskProjet(response.data.task)
            })})
            useEffect( () => {getTaskProjet();},[]);
            console.log(taskProjet)
    const dataTaskProjet = {
              labels: projetTask,
              datasets: [
                  {label: 'pourcentage des tâches réalisées %',
                  data:taskProjet,
                  backgroundColor: ['#06868D',],
                  borderWidth: 1,},],    } 

          const getProjetParUser = (async () => {
            await Axios.get(`http://localhost:8000/ProjetParUser/${user1.org}`
            )
            .then((response)=>{
            setProjetUser(response.data.user)
             })})
            useEffect( () => {getProjetParUser();},[]);

  let dataProjetU=[]
  let dataCounterProjetU=[]
  projetUser.map((item,index)=>(dataProjetU.push(item.username+" "+item.lastname) ))  
  projetUser.map((item,index)=>(dataCounterProjetU.push(item.counter)    ))  
  const dataProjetUs = {
      labels: dataProjetU,
      datasets: [
          {label: "nombre de projets",
          data: dataCounterProjetU,
          backgroundColor: ['#06868D'],
          borderWidth: 1,},],    }

          const getUserParProjet = (async () => {
            await Axios.get(`http://localhost:8000/userParProjet/${user1.org}`
            )
            .then((response)=>{
            setUserProjet(response.data.projet)
             })})
            useEffect( () => {getUserParProjet();},[]);

  let dataUserP=[]
  let dataCounterUserP=[]
  userProjet.map((item,index)=>(dataUserP.push(item.nom) ))  
  userProjet.map((item,index)=>(dataCounterUserP.push(item.counter)    ))  
  const dataUserPr = {
      labels: dataUserP,
      datasets: [
          {label: "nombre d' utilisateurs",
          data: dataCounterUserP,
          backgroundColor: ['#06868D'],
          borderWidth: 1,},],    }
          
          const getProjetMembreChef = (async () => {
            await Axios.get(`http://localhost:8000/membreChefProjet/${user1.org}`
            )
            .then((response)=>{
            setProjetMembreChef(response.data.membre)
             })})
            useEffect( () => {getProjetMembreChef();},[]);

  let dataMProjet=[]
  let dataCounterMP=[]
  projetMembreChef.map((item,index)=>(dataMProjet.push(item.username+" "+item.lastname) ))  
  projetMembreChef.map((item,index)=>(dataCounterMP.push(item.counter)    ))  
  const dataMembreChefProjet= {
      labels: dataMProjet,
      datasets: [
          {label: "nombre de projets",
          data: dataCounterMP,
          backgroundColor: ['#06868D'],
          borderWidth: 1,},],    }

  const getProjetChefChef = (async () => {
            await Axios.get(`http://localhost:8000/chefChefProjet/${user1.org}`
            )
            .then((response)=>{
            setProjetChefChef(response.data.chef)
             })})
            useEffect( () => {getProjetChefChef();},[]);
  let dataCProjet=[]
  let dataCounterCP=[]
  projetChefChef.map((item,index)=>(dataCProjet.push(item.username+" "+item.lastname) ))  
  projetChefChef.map((item,index)=>(dataCounterCP.push(item.counter)    ))  
  const dataChefChefProjet= {
      labels: dataCProjet,
      datasets: [
          {label: "nombre des projets",
          data: dataCounterCP,
          backgroundColor: ['#06868D'],
          borderWidth: 1,},],    }

  const getProjetMembreMembre= (async () => {
            await Axios.get(`http://localhost:8000/membreMembreProjet/${user1.org}`
            )
            .then((response)=>{
            setProjetMembreMembre(response.data.membre)
             })})
            useEffect( () => {getProjetMembreMembre();},[]);

  let dataMMProjet=[]
  let dataCounterMMP=[]
  projetMembreMembre.map((item,index)=>(dataMMProjet.push(item.username+" "+item.lastname) ))  
  projetMembreMembre.map((item,index)=>(dataCounterMMP.push(item.counter)    ))  
  const dataMembreMembreProjet= {
      labels: dataMMProjet,
      datasets: [
          {label: "nombre de projets",
          data: dataCounterMMP,
          backgroundColor: ['#06868D'],
          borderWidth: 1,},],    }

  const getProjetClientChef = (async () => {
            await Axios.get(`http://localhost:8000/clientClientProjet/${user1.org}`
            )
            .then((response)=>{
            setProjetClientClient(response.data.client)
             })})
            useEffect( () => {getProjetClientChef();},[]);

  let dataCcProjet=[]
  let dataCounterCcP=[]
  projetClientClient.map((item,index)=>(dataCcProjet.push(item.username+" "+item.lastname) ))  
  projetClientClient.map((item,index)=>(dataCounterCcP.push(item.counter)    ))  
  const dataClientClientProjet= {
      labels: dataCcProjet,
      datasets: [
          {label: "nombre de projets",
          data: dataCounterCcP,
          backgroundColor: ['#06868D'],
          borderWidth: 1,},],    }
  const getUserRole = (async () => {
        await Axios.get(`http://localhost:8000/dashboardUserRole/${user1.org}`
        )
        .then((response)=>{
      setChef(response.data.nbCh)
      setMembre(response.data.nbM)
        setClient(response.data.nbC)  })})
        useEffect( () => {getUserRole();},[]);
   const dataUserRole = {
          labels: ['Chefs de projet', 'Membres','Clients'],
          datasets: [
              {label: "nombre d' utilisateurs",
              data: [chef, membre,client],
              backgroundColor: ['#06868D'],
              borderWidth: 1,},],    } 
  const getChef = (async () => {
    await Axios.get(`http://localhost:8000/dashboardUserChef/${user1.org}`
    )
    .then((response)=>{
    setSecteurChef(response.data.chef)
    setSecteurCh(response.data.secteur) })})
    useEffect( () => {getChef();},[]);
  
let dataSecteur=[]
let dataCounter=[]
secteurChef.map((item,index)=>(dataSecteur.push(item.titre)    ))  
secteurCh.map((item,index)=>(dataSecteur.push(item)    ))  
secteurChef.map((item,index)=>(dataCounter.push(item.counter)    ))  
secteurCh.map((item,index)=>(dataCounter.push(0)    ))  
  const dataChef = {
      labels: dataSecteur,
      datasets: [
          {label: "nombre de chefs de projet",
          data: dataCounter,
          backgroundColor: ['#06868D'],
          borderWidth: 1,},],    } 
const getMembre = (async () => {
      await Axios.get(`http://localhost:8000/dashboardUserMembre/${user1.org}`
      )
      .then((response)=>{
      setDepartement(response.data.departement)
      setDepartementM(response.data.membre) })})
      useEffect( () => {getMembre();},[]);
let dataDepartement=[]
let dataCounterM=[]
departementM.map((item,index)=>(dataDepartement.push(item.departement)    ))  
departement.map((item,index)=>(dataDepartement.push(item)    ))  
departementM.map((item,index)=>(dataCounterM.push(item.counter)    ))  
departement.map((item,index)=>(dataCounterM.push(0)    ))  
  const dataMembre = {
      labels: dataDepartement,
      datasets: [
          {label: "nombre de membres",
          data: dataCounterM,
          backgroundColor: ['#06868D'],
          borderWidth: 1,},],    } 
    const getClient = (async () => {
      await Axios.get(`http://localhost:8000/dashboardUserClient/${user1.org}`
      )
      .then((response)=>{
      setSecteurClient(response.data.client)
      setSecteurC(response.data.secteur) })})
      useEffect( () => {getClient();},[]);
      let dataSecteurC=[]
      let dataCounterC=[]
      secteurClient.map((item,index)=>(dataSecteurC.push(item.titre)    ))  
      secteurC.map((item,index)=>(dataSecteurC.push(item)    ))  
      secteurClient.map((item,index)=>(dataCounterC.push(item.counter)    ))  
      secteurC.map((item,index)=>(dataCounterC.push(0)    ))  
        const dataClient = {
            labels: dataSecteurC,
            datasets: [
                {label: "nombre de clients",
                data: dataCounterC,
                backgroundColor: ['#06868D'],
                borderWidth: 1,},],    } 
return(
<>
                 
                                { typeSelect==="utilisateurs"&&
                                <>
                                <div class="row mt-3 " style={{fontSize:"14px"}}> 
                                  <div class="col-5" style={{fontWeight:'bold'}}> Tous les utilisateurs ({nbTousUser})</div> 
                                  <div class="col-7 mb-2" style={{fontWeight:'bold'}}> Tous les utilisateurs ({nbTousUser}) par rôle </div> 
                                </div> 
                                <div class="row" >
                                  <div class="col-5" >
                                    <div class="" style={{height:'330px',width:'600px'}}>
                                     <Pie data={dataUser} options={options}/> 
                                    </div> 
                                  </div> 
                                  <div class="col-7" >
                                    <div class="" style={{height:'255px',width:'650px'}}>
                                     <Bar data={dataUserRole}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                  </div> 
                                </div> 
                                <div class="row  mb-2" style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Tous les chefs de projet ({chef}) par secteur d'activité </div>  
                                </div> 
                                <div class="row" >
                                  <div class="col-12" >
                                    <div class="" style={{height:'400px',width:'1150px',margin:0}}>
                                      <Bar data={dataChef}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                  </div> 
                                </div> 
                                <div class="row  mb-2" style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Tous les membres ({membre}) par département </div>  
                                </div> 
                                <div class="row" >
                                  <div class="col-12 me-12" >
                                    <div class="" style={{height:'270px',width:'1050px'}}>
                                     <Bar data={dataMembre}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                  </div> 
                                </div> 
                                <div class="row  mb-2" style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Tous les clients ({client}) par secteur d'activité</div>  
                                </div> 
                                <div class="row" >
                                  <div class="col-12 " >
                                    <div class="" style={{height:'400px',width:'1150px'}}>
                                     <Bar data={dataClient}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                  </div> 
                                </div>  </>}
                                { typeSelect==="projets"&&
                                <>
                                <div class="row mt-3 " style={{fontSize:"14px"}}> 
                                  <div class="col-4" style={{fontWeight:'bold'}}> </div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}> Tous les projets ({nbTousProjet})</div> 
                                  <div class="col-4" style={{fontWeight:'bold'}}> </div> 
                                </div> 
                              
                                <div class="row" >
                                  <div class="col-4" > </div> 
                                  <div class="col-4" >
                                    <div class="" style={{height:'330px',width:'600px'}}>
                                      <Pie data={dataProjet} options={options}/> 
                                    </div> 
                                  </div> 
                                  <div class="col-4" > </div> 
                                </div> 
                                <div class="row " style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Tous les projets ({nbTousProjet}) et ses tâches réalisées(terminées et validées)</div> 
                                </div> 
                                <div class="row" >
                                  <div class="col-12" >
                                  <div class="" style={{width:'1100px', overflowX: 'auto'}}>

                                    <div class="" style={{height:'270px',width:'1100px'}}>
                                     <Bar data={ dataTaskProjet}  options={{scales: {y: {suggestedMin: 0,suggestedMax:100, ticks: {reverse: false,stepSize:10
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div> 
                              
                              
                                 </>}
                                 { typeSelect==="PU"&&
                                <>
                                <div class="row mt-3 " style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Tous les utilisateurs ({nbTousUser}) et le nombre de projets affectés</div> 

                                </div> 
                                <div class="row" >
                                  <div class="col-12" >
                                  <div class="" style={{width:'1100px', overflowX: 'auto'}}>

                                    <div class="" style={{height:'270px',width:'1100px'}}>
                                     <Bar data={dataProjetUs}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div> 
                                <div class="row mt-3 " style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Tous les projets ({nbTousProjet}) et le nombre d'utilisateurs</div> 

                                </div> 
                                <div class="row" >
                                  <div class="col-12" >
                                  <div class="" style={{width:'1100px', overflowX: 'auto'}}>

                                    <div class="" style={{height:'270px',width:'1100px'}}>
                                      <Bar data={ dataUserPr}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div> 
                                <div class="row  mb-2 mt-3" style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Les chefs de projet ({chef}) et le nombre de projets gérés </div>  
                                </div> 
                                <div class="row" >
                                  <div class="col-12 me-12" >
                                  <div class="" style={{width:'1050px', overflowX: 'auto'}}>
                                    <div class="" style={{height:'270px',width:'1050px'}}>
                                     <Bar data={dataChefChefProjet}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div> 
                                <div class="row  mb-2 mt-3" style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Les membres qui ont affectés à des projets comme des chefs de projet </div>  
                                </div> 
                                <div class="row" >
                                  <div class="col-12 me-12" >
                                  <div class="" style={{width:'1050px', overflowX: 'auto'}}>
                                    <div class="" style={{height:'270px',width:'1050px'}}>
                                     <Bar data={dataMembreChefProjet}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div> 
                                <div class="row  mb-2 mt-3" style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Les membres ({membre}) et le nombre de projets affectés </div>  
                                </div> 
                                <div class="row" >
                                  <div class="col-12 me-12" >
                                  <div class="" style={{width:'1050px', overflowX: 'auto'}}>
                                    <div class="" style={{height:'270px',width:'1050px'}}>
                                     <Bar data={dataMembreMembreProjet}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div> 
                                <div class="row  mb-2 mt-3" style={{fontSize:"14px"}}> 
                                  <div class="col-12" style={{fontWeight:'bold'}}> Les clients ({client}) et le nombre de ses projets </div>  
                                </div> 
                                <div class="row" >
                                  <div class="col-12 me-12" >
                                  <div class="" style={{width:'1050px', overflowX: 'auto'}}>
                                    <div class="" style={{height:'270px',width:'1050px'}}>
                                     <Bar data={dataClientClientProjet}  options={{scales: {y: {suggestedMin: 0,suggestedMax:10, ticks: {reverse: false,stepSize: 1
                                                                },},},indexAxis: 'x',plugins:{title:{display:false, font:{size: 12, family: 'rubik'}},
                                                                 legend: {display: false, position: 'right'}}, maintainAspectRatio: false}} 
                                      /> 
                                    </div> 
                                    </div> 
                                  </div> 
                                </div> 
                                 </>}
                              
                               
</>


)}
