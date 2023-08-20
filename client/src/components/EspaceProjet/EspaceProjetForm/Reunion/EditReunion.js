import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams } from "react-router-dom"
import Navbar from "../../../Page/Navbar";
import Sidebar from "../../../Page/Sidebar";
import Modal from 'react-bootstrap/Modal';
import Select  from "react-select";

export default function EditReunion() {
    const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
    const { idR } = useParams()
    const { projetRole } = useParams() 
    const [projet,setProjet]= useState([])
    const [projets,setProjets]= useState([])
    const [projetsUser,setProjetsUser]= useState([])
    const [show, setShow] = useState(false);
    const [titre,setTitre]= useState("")
    const [lien,setLien]= useState("")
    const [description,setDescription]= useState("")
    const [date,setDate]= useState("")
    const [annule,setAnnule]= useState("")
    const [annulé,setAnnulé]= useState("")
    const [raison,setRaison]= useState("")
    const [heureDébut,setHeureDébut]= useState("")
    const [heureFin,setHeureFin]= useState("")
    const [error,setError]= useState("")
    const [usersId,setUsersId]= useState([])
    const [users,setUsers]= useState([])
    const [usersReunion,setUsersReunion]= useState([])
    const [reunion,setReunion]= useState([])
   
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
    const change = (e) =>{  if(role==="ROLE_ADMIN"){window.location=`/réunion/${e}`} else{window.location=`/réunion/${e}/${projetRole}`};}
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
    setLien(`http://localhost:3000/room/${id}/${result}/${idR}`);
        }
        

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
                  "annule":annulé,
                  "raison":raison,
                 
                }
            Axios.post(`http://localhost:8000/updateReunion/${idR}`, formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
              .then((res) => { 
                if(role==="ROLE_ADMIN"){window.location=`./${idR}`} else{  window.location=`./${idR}`};
           
           })
              .catch((err) => setError(err.response.data.danger))
          }
 
        //la reunion d'un utilisateur du projet courant
    const getReunion = (async () => {
            await Axios.get(`http://localhost:8000/reunion/${user.id}/${idR}`)
            .then((response)=>{
            setReunion(response.data.reunion)
            setTitre(response.data.reunion[0].reunion.titre)
            setLien(response.data.reunion[0].reunion.lien)
            setDescription(response.data.reunion[0].reunion.description)
            setDate(response.data.reunion[0].reunion.date)
            setHeureDébut(response.data.reunion[0].reunion.heureDebut)
            setHeureFin(response.data.reunion[0].reunion.heureFin)
            setRaison(response.data.reunion[0].reunion.raisonAnnulation)
            setAnnule(response.data.reunion[0].reunion.annule)
            setAnnulé(response.data.reunion[0].reunion.annule)
            setUsersReunion(response.data.reunionUser)
            setIsLoding(false);
            const options = [];
            (response.data.reunionUser).map((item, index) => {
                if(item.user.role!=="chefProjet"){
                    options.push({
                    label: item.user.user.username+" "+item.user.user.lastname+" ("+item.user.role+")",value: item.user.id})}
                  });
                  setUsersId(options)})  });
        useEffect( () => {getReunion();
        },[]) ;  
     
    //delete une réunion 
  const onSubmitDeleteHandler = () => {
    if (window.confirm("Voulez-vous supprimer définitivement cette réunion ?"))
    {Axios.post(`http://localhost:8000/deleteRéunion/${idR}`).then((response)=>{
    if(role==="ROLE_ADMIN"){window.location=`/réunion/${id}`} else{  window.location=`/réunion/${id}/${projetRole}`};})}
    }  
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
           
              <div class="content-wrapper">
              {role==="ROLE_ADMIN"&&
                <Link to={ `/réunion/${id}`} style={{textDecoration:"none",color:"black"}}  >
                <>
                   <span  style={{fontWeight:"bold",fontSize:"13px"}} class="me-4 "> <i class="fa fa-arrow-left "></i> Retour</span>            </>
                </Link>}
                {role!=="ROLE_ADMIN"&&
                <Link to={ `/réunion/${id}/${projetRole}`} style={{textDecoration:"none",color:"black"}}  >
                 <>
                    <span  style={{fontWeight:"bold",fontSize:"13px"}} class="me-4 "> <i class="fa fa-arrow-left "></i> Retour</span>
                 </>
                </Link>}
              <div class="card card-rounded mt-2" style={{borderRadius:"2px"}} >
               <div class="card-body">
          
              {projetRole==="chefProjet"&&projet.archive===false&&
                 <>
                   {    error &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{error } </p>}
              <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} >
              <div class="row">
                    <div class="col-6">
                    <div class="col-12">
                            <div class="row">
                                <div class="col-6">
                                   <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre <span style={{color:"red"}}>*</span></label>
                                        <input className="form-control  form-icon-input" name="titre"  type="text" value={titre} onChange={(e)=>setTitre(e.target.value)} placeholder="saisir titre de la réunion" pattern=".{3,}" title="3 caractères ou plus"required="required"/>
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
                             <br></br><textarea className="" name="description"  rows="4" cols="70" value={description}  onChange={(e)=>setDescription(e.target.value)} placeholder="saisir description d'une réunion " pattern=".{3,}" title="3 caractères ou plus"required="required"></textarea>
                        </div>
                    </div>
                </div>
                <div class="row">
                   <div class="col-6">
                       <div class="row">
                           <div class="col-6">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Heure début <span style={{color:"red"}}>*</span></label>
                                    <input className="form-control  form-icon-input" name="heureDebut" type="time" value={heureDébut}  onChange={(e)=>setHeureDébut(e.target.value)} required="required"/>
                                </div>
                            </div>
                            <div class="col-6">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Heure fin <span style={{color:"red"}}>*</span></label>
                                    <input className="form-control  form-icon-input" name="heureFin" type="time" value={heureFin} onChange={(e)=>setHeureFin(e.target.value)}  required="required"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Participants (Vous êtes un participant par défaut)</label>
                            <Select isMulti options={optionso} value={usersId}   onChange={setUsersId} labelledBy={"Select"}      overrideStrings={{
                                  selectSomeItems: "Choisir le(s) participant(s)",

                                }}
                                className="select fs-9" />
                        </div>
                    </div>
                </div>
                <div class="row">
                   <div class="col-6">
                       <div class="row">
                { annule===false&&
                            <>
                                <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Annulée </label>
                                       <div class="mb-2" >
                                           <input  className="form-check-input m-1 " type="radio" id="input1" value="oui" name="annulé"  onChange={(e)=>setAnnulé(true)} checked={annulé===true&&"true"}  />
                                           <label class="form-check-label m-1 me-3" for="flexRadioDefault2">Oui</label>
                                       
                                           <input  className="form-check-input m-1" type="radio" id="input1" value="non" name="annulé"  onChange={(e)=>setAnnulé(false)} checked={annulé===false&&"true"}/>
                                           <label class="form-check-label  m-1" for="flexRadioDefault2">Non</label>
                                        </div>
                                    </div>                     
                                </div> 
                                {annulé ===true&&
                                  <>
                                  
                                  <div class="col-6">
                                  <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison d'annulation </label>
                                  <div class="mb-2" >
                                  <input className="form-control  form-icon-input"  name="raison"  type="text" value={raison} onChange={(e)=>setRaison(e.target.value)} placeholder="saisir le raison d'annulation"  />
                                      </div>
                                  </div>                     
                              </div></>}
                                </>}

                                {annule ===true&&
                                  <>
                                  <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Annulée </label>
                                       <div class="mb-2" >
                                           <input  className="form-check-input m-1 " type="radio" id="input1" value="oui" name="annulé" checked   />
                                           <label class="form-check-label m-1 me-3" for="flexRadioDefault2">Oui</label>
                                          
                                           <input  className="form-check-input m-1" type="radio" id="input1" value="non" name="annulé" disabled/>
                                           <label class="form-check-label  m-1" for="flexRadioDefault2">Non</label>
                                        </div>
                                    </div>                     
                                </div> 
                                  <div class="col-6">
                                  <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison d'annulation </label>
                                  <div class="mb-2" >
                                  <input className="form-control  form-icon-input"  name="raison"  type="text" value={raison} onChange={(e)=>setRaison(e.target.value)} placeholder="saisir le raison d'annulation"  />
                                      </div>
                                  </div>                     
                              </div></>} 
                            </div> 
                        </div> 
                     </div> 
                <div class="mt-4" style={{ textAlign:"right" }}>
                   <button type="button" class="btn me-2"  onClick={onSubmitDeleteHandler}  style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                    Supprimer
                  </button>
                    <button type="submit" class="btn ps-3"    disabled={(!titre||!lien||!heureDébut||!heureFin||!date||(annulé===true&&!raison)) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Modifier
                  </button>
                </div>
              </form></>}
            </div>
        </div>
    </div>
    </div>
        </div>
    </div>
}

</>
       )
}

  

