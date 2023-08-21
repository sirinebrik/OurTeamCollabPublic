import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { MultiSelect } from "react-multi-select-component";
import { Link,useNavigate,useParams } from "react-router-dom"
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"
import { Checkbox } from 'pretty-checkbox-react';
import { EtatProjet} from './EtatProjet'
import Modal from 'react-bootstrap/Modal';
import Phase from "./Phase";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Carousel, Card, Stack, Button } from "react-bootstrap";
import Calendrier from "./Calendrier";
import List from "./List";

export default function PhaseProjet() {
    const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
    const { projetRole } = useParams() 
    const [projet,setProjet]= useState([])
    const [projets,setProjets]= useState([])
    const [projetsUser,setProjetsUser]= useState([])
    const [phases,setPhases]= useState([])
    const [etats,setEtats]= useState([])
    const [idPhase,setIdPhase]= useState("")
    const [titre,setTitre]= useState("")
    const [typeSelect,setTypeSelect]= useState("")
    const [show, setShow] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showList, setShowList] = useState(false);
    const [nb, setNb] = useState(0);
    const [error, setError] = useState("");
   
    const handleShow = () => setShow(true);
    const handleClose = () => {setShow(false);setError("");setTitre("")}
    const handleShowCalendar = () => setShowCalendar(true);
    const handleCloseCalendar = () => {setShowCalendar(false)}
    const handleShowList = () => setShowList(true);
    const handleCloseList = () => {setShowList(false)}
  
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
    //tous les phases de ce projet courant
  const getPhases = (async () => {
        await Axios.get(`http://localhost:8000/phase/${id}`
      )
        .then((response)=>{
           setTypeSelect(response.data.phase[0].id)
           setIdPhase(response.data.phase[0].id)
           setNb(response.data.nb)
        setPhases(response.data.phase) 
        setIsLoding(false);
        })  });

    useEffect( () => {getPhases();},[]);
      //tous les etats par phase
    const getEtats = (async () => {
        await Axios.get(`http://localhost:8000/etat/${idPhase}`
      )
        .then((response)=>{
        setEtats(response.data.etat)
        })  });
    useEffect( () => {getEtats ();},[]);
   
//tous les projets pour Admin
    const getProjets = (async () => {
        await Axios.get(`http://localhost:8000/projet/acces/${user.org}`).then((response)=>{
         setProjets(response.data.projet)
        })  });
        useEffect( () => {getProjets();},[]) ;
    let proj=[]
    if(role==="ROLE_ADMIN") {proj = projets.filter(f => (f.id !== projet.id ))}
    else {proj = projetsUser.filter(f => (f.projet.id !== projet.id ))}
    const change = async(e) =>{ if(role==="ROLE_ADMIN"){window.location=`/tâcheProjet/${e}`} else{
        await Axios.get(`http://localhost:8000/indexProjetU/${e}/${user.id}`)
            .then((response)=>{
               window.location=`/tâcheProjet/${e}/${response.data.projet[0].role}`
             }) ;
        };}
//ajout une phase
const onSubmitHandler = (e) => {
    e.preventDefault()
     const formData ={
          "titre" : titre
       }
    Axios.post(`http://localhost:8000/ajouterPhase/${id}`, formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
      .then((res) => { 
        if(role==="ROLE_ADMIN"){window.location=`./${id}`} else{  window.location=`./${projetRole}`};
   
   })
   .catch((err) => setError(err.response.data.danger))
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
                                <select  style={{fontSize:"19px",fontWeight:"bold"}} onChange={ (e) =>{change(e.target.value)}} class="form-select border border-top-0 border-end-0 border-start-0">
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
                        <Link class="nav-link test "  to={ `/tâcheProjet/${id}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }}>
                           <i class="fa fa-fw fa-check"></i>
                           <span class="menu-title"> Tâches</span>
                        </Link>}
                    {(role==="ROLE_CLIENT"||role==="ROLE_MEMBRE"||role==="ROLE_CHEFPROJET")&&
                        <Link class="nav-link test "  to={ `/tâcheProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }}>
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
            <div  style={{backgroundColor:"#f4f5f7" }}>
                <div  style={{color:'white' ,borderColor:"#06868D",textAlign:"center" }}>
                {projetRole==="chefProjet"&&
                    <div class="row   ">
                        <div class="col-7"></div>
                        <div class="col-5">
                            <div class="row ">
                                <div class="col-4">
                                </div>
                                <div class="col-1">
                                   <button class=" btn type" title=" Liste" style={{color:"#06868D" ,padding:"12px"}}><i class="fa fa-fw fa-list" style={{fontSize:"22px"}}  onClick={ (e) =>  {handleShowList()}}  ></i></button> 
                                </div>
                                <div class="col-1">
                                   <button class=" btn type" title=" Calendrier" style={{color:"#06868D" ,padding:"12px"}}><i class="fa fa-fw fa-calendar" style={{fontSize:"22px"}}  onClick={ (e) =>  {handleShowCalendar()}}  ></i></button> 
                                </div>
                                {projet.archive===false&&
                                <div class="col-6 mt-2">
                                    <button className="btn pt-2 pb-2 pe-4 ps-4"  onClick={ (e) =>  {handleShow()}} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}  >
                                        <i class="fa fa-fw fa-plus menu-title" style={{fontSize:"14px"}} > </i> Ajouter une phase
                                    </button>                    
                                </div>}
                            </div>
                        </div>
                    </div>}
                    {projetRole!=="chefProjet"&&
                    <div class="row   ">
                        <div class="col-7"></div>
                        <div class="col-5">
                            <div class="row ">
                                <div class="col-8">
                                </div>
                                <div class="col-4">
                                <button class=" btn type" title=" Liste" style={{color:"#06868D" ,padding:"12px"}}><i class="fa fa-fw fa-list" style={{fontSize:"22px"}}  onClick={ (e) =>  {handleShowList()}}  ></i></button> 

                                   <button class=" btn type" title=" Calendrier" style={{color:"#06868D" ,padding:"12px"}}><i class="fa fa-fw fa-calendar" style={{fontSize:"22px"}}  onClick={ (e) =>  {handleShowCalendar()}}  ></i></button> 
                  
                                </div>
                            </div>
                        </div>
                    </div>}
                    <CarouselProvider  totalSlides={nb} visibleSlides={6} > 
                    <div class="row mt-3">
                        <div class="col-11">
                       <Slider >
                           <ul class="nav "  >
                               {phases.map((item,index)=>
                                    <>
                                    <Slide index={index} >
                                        <li class="nav-item">
                                           {typeSelect===item.id&&
                                            <button type="button" class="nav-link border  border-top-0 border-end-0  border-start-0 border-bottom-0"  onClick={ (e) =>  {setTypeSelect(item.id);setIdPhase(item.id)}}   style={{color:"#06868D",backgroundColor:"white",fontWeight:"bold",fontSize:"14px" ,borderRadius:"2px"}}>
                                                <span  > {item.titre}</span>
                                            </button>}
                                           {typeSelect!=item.id&&
                                            <button type="button" class="nav-link  border border-top-0 border-end-0 border-start-0 border-bottom-0"  onClick={ (e) =>  {setTypeSelect(item.id);setIdPhase(item.id)}}   style={{color:"#06868D",backgroundColor:"#ebe6e6",fontSize:"14px",fontWeight:"bold",borderRadius:"2px"}}>
                                                <span  > {item.titre}</span>
                                            </button>}
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
                       {nb>6&&phases.length!==0&&
                        <div class="col-1">
                            <ButtonBack class=" border me-1 border-top-0 border-end-0  border-start-0 border-bottom-0" title="Back"><i class="fa fa-caret-left" style={{color:"#06868D",fontSize:"19px"}} ></i></ButtonBack>
                            <ButtonNext class=" border border-top-0 border-end-0  border-start-0 border-bottom-0" title="Next"><i class="fa fa-caret-right" style={{color:"#06868D",fontSize:"19px"}}></i></ButtonNext>
                            </div>}
                        </div>
                    </CarouselProvider>
                </div>  
                <div class="card card-rounded " style={{borderRadius:"2px"}} >
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-12">
                             {phases.length===0&&
                                <center style={{fontSize:"15px"}}> La liste des phases est vide.</center>}
                             {phases.length!==0&&
                                <>
                               {phases.map((item,index)=>      
                                    <>
                                 {item.id===idPhase&&
                                       <Phase id={idPhase} idP={id} titre={item.titre} projetRole={projetRole} archive={projet.archive}/>}
                                    </>)}
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Modal show={show} >
        <Modal.Header  >
          <Modal.Title>Ajouter une phase
            <button  onClick={handleClose} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"278px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {    error &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{error } </p>}
            <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} >
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Titre <span style={{color:"red"}}>*</span></label>
                    <input className="form-control  form-icon-input" name="titre"  type="text" onChange={(e)=>setTitre(e.target.value)} placeholder="saisir titre de phase" pattern=".{3,}" title="3 caractères ou plus"required="required"/>
                </div>
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"    disabled={(!titre) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Ajouter
                  </button>
              </div>
            </form>
        </Modal.Body>
    </Modal>


    <Modal show={showCalendar} size="xl" >
    <Modal.Header  >
          <Modal.Title>
          {projetRole==="membre"&&<span>Mes tâches</span>}
          {projetRole==="client"&&<span>Les tâches réalisées</span>}
          {projetRole!=="client"&&projetRole!=="membre"&&<span>Toutes les tâches </span>}

            <button  onClick={handleCloseCalendar} class="btn" style={{fontWeight:"bold" ,padding:"1px" ,paddingLeft:"900px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendrier idP={id} projetRole={projetRole}/>
        </Modal.Body>
    </Modal>
    <Modal show={showList} size="lg" scrollable  >
    <Modal.Header  >
          <Modal.Title>
          {projetRole==="membre"&&<span>Mes tâches</span>}
          {projetRole==="client"&&<span>Les tâches réalisées</span>}
          {projetRole!=="client"&&projetRole!=="membre"&&<span>Toutes les tâches </span>}

            <button  onClick={handleCloseList} class="btn" style={{fontWeight:"bold" ,padding:"1px" ,paddingLeft:"1008px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <List idP={id} projetRole={projetRole}/>
        </Modal.Body>
    </Modal>
    
    
</div>
}
</>
       )
}

  

