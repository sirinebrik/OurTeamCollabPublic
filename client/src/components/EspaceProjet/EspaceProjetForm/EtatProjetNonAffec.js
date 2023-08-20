/* eslint-disable no-unused-vars */
import React,{ useEffect, useState } from 'react'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import jwt_decode from "jwt-decode";
import Task from './Task';

export default function EtatProjetNonAffec({id,titre,idPh,idP,projetRole,archive,UpdateEtat,testStatus,testTask,type,typeResponsable}) {
    const navigate = useNavigate ()
    const [tasks,setTasks]= useState([])
    const [nb,setNb]= useState("")
    const [nbU,setNbU]= useState("")
    const [tasksUser,setTasksUser]= useState([])
    const [titreT,setTitreT]= useState("")
    const [descriptionT,setDescriptionT]= useState("")
    const [prioritéT,setPrioritéT]= useState("")
    const [userT,setUserT]= useState("")
    const [dateDebutT,setDateDébutT]= useState("")
    const [dateFinT,setDateFinT]= useState("")
    const [errorT, setErrorT] = useState("");
    const [showT, setShowT] = useState(false);
    const handleShowT = () => {setShowT(true);}
    const handleCloseT = () => {setShowT(false);setErrorT("")}
    let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]
 //tous les tasks par etat
 const getTasks = (async () => {
    await Axios.get(`http://localhost:8000/taskNonAffec/${id}`
  ).then((response)=>{
    setTasks(response.data.task) 
  setNb(response.data.nb)})  });
useEffect( () => {getTasks ();},[]);
 //tous les tasks par etat et par user
 const getTasksUser = (async () => {
    await Axios.get(`http://localhost:8000/taskUser/${id}/${user.id}`
  ).then((response)=>{
    setTasksUser(response.data.task) 
  setNbU(response.data.nb)})  });
useEffect( () => {getTasksUser ();},[]);
//update un etat
const handleUpdateEtat = () => {
 UpdateEtat(id,titre)
    }
//delete un etat
const onSubmitDeleteHandler = () => {
  if (window.confirm("Etes-vous sur de vouloir supprimer cet état ? Attention cette action est irréversible, et tous les contenus de cet état seront supprimés."))
 { Axios.post(`http://localhost:8000/deleteEtat/${id}`)
  if(role==="ROLE_ADMIN"){window.location=`./${idP}`} else{  window.location=`./${projetRole}`}};
  }
  let isFound =true
    if (titre === "À faire"||titre === "En cours"||titre === "Terminé"||titre === "Bloqué") {
      isFound= false;
    }
  //tous les users de ce projet
  const [users,setUsers]= useState([])
  
  const getUsers = (async () => {
    await Axios.get(`http://localhost:8000/usersProjet/${idP}`
  )
    .then((response)=>{
    setUsers(response.data.user)
  })  });
useEffect( () => {getUsers ();},[]);
const onSubmitHandler = (e) => {
  e.preventDefault()
   const formData ={
        "titre" : titreT,
        "description":descriptionT,
        "dateDebut":dateDebutT,
        "dateFin":dateFinT,
        "user":userT,
        "etat":id,
        "priorité":prioritéT,}
  Axios.post(`http://localhost:8000/ajouterTask`, formData,{
      headers: {
          "Content-Type": "multipart/form-data",
      }
  })
    .then((res) => { 
      if(role==="ROLE_ADMIN"){window.location=`./${idP}`} else{  window.location=`./${projetRole}`};
      handleCloseT();})
    .catch((err) => setErrorT(err.response.data.danger))
}  
console.error = () => {}
  return (
    <>
      <div class="row mb-2 ">
       {type==="Tous"&&
       <>
            <div style={{fontWeight:"bold" ,fontSize:"14px"}} class="col-5"> {titre} ({nb})</div>
            {projetRole==="chefProjet"&&archive===false&&
            <div class="col-7">
                <div class="row ">
                    <div class="col-7"></div>
                    <div class="col-5 ">
                      {isFound&&
                      <>
                        <button title="Modifier un état" type="button" href="" className='border   border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleUpdateEtat} style={{backgroundColor:"#f3f5f8"}}><i class="fa fa-edit" style={{fontSize:"16px",color:"orange"}}></i></button>
                        <button title="Supprimer un état" type="button" href="" className='border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={onSubmitDeleteHandler} style={{backgroundColor:"#f3f5f8"}}><i class="fa fa-trash" style={{fontSize:"16px",color:"red"}}></i></button>
                      </>}
                      
                    </div>
                </div>
            </div>}
        </>}
        {(type==="Mes")&&
        <> 
          <div style={{fontWeight:"bold" }} > {titre}   ({nbU})</div>
        </> }
        </div>
        <div>
           {projetRole==="chefProjet"&&archive===false&&
           <button title="Modifier un état" type="button" href="" className='mb-2 border  me-1 border-top-0 border-end-0  border-start-0 border-bottom-0'onClick={handleShowT} style={{backgroundColor:"#f3f5f8",color:"#06868D"}}><i class="fa fa-plus" ></i> Ajouter une tâche</button>
           }
       
           {((projetRole==="chefProjet"&&type==="Tous")||role==="ROLE_ADMIN"||projetRole==="client"||(projetRole==="membre"&&type==="Tous"))&&
            <>
            {tasks.map((item,index)=>
             <Task key={index} id={item.id} titre={item.titre} description={item.description} user={item.user&& item.user } 
            validé={item.valide} tauxAvancement={item.tauxAvancement} priorité={item.priorite} 
            dateDebut={item.dateDebut} dateFin={item.dateFin} raisonRefus={item.raisonRefus}
             idP={idP} projetRole={projetRole} archive={archive} idE={id} titreE={titre} idPh={idPh} problemeBlocage={item.problemeBlocage}/>
           
            )}</>}
            {((projetRole==="chefProjet"&&type==="Mes")||(projetRole==="membre"&&type==="Mes"))&&
            <>
             {tasksUser.map((item,index)=>
             <Task key={index} id={item.id} titre={item.titre} description={item.description} user={item.user&& item.user } 
            validé={item.valide} tauxAvancement={item.tauxAvancement} priorité={item.priorite} 
            dateDebut={item.dateDebut} dateFin={item.dateFin} raisonRefus={item.raisonRefus}
             idP={idP} projetRole={projetRole} archive={archive} idE={id} titreE={titre} idPh={idPh} problemeBlocage={item.problemeBlocage}/>
            
            )}</>}
        </div>
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
                      <input className="form-control  form-icon-input" name="dateDebut" type="date"   onChange={(e)=>setDateDébutT(e.target.value)} required="required"/>
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
                  <div class="col-6">
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
                <div class="row">
                  <div class="col-12">
                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Description d'une tâche <span style={{color:"red"}}>*</span></label>
                         <br></br><textarea className="" name="description"  rows="4" cols="70"  onChange={(e)=>setDescriptionT(e.target.value)} placeholder="saisir description d'une tâche " pattern=".{3,}" title="3 caractères ou plus"required="required"></textarea>
                    </div>
                  </div>
                </div>
                <div class="mt-1" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"    disabled={(!titreT||!descriptionT||!dateDebutT||!dateFinT||!prioritéT) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Ajouter
                  </button>
              </div>
            </form>
        </Modal.Body>
    </Modal>
    
       

    </>
  );       

  };

  
