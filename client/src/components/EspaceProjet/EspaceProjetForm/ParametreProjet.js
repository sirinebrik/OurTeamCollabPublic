import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { MultiSelect } from "react-multi-select-component";
import { Link,useNavigate,useParams } from "react-router-dom"
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"
import { Checkbox } from 'pretty-checkbox-react';
import Modal from 'react-bootstrap/Modal';

export default function ParametreProjet() {
    const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
    const { projetRole } = useParams()
    const [projet,setProjet]= useState([])
    const [projets,setProjets]= useState([])
    const [projetsUser,setProjetsUser]= useState([])
    const [nom, setNom] = useState("") 
    const [description, setDescription] = useState("")  
    const [dateDebut, setDateDébut] = useState("")  
    const [dateFin, setDateFin] = useState("") 
    const [document, setDocument] = useState("")  
    const [documentP, setDocumentP] = useState("")  
    const [archivé,setArchivé]= useState("")
    const [typeSelect,setTypeSelect]= useState("informations")
    const [usersProjet,setUsersProjet]= useState([])
    const [i,setI]= useState(0)
    const [show, setShow] = useState(false);
    const [showM, setShowM] = useState(false);
    const [error, setError] = useState('');
    const handleShow = () => setShow(true);
    const handleClose = () => {setShow(false)}
    const handleShowM = () => setShowM(true);
    const handleCloseM = () => {setShowM(false);setUsersChecked(usersCheckedDétail)}
    let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]
    const [usersChecked,setUsersChecked]= useState([])
   const [usersCheckedDétail,setUsersCheckedDétail]= useState([])
    const getProjet = (async () => {
        await Axios.get(`http://localhost:8000/indexProjet/${id}`)
        .then((response)=>{
        setProjet(response.data.projet[0])
        setNom(response.data.projet[0].nom)
        setDescription(response.data.projet[0].description)
        setDateFin(response.data.projet[0].dateFin)
        setDateDébut(response.data.projet[0].dateDebut)
        setDocument(response.data.projet[0].document)
        setArchivé(response.data.projet[0].archive)
        setIsLoding(false);
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
        let checked=[]
        response.data.projet.map((item,index)=>{
            if((item.user.roles)[0]==="ROLE_MEMBRE"){
                if(item.role==="membre"){
                    setI(1);
                checked.push({
                    nom:item.user.username+" "+item.user.lastname,
                    id:item.user.id,
                    role:item.role,
                    roles:(item.user.roles)[0],
                    checked:false,
                    checkedM:true             
                 })   
            }
            if(item.role==="chefProjet"){
                checked.push({
                    nom:item.user.username+" "+item.user.lastname,
                    id:item.user.id,
                    role:item.role,
                    roles:(item.user.roles)[0],
                    checked:true,
                    checkedM:false             
                 })   
            }
        }
            if((item.user.roles)[0]==="ROLE_CHEFPROJET"||(item.user.roles)[0]==="ROLE_CLIENT"){
            checked.push({
                nom:item.user.username+" "+item.user.lastname,
                id:item.user.id,
                role:item.role,
                roles:(item.user.roles)[0],
                checked:true,
                checkedM:false             
             })}
            setUsersChecked(checked)})
        setUsersCheckedDétail(checked)
            })  });
    useEffect( () => {getDetailProjet();},[]);
    
   
         
    const handleCheckboxS= (e,role,checked,checkedM) => {
        const newList = usersChecked.map((item) => {
            if (item.id === e) {
                if(item.roles==="ROLE_MEMBRE"&&role==="membre"){
                    if(checked===true){
                    const updatedItem = {
                        ...item,
                        checkedM: !item.checkedM,
                        checked: !item.checked,
                        role: role,
                      };
                      return updatedItem;
                    }
                    else{
                        const updatedItem = {
                            ...item,
                            checkedM: !item.checkedM,
                            role: role,
                          };
                          return updatedItem;}}
                    if(item.roles==="ROLE_MEMBRE"&&role==="chefProjet"){
                        if(checkedM===true){
                        const updatedItem = {
                            ...item,
                            checkedM: !item.checkedM,
                            checked: !item.checked,
                            role: role,
                          };
                          return updatedItem;
                        }
                        else{
                            const updatedItem = {
                                ...item,
                                checked: item.checked,
                                role: role,
                              };
                              return updatedItem;}
                    }
                
                
               
              }return item;
          });
        
         setUsersChecked(newList);
        }       
       
    //tous les projets pour Admin
    const getProjets = (async () => {
        await Axios.get(`http://localhost:8000/projet/acces/${user.org}`).then((response)=>{
         setProjets(response.data.projet)
        })  });
        useEffect( () => {getProjets();},[]) ;
    let proj=[]
    if(role==="ROLE_ADMIN") {proj = projets.filter(f => (f.id !== projet.id ))}
    else {proj = projetsUser.filter(f => (f.projet.id !== projet.id ))}
  const change = async(e) =>{  
    await Axios.get(`http://localhost:8000/indexProjet/${e}`
    )
    .then((response)=>{
       Axios.get(`http://localhost:8000/indexProjetU/${e}/${user.id}`)
      .then((response1)=>{
  if(response.data.projet[0].archive===true &&(response1.data.projet[0].role==="chefProjet"||response1.data.projet[0].role==="membre"||response1.data.projet[0].role==="client"))
  {   window.location=`/detailProjet/${e}/${response1.data.projet[0].role}`}
  if(response.data.projet[0].archive===true &&role==="ROLE_ADMIN"){   window.location=`/detailProjet/${e}`}
  if(response.data.projet[0].archive===false &&role==="ROLE_ADMIN"){   window.location=`/parametreProjet/${e}`}
  if(response.data.projet[0].archive===false &&(response1.data.projet[0].role==="membre"||response1.data.projet[0].role==="client")){   window.location=`/detailProjet/${e}/${response1.data.projet[0].role}`}
  if(response.data.projet[0].archive===false &&response1.data.projet[0].role==="chefProjet"){   window.location=`/parametreProjet/${e}/${response1.data.projet[0].role}`}
})})}

    //file
    const handleDocument = (file) => {
        setDocumentP(file[0]);
      };

const onSubmitHandler = (e) => {
    e.preventDefault()
     const formData ={
          "nom" : nom,
          "description":description,
          "dateDebut":dateDebut,
          "dateFin":dateFin,
          "document":documentP,
          "archivé":archivé,}
    Axios.post(`http://localhost:8000/updateProjet/${id}`, formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
      .then((res) => { 
        if(archivé===false){
        if(role==="ROLE_ADMIN"){window.location=`./${id}`} else{  window.location=`./${projetRole}`}}
       else{
            if(role==="ROLE_ADMIN"){window.location=`/detailProjet/${id}`} else{  window.location=`/detailProjet/${id}/${projetRole}`}};
    })

    .catch((err) => setError(err.response.data.danger))
  }
  const onSubmitHandlerUser = (e) => {
    e.preventDefault()
     const formData ={
          "users" :usersChecked,
         }
    Axios.post(`http://localhost:8000/updateProjetUsers/${id}`, formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
      .then((res) => { 
        if(role==="ROLE_ADMIN"){window.location=`./${id}`} else{  window.location=`./${projetRole}`};
      
    })
      .catch((err) => {})
  }
  console.error = () => {}
  //supprimer un document     
  const supprimerDocument =() =>{
    if (window.confirm("Voulez-vous supprimer ce document ?")){
                             Axios.post(`http://localhost:8000/supprimerDocument/${id}`)
                             if(role==="ROLE_ADMIN"){window.location=`./${id}`} else{  window.location=`./${projetRole}`};}}
 
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
                           {role==="ROLE_ADMIN"&&
                                <Link class="nav-link test"  to={ `/parametreProjet/${id}`}  style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px"}} >
                                   <i class="fa fa-fw fa-cog "></i>
                                   <span> Paramètres</span>
                                </Link>}
                          {
                            projetRole==="chefProjet"&&
                                <Link class="nav-link test"  to={ `/parametreProjet/${id}/${projetRole}`} style={{textDecoration:"none" ,color:"white",fontWeight:"bold",fontSize:"15px" }} >
                                    <i class="fa fa-fw fa-cog "></i>
                                    <span> Paramètres</span>
                                </Link>}
                         {(projetRole==="client"||projetRole==="membre")&&
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
            <div class="mt-3 " style={{color:'white' ,borderColor:"#06868D",textAlign:"center" }}>
                <ul class="nav " >
                    <li class="nav-item">
                        {typeSelect==="informations"&&
                        <button  class="nav-link border border-top-0 border-end-0  border-start-0 border-bottom-0"  onClick={ (e) =>  {setTypeSelect("informations");setError(""); setDateFin(projet.dateFin);setDateDébut(projet.dateDebut);setNom(projet.nom)}}   style={{color:"#06868D",backgroundColor:"white",fontWeight:"bold",fontSize:"14px" ,borderRadius:"2px"}}>
                            <span class="menu-title" > Informations</span>
                        </button>}
                        {typeSelect==="droitAccés"&&
                        <button type="button" class="nav-link border border-top-0 border-end-0 border-start-0 border-bottom-0"  onClick={ (e) =>  {setTypeSelect("informations");setError(""); setDateFin(projet.dateFin);setDateDébut(projet.dateDebut);setNom(projet.nom)}}   style={{color:"#06868D",fontSize:"14px",fontWeight:"bold",borderRadius:"2px"}}>
                            <span class="menu-title" > Informations</span>
                        </button>}
                    </li>
                    <li class="nav-item">
                        {typeSelect==="droitAccés"&&
                        <button  class="nav-link border border-top-0 border-end-0  border-start-0 border-bottom-0"  onClick={ (e) =>  {setTypeSelect("droitAccés");setError(""); setDateFin(projet.dateFin);setDateDébut(projet.dateDebut);setNom(projet.nom)}}   style={{color:"#06868D",backgroundColor:"white",fontWeight:"bold",fontSize:"14px" ,borderRadius:"2px"}}>
                            <span class="menu-title" > Droits d'accès</span>
                        </button>}
                        {typeSelect==="informations"&&
                        <button type="button" class="nav-link border border-top-0 border-end-0 border-start-0 border-bottom-0"  onClick={ (e) =>  {setTypeSelect("droitAccés");setError(""); setDateFin(projet.dateFin);setDateDébut(projet.dateDebut);setNom(projet.nom)}}   style={{color:"#06868D",fontSize:"14px",fontWeight:"bold",borderRadius:"2px" }}>
                            <span class="menu-title" > Droits d'accès</span>
                        </button>}
                    </li>
                   
                </ul>
            </div> 
            <div class="card card-rounded " style={{borderRadius:"2px"}} >
            <div class="card-body">
            <div class="row">
            <div class="col-lg-12">
        {typeSelect==="informations"&&
        <>
        {    error &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{error }<br/><br/> </p>}

            <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} >
               <div class="row">
                   <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Nom de projet <span style={{color:"red"}}>*</span></label>
                            <input className="form-control  form-icon-input" value={nom} name="nom"  type="text" onChange={(e)=>setNom(e.target.value)} placeholder="saisir nom de projet" pattern=".{3,}" title="3 caractères ou plus"required="required"/>
                        </div>
                        <div class="col-12">
                            <div class="row">
                                <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de début <span style={{color:"red"}}>*</span></label>
                                       <input className="form-control   form-icon-input" name="dateDebut" type="date" value={dateDebut}  onChange={(e)=>setDateDébut(e.target.value)} required="required"/>
                                    </div>
                                </div>
                                 <div class="col-6">
                                    <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Date de fin <span style={{color:"red"}}>*</span></label>
                                         <input className="form-control  form-icon-input" name="dateFin" type="date" value={dateFin} onChange={(e)=>setDateFin(e.target.value)}  required="required"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Description de projet <span style={{color:"red"}}>*</span></label>
                            <br></br><textarea className="" name="description"  value={description} rows="4" cols="70"  onChange={(e)=>setDescription(e.target.value)} placeholder="saisir description de projet" pattern=".{3,}" title="3 caractères ou plus"required="required"></textarea>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        {document&&
                        <div class="row">
                            <div class="col-8">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Changer le document </label>
                                    <div class="mb-2" >
                                      <input className="form-control"  type="file" id="document"  name="document" onChange={e => handleDocument(e.target.files)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-2">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}> </label>
                                    <div class="mb-2" >
                                       <button title="Détail d'un document" type="button" className="btn mt-1  pt-2 pb-2 ps-3 " onClick={handleShow}  style={{ backgroundColor:"white", borderColor:"#06868D", color:"#06868D" ,fontSize:"12px",fontWeight:"bold" ,marginLeft:"50px"}}>
                                          <i style={{ fontSize:"14px" }} class="fa fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-2">
                                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}> </label>
                                    <div class="mb-2" >
                                        <button title="Supprimer un document" type="button" className="btn mt-1 ms-4 pt-2 pb-2 ps-3" onClick={supprimerDocument}  style={{ backgroundColor:"white", borderColor:"red", color:"red" ,fontSize:"12px",fontWeight:"bold" }}>
                                          <i style={{ fontSize:"14px" }} class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {!document&&
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Changer le document </label>
                            <div class="mb-2" >
                               <input className="form-control"  type="file" id="document"  name="document" onChange={e => handleDocument(e.target.files)} />
                            </div>
                        </div>
                        }
                    </div> 
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Archivé <span style={{color:"red"}}>*</span></label>
                           <div class="mb-2" >
                               <input  className="form-check-input m-1 " type="radio" id="input1" value="true" name="archivé"  onChange={(e)=>setArchivé(true)}  checked={(archivé===true) &&true}  />
                               <label class="form-check-label m-1" for="flexRadioDefault2">Oui</label>
                            
                               <input  className="form-check-input m-1 ms-5" type="radio" id="input1" value="false" name="archivé"  onChange={(e)=>setArchivé(false)} checked={(archivé===false) &&true}/>
                               <label class="form-check-label  m-1" for="flexRadioDefault2">Non</label>
                            </div>
                        </div>
                    </div> 
                </div>
               
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn pe-4 ps-4"    disabled={(!description ||!nom||!dateDebut||!dateFin) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                       Modifier
                    </button>
                </div>
            </form> </>}
            {typeSelect==="droitAccés"&&
            < >
                 <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Utilisateur</th>
                          <th> </th>
                          <th> </th>
                          <th> </th>
                          <th> </th>
                          <th> </th>
                          <th>Chef de Projet</th>
                          <th>Membre</th>
                          <th>Client</th>
                        </tr>
                      </thead>
                      <tbody  >
                     { usersCheckedDétail.map((item,index)=>(
                        <tr  >
                          <td ><div class="ms-4">{item.nom}</div></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                          {(item.roles==="ROLE_CHEFPROJET"&&item.role==="chefProjet")&&
                              <div class="form-check" style={{marginLeft:"40px",marginTop:"0px",marginBottom:"0px"}} >
                                <Checkbox key={index}  checked={item.checked} />
                              </div>}
                              {(item.roles==="ROLE_MEMBRE"&&item.role==="chefProjet")&&
                              <div class="form-check" style={{marginLeft:"40px",marginTop:"0px",marginBottom:"0px"}} >
                                <Checkbox key={index}  checked={item.checked} />
                              </div>}
                            
                            
                          </td>
                          <td> {(item.roles==="ROLE_MEMBRE"&&item.role==="membre")&&
                              <div class="form-check" style={{marginLeft:"20px",marginTop:"0px",marginBottom:"0px"}} >
                                <Checkbox key={index}  checked={item.checkedM} />
                              </div>}
                          </td>
                          <td>
                          {item.role==="client"&&
                              <div class="form-check" style={{marginLeft:"16px",marginTop:"0px",marginBottom:"0px"}}> 
                                <Checkbox key={index}  checked={item.checked} />
                              </div>}
                          </td>
                        </tr>))}
                      </tbody>
                    </table>
                  </div>
                  {i===1&&
                  <div class="mt-4" style={{ textAlign:"right" }}>
                    <button  class="btn pe-4 ps-4" onClick={handleShowM}  style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                    Retirer le(s) membre(s)
                    </button>
                </div>}
            </>}
            </div>
            </div>
            </div>
            </div>
            </div>
        </div>
    </div>
</div>}
<Modal show={show} >
        <Modal.Header  >
          <Modal.Title>Détail d'un document
            <button  onClick={handleClose} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"247px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {document&&
                <iframe  src= {require(`../../../assets/uploads/`+document)} allow="autoplay; encrypted-media" allowfullscreen id="frame" width="450" height="430"></iframe>
                }
        </Modal.Body>
    </Modal>
    <Modal show={showM}  >
        <Modal.Header  >
          <Modal.Title>Retirer le(s) membre(s)
            <button  onClick={handleCloseM} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"240px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form  enctype="multipart/form-data" onSubmit={onSubmitHandlerUser} >
                 <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Utilisateur</th>
                          <th> </th>
                          <th> </th>
                          <th> </th>
                          <th> </th>
                          <th> </th>
                          <th>Actions</th>
                         
                        </tr>
                      </thead>
                      <tbody  >
                     { usersChecked.map((item,index)=>(
                        <>
                        {item.roles==="ROLE_MEMBRE"&&item.role==="membre"&&
                        <tr  >

                          <td ><div class="ms-4">{item.nom}</div></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          
                          <td> 
                              <div class="form-check" style={{marginLeft:"20px",marginTop:"0px",marginBottom:"0px"}} >
                                <Checkbox key={index}  checked={item.checkedM} onChange={() => handleCheckboxS(item.id,"membre",item.checked,item.checkedM)}/>
                              </div>
                         </td>
                         
                        </tr>}</>))}
                      </tbody>
                    </table>
                  </div>
                  <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn pe-4 ps-4"   style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                       Retirer
                    </button>
                </div>
            </form>
        </Modal.Body>
    </Modal>
</>
       )
}

  

