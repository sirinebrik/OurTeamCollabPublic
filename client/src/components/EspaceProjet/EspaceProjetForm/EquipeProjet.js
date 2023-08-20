import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { MultiSelect } from "react-multi-select-component";
import { Link,useNavigate,useParams } from "react-router-dom"
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"
import { Checkbox } from 'pretty-checkbox-react';
import EquipeProjetUser from "./EquipeProjetUser";
import Modal from 'react-bootstrap/Modal';


export default function EquipeProjet() {
    const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
    const { projetRole } = useParams()
    const [projet,setProjet]= useState([])
    const [checked, setChecked] = useState(false);
    const [projets,setProjets]= useState([])
    const [projetsUser,setProjetsUser]= useState([])
    const [usersProjet,setUsersProjet]= useState([])
    const [typeSelect, setTypeSelect] = useState("tous")   
    const [search, setSearch] = useState("");
    const [membres,setMembres]= useState([])
    const [clients,setClients]= useState([])
    const [chefProjets,setChefProjets]= useState([])
    const [membresTous,setMembresTous]= useState([])
    const [usersTous,setUsersTous]= useState([])
    const [clientsTous,setClientsTous]= useState([])
    const [chefProjetsTous,setChefProjetsTous]= useState([])
    const [userId,setUserId]= useState("")
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredMembres,setFilteredMembres]= useState([])
    const [filteredClients,setFilteredClients]= useState([])
    const [filteredChefProjets,setFilteredChefProjets]= useState([])
    const [show, setShow] = useState(false);
    const [showCh, setShowCh] = useState(false);
    const [showC, setShowC] = useState(false);
    const [droitAccès, setDroitAccès] = useState("");
    const handleShow = () => {setShow(true);setDroitAccès("membre")};
    const handleClose = () => {setShow(false);setUserId("");setDroitAccès("")}
    const handleShowCh = () => {setShowCh(true);setDroitAccès("chefProjet")};
    const handleCloseCh = () => {setShowCh(false);setUserId("");setDroitAccès("")}
    const handleShowC = () => {setShowC(true);setDroitAccès("client")};
    const handleCloseC = () => {setShowC(false);setUserId("");setDroitAccès("")}
     //checkbox
     const handleChange = () => {
        setChecked(!checked);
        setUserId("")
      };
    function onKeyUpHandler(e) {
        setSearch(e);
      }
      useEffect(() => {
         // on fait le filtre et on modifie la liste (rendu)
             if(typeSelect==="tous"){
             const newData = filteredUsers.filter(function (item) {
                const itemData = item.user.username+" "+item.user.lastname
                    ? (item.user.username+" "+item.user.lastname).toUpperCase()
                    : ''.toUpperCase();
                const textData = search.toString().toUpperCase();
                return itemData.indexOf(textData) > -1;});
                setUsersProjet(newData);
            }
            if(typeSelect==="membre"){   
            const newDataMembres = filteredMembres.filter(function (item) {
                const itemDataMembres = item.user.username+" "+item.user.lastname
                            ? (item.user.username+" "+item.user.lastname).toUpperCase()
                            : ''.toUpperCase();
                const textDataMembres = search.toString().toUpperCase();
                return itemDataMembres.indexOf(textDataMembres) > -1;});
                  setMembres(newDataMembres);
            }
            if(typeSelect==="client"){   
            const newDataClients = filteredClients.filter(function (item) {
                const itemDataClients = item.user.username+" "+item.user.lastname
                        ? (item.user.username+" "+item.user.lastname).toUpperCase()
                        : ''.toUpperCase();
                const textDataClients = search.toString().toUpperCase();
                return itemDataClients.indexOf(textDataClients) > -1;});
                setClients(newDataClients);
            }
            if(typeSelect==="chefProjet"){      
            const newDatachefProjets = filteredChefProjets.filter(function (item) {
                const itemDatachefProjets = item.user.username+" "+item.user.lastname
                            ? (item.user.username+" "+item.user.lastname).toUpperCase()
                            : ''.toUpperCase();
                const textDatachefProjets = search.toString().toUpperCase();
                return itemDatachefProjets.indexOf(textDatachefProjets) > -1;});
                setChefProjets(newDatachefProjets);
            }
           
         }, [search]);
    let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]


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

    //detailprojet
   const getDetailProjet = (async () => {
        await Axios.get(`http://localhost:8000/detailProjet/${id}`
      )
        .then((response)=>{
        setUsersProjet(response.data.projet) 
        setFilteredUsers(response.data.projet)        
        setIsLoding(false);
    })  });
    useEffect( () => {getDetailProjet();},[]);

//tous les projets pour Admin
    const getProjets = (async () => {
        await Axios.get(`http://localhost:8000/projet/acces`).then((response)=>{
         setProjets(response.data.projet)
        })  });
        useEffect( () => {getProjets();},[]) ;
    let proj=[]
    if(role==="ROLE_ADMIN") {proj = projets.filter(f => (f.id !== projet.id ))}
    else {proj = projetsUser.filter(f => (f.projet.id !== projet.id ))}
    const change = async(e) =>{  if(role==="ROLE_ADMIN"){window.location=`/equipeProjet/${e}`} 
    else{
        await Axios.get(`http://localhost:8000/indexProjetU/${e}/${user.id}`)
        .then((response)=>{
           window.location=`/equipeProjet/${e}/${response.data.projet[0].role}`
         }) ;
       };}
//les membres
const getMembres = (async () => {
    await Axios.get(`http://localhost:8000/detailProjetEquipeMembre/${id}`).then((response)=>{
     setMembres(response.data.projet)
     setFilteredMembres(response.data.projet)
    })  });
    useEffect( () => {getMembres();},[]) ;
//les clients
const getClients = (async () => {
        await Axios.get(`http://localhost:8000/detailProjetEquipeClient/${id}`).then((response)=>{
         setClients(response.data.projet)
         setFilteredClients(response.data.projet)
        })  });
        useEffect( () => {getClients();},[]) ;
//les chefs de projets
const getChefProjets = (async () => {
            await Axios.get(`http://localhost:8000/detailProjetEquipeChef/${id}`).then((response)=>{
             setChefProjets(response.data.projet)
             setFilteredChefProjets(response.data.projet)
            })  });
            useEffect( () => {getChefProjets();},[]) ;
 //tous utilisateurs activés
 const getUsersTous = (async () => {
    await Axios.get(`http://localhost:8000/indexUser`).then((response)=>{
       setUsersTous(response.data.user)
   
 })});
    useEffect( () => {getUsersTous();},[]) ;
 
    const onSubmitHandler = (e) => {
        e.preventDefault()
         const formData ={
              "role" : droitAccès,
              "userId":userId,
             }
        Axios.post(`http://localhost:8000/ajouterUserProjet/${id}`, formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
          .then((res) => { 
            if(role==="ROLE_ADMIN"){window.location=`./${id}`} else{  window.location=`./${projetRole}`};})
          .catch((err) => {})
      }
       

//tous membres
const getMembresTous = (async () => {
    await Axios.get(`http://localhost:8000/indexMembre`).then((response)=>{
      setMembresTous(response.data.user)  }) });
    useEffect( () => {getMembresTous();},[]) ;
    let listM=[]
    let iM=0
  membresTous.map((item) => {iM=0;usersProjet.map((item1) => {if(item.utilisateur.id===item1.user.id){iM=iM+1}});if(iM===0){listM.push(item)} })

//tous clients
const getClientsTous = (async () => {
        await Axios.get(`http://localhost:8000/indexClient`).then((response)=>{
         setClientsTous(response.data.user)})  });
       useEffect( () => {getClientsTous();},[]) ;
    let listC=[]
    let iC=0
   clientsTous.map((item) => {iC=0;usersProjet.map((item1) => {if(item.utilisateur.id===item1.user.id){iC=iC+1}});if(iC===0){listC.push(item)} })
//tous chefs de projets
const getChefProjetsTous = (async () => {
            await Axios.get(`http://localhost:8000/indexChefProjet`).then((response)=>{
                setChefProjetsTous(response.data.user);})  });
            useEffect( () => {getChefProjetsTous();},[]) ; 
     let listCh=[]
     let iCh=0
           chefProjetsTous.map((item) => {iCh=0;usersProjet.map((item1) => {if(item.utilisateur.id===item1.user.id){iCh=iCh+1}});if(iCh===0){listCh.push(item)} })
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
                        <Link class="nav-link test "  to={ `/réunion/${id}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }}>
                                   <i class="fa fa-fw fa-briefcase"></i>
                           <span class="menu-title"> Réunions</span>
                        </Link>}
                    {(role==="ROLE_CLIENT"||role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                        <Link class="nav-link test "  to={ `/réunion/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px" }}>
                                   <i class="fa fa-fw fa-briefcase"></i>
                           <span class="menu-title">Réunions</span>
                        </Link>}
                            </li>
                            <li class="nav-item ">
                            {role==="ROLE_ADMIN"&&
                                <Link class="nav-link test"  to={ `/equipeProjet/${id}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }} >
                                     <i class="fa fa-users fa-fw"></i>
                                     <span class="menu-title"> Equipe</span>
                                </Link>}
                          {(role==="ROLE_CLIENT"||role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                                <Link class="nav-link test"  to={ `/equipeProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }} >
                                      <i class="fa fa-users fa-fw"></i>
                                      <span class="menu-title"> Equipe</span>
                                </Link>}
                            </li>
                            <li class="nav-item ">
                           {role==="ROLE_ADMIN"&&projet.archive===false&&
                                <Link class="nav-link test"  to={ `/parametreProjet/${id}`}  style={{textDecoration:"none" ,color:"#dfe3ea",fontSize:"14px",}} >
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
            <div class="content-wrapper">
            <div class="row mb-4">
         {(projetRole==="chefProjet"&&projet.archive===false)&&
         <>
            <div class="col-7"></div>
            <div class="col-5">
                <div class="row ">
                    <div class="col-6">
                        <div className="form-icon-container2 ">
                            <input className="form-control  form-icon-input2" value={search} onChange={(text) => {onKeyUpHandler(text.target.value)}} name="filter"  type="text"  placeholder="Recherche" style={{paddingTop:"9px",paddingBottom:"9px" ,borderColor:"#06868D"}}/>
                            <span className="fa fa-search text-900 fs--1 form-icon2"></span>
                         </div>  
                    </div>
                    <div class="col-6">
                       <button type="button" className="btn pt-2 pb-2 pe-4 ps-4 " onClick={handleShow}  style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}><i class="fa fa-fw fa-plus" style={{fontSize:"14px"}}></i> Associer un membre</button>
                    </div>
                </div>
            </div>
            </>}
            {role==="ROLE_ADMIN"&&projet.archive===false&&
            <>
            <div class="col-5"></div>
            <div class="col-7">
                <div class="row ">
                    <div class="col-5">
                        <div className="form-icon-container3 ">
                            <input className="form-control  form-icon-input3" value={search} onChange={(text) => {onKeyUpHandler(text.target.value)}} name="filter"  type="text"  placeholder="Recherche" style={{paddingTop:"9px",paddingBottom:"9px" ,borderColor:"#06868D"}}/>
                            <span className="fa fa-search text-900 fs--1 form-icon3"></span>
                         </div>  
                    </div>
                    <div class="col-4">
                       <button type="button" className="btn pt-2 pb-2 pe-4 ps-4 " onClick={handleShowCh}  style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}><i class="fa fa-fw fa-plus" style={{fontSize:"14px"}}></i> Changer le chef de projet</button>
                    </div>
                    <div class="col-3">
                       <button type="button" className="btn pt-2 pb-2 pe-4 ps-4 " onClick={handleShowC}  style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}><i class="fa fa-fw fa-plus" style={{fontSize:"14px"}}></i> Changer le client</button>
                    </div>
                </div>
            </div>
            </>}
            {(projetRole==="membre"||projetRole==="client"||projet.archive===true)&&
             <>
            <div class="col-7"></div>
            <div class="col-5">
                <div class="row ">
                    <div class="col-6">
                    </div>
                    <div class="col-6">
                        <div className="form-icon-container2 ">
                            <input className="form-control  form-icon-input2" value={search} onChange={(text) => {onKeyUpHandler(text.target.value)}} name="filter"  type="text"  placeholder="Recherche" style={{paddingTop:"9px",paddingBottom:"9px" ,borderColor:"#06868D"}}/>
                            <span className="fa fa-search text-900 fs--1 form-icon2"></span>
                         </div>                      
                    </div>
                </div>
            </div>
            </>}
            
        </div>
        <div class="row ">
        <div class="col-9"> 
        <div class=" " style={{color:'white' ,borderColor:"#06868D",textAlign:"center" }}>
            <ul class="nav " >
                <li class="nav-item">
                    {typeSelect==="tous"&&
                    <button  class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("tous");setSearch("");getMembres();getChefProjets();getClients()}}   style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                        <span class="menu-title" > Tous les utilisateurs</span>
                    </button>}
                    {(typeSelect==="chefProjet"||typeSelect==="membre"||typeSelect==="client"||typeSelect==="tousDésac")&&
                    <button type="button" class="nav-link border border-top-0 border-end-0 border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("tous");setSearch("");getMembres();getChefProjets();getClients()}}   style={{color:"#06868D",fontSize:"14px", borderBottom: "4px solid black" }}>
                        <span class="menu-title" > Tous les utilisateurs</span>
                    </button>}
                </li>
                <li class="nav-item ">
                {typeSelect==="chefProjet"&&
                   <button class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("chefProjet");setSearch("");getMembres();getDetailProjet();getClients()}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                       <span class="menu-title">  Le chef de projet</span>
                   </button>
                }
                {(typeSelect==="tous"||typeSelect==="membre"||typeSelect==="client"||typeSelect==="tousDésac")&&
                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("chefProjet");setSearch("");getMembres();getDetailProjet();getClients()}} style={{color:"#06868D",fontSize:"14px" }}>
                        <span class="menu-title">  Le chef de projet</span>
                    </button>}
                </li>
                <li class="nav-item ">
                {typeSelect==="membre"&&
                   <button class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("membre");setSearch("");getDetailProjet();getChefProjets();getClients()}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                       <span class="menu-title">  Les membres</span>
                   </button>
                }
                {(typeSelect==="chefProjet"||typeSelect==="tous"||typeSelect==="client"||typeSelect==="tousDésac")&&
                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("membre");setSearch("");getDetailProjet();getChefProjets();getClients()}} style={{color:"#06868D",fontSize:"14px" }}>
                        <span class="menu-title"> Les membres</span>
                    </button>}
                </li>
                <li class="nav-item ">
                {typeSelect==="client"&&
                   <button class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("client");setSearch("");getMembres();getChefProjets();getDetailProjet()}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                       <span class="menu-title">  Le client</span>
                   </button>
                }
                {(typeSelect==="chefProjet"||typeSelect==="membre"||typeSelect==="tous"||typeSelect==="tousDésac")&&
                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("client");setSearch("");getMembres();getChefProjets();getDetailProjet()}} style={{color:"#06868D",fontSize:"14px" }}>
                        <span class="menu-title"> Le client</span>
                    </button>}
                </li>
               
            </ul>
        </div>
    </div> 
        </div>
            <div class="row flex-grow " >
                   {typeSelect==="tous"&&usersProjet.length!==0&&
                   usersProjet.map((item,index)=>(
                                 <EquipeProjetUser  key={index} id={item.user.id} username={item.user.username} lastname={item.user.lastname} roleProjet={item.role} userRole={role}
                                         photo={item.user.photo} email={item.user.email} sexe={item.user.sexe} etat={item.user.etat} role={item.user.roles} 
                                         />)) }

    {typeSelect==="membre"&&membres.length!==0&&
                               membres.map((item,index)=>(
                                <EquipeProjetUser  key={index} id={item.user.id} username={item.user.username} lastname={item.user.lastname} roleProjet={item.role} userRole={role}
                                photo={item.user.photo} email={item.user.email} sexe={item.user.sexe} etat={item.user.etat} role={item.user.roles} 
                                />)) }
     {typeSelect==="membre"&&membres.length===0&&
           <center style={{fontSize:"15px",marginTop:"200px"}}> La liste des membres est vide.</center>}

    {typeSelect==="client"&&clients.length!==0&&
                               clients.map((item,index)=>(
                                <EquipeProjetUser  key={index} id={item.user.id} username={item.user.username} lastname={item.user.lastname} roleProjet={item.role} userRole={role}
                                photo={item.user.photo} email={item.user.email} sexe={item.user.sexe} etat={item.user.etat} role={item.user.roles} 
                                />)) }
     {typeSelect==="client"&&clients.length===0&&
         <center style={{fontSize:"15px",marginTop:"200px"}}> La liste des clients est vide.</center>}
                                    
    {typeSelect==="chefProjet"&&chefProjets.length!==0&&
                               chefProjets.map((item,index)=>(
                                <EquipeProjetUser  key={index} id={item.user.id} username={item.user.username} lastname={item.user.lastname} roleProjet={item.role} userRole={role}
                                photo={item.user.photo} email={item.user.email} sexe={item.user.sexe} etat={item.user.etat} role={item.user.roles} 
                                />)) }
    {typeSelect==="chefProjet"&&chefProjets.length===0&&
         <center style={{fontSize:"15px",marginTop:"200px"}}> La liste des chefs de projet est vide.</center>}

             </div> 
            </div> 
        </div>
    </div>
    <Modal show={show} >
        <Modal.Header  >
          <Modal.Title>Associer un membre
            <button  onClick={handleClose} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"247px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} > 
                <div class="row">
                    <div class="col-12">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Membre<span style={{color:"red"}}>*</span></label>
                             {listM.length===0&&
                                 <div class="ms-1" style={{fontSize:"13px"}}>Tous les membres sont déjà membre de ce projet, vous ne pouvez plus en ajouter d'autre.</div>
                                }
                                

                                 {((listM.length!==0))&&
                            <select value={userId} required onChange={ (e) =>  setUserId(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                               <option value="" selected disabled> Choisir le membre</option>
                                   {listM.map((item,index)=>(
                                        <option   key={item.utilisateur.id} value={item.utilisateur.id}>
                                            {item.utilisateur.username} {item.utilisateur.lastname} ({item.departement})
                                        </option>
                                ))}
                               
                           </select> }
                        </div>
                    </div>
                </div>
              
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"  disabled={(!userId) &&"disabled"}  style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                       Ajouter
                    </button>
                </div>
            </form>
        </Modal.Body>
    </Modal>
    <Modal show={showCh} >
        <Modal.Header  >
          <Modal.Title>Changer le chef de projet
            <button  onClick={handleCloseCh} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"220px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} > 
                <div class="row">
                    <div class="col-12">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Chef de projet <span style={{color:"red"}}>*</span></label>
                             {checked===true &&listM.length===0&&
                                 <div class="ms-1" style={{fontSize:"13px"}}>Tous les membres sont déjà membre de ce projet, vous ne pouvez plus en ajouter d'autre.</div>
                                }
                                
                                 {checked===false&&listCh.length===0&&
                                 <div class="ms-1" style={{fontSize:"13px"}}>Tous les chefs de projet sont déjà membre de ce projet, vous ne pouvez plus en ajouter d'autre.</div>
                                }

                                 {((checked===true &&listM.length!==0))&&
                            <select value={userId} required onChange={ (e) =>  setUserId(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                           
                                <option value="" selected disabled> Choisir le membre</option>
                                  {listM.map((item,index)=>(
                                        <option   key={item.utilisateur.id} value={item.utilisateur.id}>
                                            {item.utilisateur.username} {item.utilisateur.lastname} ({item.departement})
                                        </option>
                                ))
                             
                                }
                                   </select>
                           }
                               {((checked===false &&listCh.length!==0))&&
                            <select value={userId} required onChange={ (e) =>  setUserId(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                           
                                <option value="" selected disabled> Choisir le chef de projet</option>
                              { listCh.map((item,index)=>(
                                        <option   key={item.utilisateur.id} value={item.utilisateur.id}>
                                            {item.utilisateur.username} {item.utilisateur.lastname} ({item.secteur.titre})
                                        </option>
                                ))}
                                  </select>
                           }
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mt-4">
                        <input class="form-check-input" type="checkbox" checked={checked} onChange={handleChange} id="flexCheckDefault"/>
                        <label style={{color:"#06868D"}} className="form-label" >Si vous pouvez ajouter un membre comme un chef de projet </label>
                    </div>

                </div>
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"  disabled={(!userId) &&"disabled"}  style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                       Modifier
                    </button>
                </div>
            </form>
        </Modal.Body>
    </Modal>
    <Modal show={showC} >
        <Modal.Header  >
          <Modal.Title>Changer le client
            <button  onClick={handleCloseC} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"289px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} > 
                
               
                <div class="row">
                    <div class="col-12">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Client <span style={{color:"red"}}>*</span></label>
                            
                                 {listC.length===0&&
                                 <div class="ms-1" style={{fontSize:"13px"}} >Tous les clients sont déjà membre de ce projet, vous ne pouvez plus en ajouter d'autre.</div>
                                }
                                

                                 {(listC.length!==0)&&
                            <select value={userId} required onChange={ (e) =>  setUserId(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                           
                                <option value="" selected disabled> Choisir le client</option>
                                 {listC.map((item,index)=>(
                                        <option   key={item.utilisateur.id} value={item.utilisateur.id}>
                                            {item.utilisateur.username} {item.utilisateur.lastname} ({item.secteur.titre})
                                        </option>
                                ))}
                              
                           </select> }
                        </div>
                    </div>
                </div>
               
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"  disabled={(!userId) &&"disabled"}  style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                       Modifier
                    </button>
                </div>
            </form>
        </Modal.Body>
    </Modal>
</div>}
</>
       )
}

  

