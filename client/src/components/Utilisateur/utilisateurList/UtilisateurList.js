import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import "./UtilisateurList.css"
import jwt_decode from "jwt-decode";
import Utilisateur from "../utilisateur/Utilisateur";
import Navbar from "../../Page/Navbar"
import Sidebar from "../../Page/Sidebar"
export default function UtilisateurList() {
    const [isLoding, setIsLoding] = useState(true);
    let user = jwt_decode(localStorage.getItem("token"));
    let userRole=user.roles[0]
    const [typeSelect, setTypeSelect] = useState("tous")   
    const [show, setShow] = useState(false);
    const [ nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [sexe, setSexe] = useState("");
    const [role, setRole] = useState("");
    const [nomE, setNomE] = useState("");
    const [secteur, setSecteur] = useState("");
    const [secteurC, setSecteurC] = useState("");
    const [departement, setDepartement] = useState("");
    const [secteurClient, setSecteurClient] = useState("");
    const [secteurChefProjet, setSecteurChefProjet] = useState("");
    const [departementMembre, setDepartementMembre] = useState("");
    const [secteurs,setSecteurs]= useState([])
    const [error, setError] = useState("");
    const [modal, setModal] = useState(false);
    const [users,setUsers]= useState([])
    const [usersDésac,setUsersDésac]= useState([])
    const [membres,setMembres]= useState([])
    const [clients,setClients]= useState([])
    const [chefProjets,setChefProjets]= useState([])
    const [departementMembres,setDepartementMembres]= useState([])
    const [secteurClients,setSecteurClients]= useState([])
    const [secteurChefProjets,setSecteurChefProjets]= useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredUsersDésac,setFilteredUsersDésac]= useState([])
    const [filteredMembres,setFilteredMembres]= useState([])
    const [filteredClients,setFilteredClients]= useState([])
    const [filteredChefProjets,setFilteredChefProjets]= useState([])
    const [filteredDepartement,setFilteredDepartement]= useState([])
    const [filteredSecteurC,setFilteredSecteurC]= useState([])
    const [filteredSecteurCh,setFilteredSecteurCh]= useState([])
    const [search, setSearch] = useState("");

    function onKeyUpHandler(e) {
        setSearch(e);
      }
      useEffect(() => {
         // on fait le filtre et on modifie la liste (rendu)
             if(typeSelect==="tous"){
             const newData = filteredUsers.filter(function (item) {
                const itemData = item.username+" "+item.lastname
                    ? (item.username+" "+item.lastname).toUpperCase()
                    : ''.toUpperCase();
                const textData = search.toString().toUpperCase();
                return itemData.indexOf(textData) > -1;});
                setUsers(newData);
            }
                if(typeSelect==="tousDésac"){
            const newDataDésac = filteredUsersDésac.filter(function (item) {
                const itemDataDésac = item.username+" "+item.lastname
                        ? (item.username+" "+item.lastname).toUpperCase()
                        : ''.toUpperCase();
                const textDataDésac = search.toString().toUpperCase();
                return itemDataDésac.indexOf(textDataDésac) > -1;});
                setUsersDésac(newDataDésac);
            }
            if(typeSelect==="membre"){   
            const newDataMembres = filteredMembres.filter(function (item) {
                const itemDataMembres = item.utilisateur.username+" "+item.utilisateur.lastname
                            ? (item.utilisateur.username+" "+item.utilisateur.lastname).toUpperCase()
                            : ''.toUpperCase();
                const textDataMembres = search.toString().toUpperCase();
                return itemDataMembres.indexOf(textDataMembres) > -1;});
                  setMembres(newDataMembres);
            }
            if(typeSelect==="client"){   
            const newDataClients = filteredClients.filter(function (item) {
                const itemDataClients = item.utilisateur.username+" "+item.utilisateur.lastname
                        ? (item.utilisateur.username+" "+item.utilisateur.lastname).toUpperCase()
                        : ''.toUpperCase();
                const textDataClients = search.toString().toUpperCase();
                return itemDataClients.indexOf(textDataClients) > -1;});
                setClients(newDataClients);
            }
            if(typeSelect==="chefProjet"){      
            const newDatachefProjets = filteredChefProjets.filter(function (item) {
                const itemDatachefProjets = item.utilisateur.username+" "+item.utilisateur.lastname
                            ? (item.utilisateur.username+" "+item.utilisateur.lastname).toUpperCase()
                            : ''.toUpperCase();
                const textDatachefProjets = search.toString().toUpperCase();
                return itemDatachefProjets.indexOf(textDatachefProjets) > -1;});
                setChefProjets(newDatachefProjets);
            }
            if(typeSelect==="membre"&&departementMembre!==""){      
                const newDataDepartement = filteredDepartement.filter(function (item) {
                    const itemDataDepartement = item.utilisateur.username+" "+item.utilisateur.lastname
                                ? (item.utilisateur.username+" "+item.utilisateur.lastname).toUpperCase()
                                : ''.toUpperCase();
                    const textDataDepartement = search.toString().toUpperCase();
                    return itemDataDepartement.indexOf(textDataDepartement) > -1;});
                    setDepartementMembres(newDataDepartement);}
            if(typeSelect==="client"&&secteurClient!==""){      
                const newDataSecteurC = filteredSecteurC.filter(function (item) {
                     const itemDataSecteurC = item.utilisateur.username+" "+item.utilisateur.lastname
                                        ? (item.utilisateur.username+" "+item.utilisateur.lastname).toUpperCase()
                                        : ''.toUpperCase();
                    const textDataSecteurC = search.toString().toUpperCase();
                    return itemDataSecteurC.indexOf(textDataSecteurC) > -1;});
                    setSecteurClients(newDataSecteurC);}
            if(typeSelect==="chefProjet"&&secteurChefProjet!==""){      
                const newDataSecteurCh = filteredSecteurCh.filter(function (item) {
                        const itemDataSecteurCh = item.utilisateur.username+" "+item.utilisateur.lastname
                                                ? (item.utilisateur.username+" "+item.utilisateur.lastname).toUpperCase()
                                                : ''.toUpperCase();
                        const textDataSecteurCh = search.toString().toUpperCase();
                        return itemDataSecteurCh.indexOf(textDataSecteurCh) > -1;});
                        setSecteurChefProjets(newDataSecteurCh);}
         }, [search]);
    
    const handleClose = () => {setShow(false);
    setNom("")
    setPrenom("")
    setNomE("")
    setRole("")
    setSexe("")
    setEmail("")
    setSecteur("")
    setSecteurC("")
    setDepartement("")
    setModal(false);
    setError("");
}


const onSubmitHandler = (e) => {
    e.preventDefault()
     const formData ={
          "username" : prenom,
          "lastname":nom,
          "email":email,
          "sexe":sexe,
          "role":role,
          "departement":departement,
          "nomEntreprise":nomE,
          "secteur":secteur,
          "secteurC":secteurC,
        }
    Axios.post(`http://localhost:8000/inviter`, formData)
      .then((res) => { 
        setModal(true)
        setNom("")
        setPrenom("")
        setNomE("")
        setSexe("")
        setEmail("")
   
   })
      .catch((err) => setError(err.response.data.danger))
  }

  const handleShow = () => setShow(true);
  //les secteurs
  const getSecteurs = (async () => {
      await Axios.get("http://localhost:8000/secteur").then((response)=>{
         setSecteurs(response.data.secteur)})  
  });
   useEffect( () => {getSecteurs();},[]) ;

//les utilisateurs activés
   const getUsers = (async () => {
    await Axios.get(`http://localhost:8000/indexUser`).then((response)=>{
     setUsers(response.data.user)
     setFilteredUsers(response.data.user)
     setIsLoding(false);

    })  });
    useEffect( () => {getUsers();},[]) ;
//les utilisateurs désactivés
const getUsersDésac = (async () => {
    await Axios.get(`http://localhost:8000/indexUserDésac`).then((response)=>{
     setUsersDésac(response.data.user)
     setFilteredUsersDésac(response.data.user)
    })  });
    useEffect( () => {getUsersDésac();},[]) ;
//les membres
    const getMembres = (async () => {
        await Axios.get(`http://localhost:8000/indexMembre`).then((response)=>{
         setMembres(response.data.user)
         setFilteredMembres(response.data.user)
        })  });
        useEffect( () => {getMembres();},[]) ;
//les clients
    const getClients = (async () => {
            await Axios.get(`http://localhost:8000/indexClient`).then((response)=>{
             setClients(response.data.user)
             setFilteredClients(response.data.user)
            })  });
            useEffect( () => {getClients();},[]) ;
//les chefs de projets
    const getChefProjets = (async () => {
                await Axios.get(`http://localhost:8000/indexChefProjet`).then((response)=>{
                 setChefProjets(response.data.user)
                 setFilteredChefProjets(response.data.user)
                })  });
                useEffect( () => {getChefProjets();},[]) ;

//get membre par departement       
    const getDepartementMembres = (async () => {
               await Axios.get(`http://localhost:8000/departementMembre/${departementMembre}`).then((response)=>{
                           setDepartementMembres(response.data.user);
                           setFilteredDepartement(response.data.user) })  });
//get client par secteur                   
    const getSecteurClients = (async () => {
            await Axios.get(`http://localhost:8000/secteurClient/${secteurClient}`).then((response)=>{
                              setSecteurClients(response.data.user)
                              setFilteredSecteurC(response.data.user)})  });
                           
//get chef projet par secteur               
     const getSecteurChefProjets = (async () => {
             await Axios.get(`http://localhost:8000/secteurChefProjet/${secteurChefProjet}`).then((response)=>{
                              setSecteurChefProjets(response.data.user)
                              setFilteredSecteurCh(response.data.user) })  });
                          

    const Désactive =(id) =>{
           if (window.confirm("Voulez-vous désactiver cet utilisateur ?"))
                                    Axios.post(`http://localhost:8000/désactiveUser/${id}`)
                                    }
    const Active =(id) =>{
        if (window.confirm("Voulez-vous activer cet utilisateur ?"))
                     Axios.post(`http://localhost:8000/activeUser/${id}`)
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
                <div class="content-wrapper">
   <div  style={{textAlign:"right",}}>
        <div class="row mb-4">
         {userRole==="ROLE_ADMIN"&&<>
            <div class="col-7"></div>
            <div class="col-5">
                <div class="row ">
                    <div class="col-6">
                        <div className="form-icon-container2 ">
                            <input className="form-control  form-icon-input2" value={search} name="filter"  type="text" onChange={(text) => {onKeyUpHandler(text.target.value)}} placeholder="Recherche" style={{paddingTop:"9px",paddingBottom:"9px" ,borderColor:"#06868D"}}/>
                            <span className="fa fa-search text-900 fs--1 form-icon2"></span>
                         </div>  
                    </div>
                    <div class="col-6">
                       <button type="button" className="btn pt-2 pb-2 pe-4 ps-4 " onClick={handleShow} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}><i class="fa fa-fw fa-plus" style={{fontSize:"14px"}}></i> Inviter un utilisateur</button>
                    </div>
                </div>
            </div>
            </>}
            {(userRole==="ROLE_MEMBRE"||userRole==="ROLE_CHEFPROJET"||userRole==="ROLE_CLIENT")&&<>
            <div class="col-7"></div>
            <div class="col-5">
                <div class="row ">
                    <div class="col-6">
                    </div>
                    <div class="col-6">
                        <div className="form-icon-container2 ">
                            <input className="form-control  form-icon-input2" value={search} name="filter"  type="text" onChange={(text) => {onKeyUpHandler(text.target.value)}} placeholder="Recherche" style={{paddingTop:"9px",paddingBottom:"9px" ,borderColor:"#06868D"}}/>
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
                    <button  class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("tous");setDepartementMembre("");setSecteurChefProjet("");setSecteurClient("");setSearch("");getUsersDésac();getMembres();getChefProjets();getClients()}}   style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                        <span class="menu-title" > Tous les utilisateurs</span>
                    </button>}
                    {(typeSelect==="chefProjet"||typeSelect==="membre"||typeSelect==="client"||typeSelect==="tousDésac")&&
                    <button type="button" class="nav-link border border-top-0 border-end-0 border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("tous");setDepartementMembre("");setSecteurChefProjet("");setSecteurClient("");setSearch("");getUsersDésac();getMembres();getChefProjets();getClients()}}   style={{color:"#06868D",fontSize:"14px", borderBottom: "4px solid black" }}>
                        <span class="menu-title" > Tous les utilisateurs</span>
                    </button>}
                </li>
                <li class="nav-item ">
                {typeSelect==="chefProjet"&&
                   <button class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("chefProjet");setDepartementMembre("");setSecteurChefProjet("");setSecteurClient("");setSearch("");getUsersDésac();getMembres();getUsers();getClients()}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                       <span class="menu-title">  Les chefs de projet</span>
                   </button>
                }
                {(typeSelect==="tous"||typeSelect==="membre"||typeSelect==="client"||typeSelect==="tousDésac")&&
                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("chefProjet");setDepartementMembre("");setSecteurChefProjet("");setSecteurClient("");setSearch("");getUsersDésac();getMembres();getUsers();getClients()}} style={{color:"#06868D",fontSize:"14px" }}>
                        <span class="menu-title">  Les chefs de projet</span>
                    </button>}
                </li>
                <li class="nav-item ">
                {typeSelect==="membre"&&
                   <button class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("membre");setDepartementMembre("");setSecteurChefProjet("");setSecteurClient("");setSearch("");getUsersDésac();getUsers();getChefProjets();getClients()}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                       <span class="menu-title">  Les membres</span>
                   </button>
                }
                {(typeSelect==="chefProjet"||typeSelect==="tous"||typeSelect==="client"||typeSelect==="tousDésac")&&
                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("membre");setDepartementMembre("");setSecteurChefProjet("");setSecteurClient("");setSearch("");getUsersDésac();getUsers();getChefProjets();getClients()}} style={{color:"#06868D",fontSize:"14px" }}>
                        <span class="menu-title"> Les membres</span>
                    </button>}
                </li>
                <li class="nav-item ">
                {typeSelect==="client"&&
                   <button class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("client");setDepartementMembre("");setSecteurChefProjet("");setSecteurClient("");setSearch("");getUsersDésac();getMembres();getChefProjets();getUsers()}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                       <span class="menu-title">  Les clients</span>
                   </button>
                }
                {(typeSelect==="chefProjet"||typeSelect==="membre"||typeSelect==="tous"||typeSelect==="tousDésac")&&
                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("client");setDepartementMembre("");setSecteurChefProjet("");setSecteurClient("");setSearch("");getUsersDésac();getMembres();getChefProjets();getUsers()}} style={{color:"#06868D",fontSize:"14px" }}>
                        <span class="menu-title"> Les clients</span>
                    </button>}
                </li>
                <li class="nav-item ">
                {typeSelect==="tousDésac"&&
                   <button class="nav-link border border-top-0 border-end-0  border-start-0"  onClick={ (e) =>  {setTypeSelect("tousDésac");setDepartementMembre("");setSecteurChefProjet("");setSecteurClient("");setSearch("");getUsers();getMembres();getChefProjets();getClients()}} style={{color:"white",backgroundColor:"#06868D",fontWeight:"bold",fontSize:"14px" }}>
                       <span class="menu-title">  Les utilisateurs désactivés</span>
                   </button>
                }
                {(typeSelect==="chefProjet"||typeSelect==="membre"||typeSelect==="tous"||typeSelect==="client")&&
                    <button class="nav-link border border-top-0 border-end-0  border-start-0 border-info"  onClick={ (e) =>  {setTypeSelect("tousDésac");setDepartementMembre("");setSecteurChefProjet("");setSecteurClient("");setSearch("");getUsers();getMembres();getChefProjets();getClients()}} style={{color:"#06868D",fontSize:"14px" }}>
                        <span class="menu-title"> Les utilisateurs désactivés</span>
                    </button>}
                </li>
            </ul>
        </div> 
        </div>
        <div class="col-3 mt-2">
        {typeSelect==="chefProjet"&&
                    <select value={secteurChefProjet} required onChange={ (e) =>  {setSecteurChefProjet(e.target.value);getChefProjets()}} onClick={() =>{getSecteurChefProjets();if(secteurChefProjet!==""){setSearch("")} }} style ={{fontSize:"13px",paddingBottom:"8px",paddingTop:"8px"}}class="form-select">
                         <option value="" selected disabled> Choisir secteur de projet</option>
                 {secteurs.map((item,index)=>(
                         <option   key={item.id} value={item.id}>{item.titre}</option>
 )) }
                    </select> }
            {typeSelect==="client"&&
                    <select value={secteurClient} required onChange={ (e) =>  {setSecteurClient(e.target.value);getClients()}} onClick={(e) =>{getSecteurClients();if(secteurClient!==""){setSearch("")}}}  style ={{fontSize:"13px",paddingBottom:"8px",paddingTop:"8px"}}class="form-select">
                        <option value="" selected disabled> Choisir secteur d'activité</option>
                     {secteurs.map((item,index)=>(
                        <option   key={item.id} value={item.id}>{item.titre}</option>
)) }
                    </select> }
            {typeSelect==="membre"&&
                    <select value={departementMembre} required onChange={ (e) =>  {setDepartementMembre(e.target.value);getMembres()}} onClick={() =>{getDepartementMembres();if(departementMembre!==""){setSearch("")}}}  style ={{fontSize:"13px",paddingBottom:"8px",paddingTop:"8px"}}class="form-select">
                        <option value="" selected disabled> Choisir le département</option>
                        <option   value="Développement">Développement</option>
                        <option   value="Test">Test</option>
                        <option   value="Marketing | Communication">Marketing | Communication</option>
                        <option   value="Manager">Manager</option>
                        <option   value="Design">Design</option>
                        <option   value="Comptabilité | Finance">Comptabilité | Finance</option>
                        <option   value="Logistique">Logistique</option>
                        <option   value="Autre">Autre</option>
                    </select>  }
        </div>
    </div> 
</div>

   <Modal show={show}  >
        <Modal.Header  >
          <Modal.Title>Inviter un utilisateur
               <button  onClick={handleClose} class="btn" style={{padding:"2px" ,fontWeight:"bold"  ,paddingLeft:"260px"}}>
                  <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
           {!modal&&
                error &&<p className="fs-title" style={{"color":"red",textAlign:"center"}}>{error } </p>}
          
            {modal&& <div class="mb-3 p-2" style={{borderRadius:"5px",backgroundColor:"#06868D",color:"white",fontSize:"13px"}} >Votre invitation vient d'être envoyée. Vous recevrez un mail lors de l'inscription de l'utilisateur.</div>}
           <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} >
               <div class="row">
                   <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Prénom <span style={{color:"red"}}>*</span></label>
                            <input className="form-control  form-icon-input" name="username"  type="text" onChange={(e)=>setPrenom(e.target.value)} placeholder="saisir son prénom" pattern=".{3,}" title="3 caractères ou plus"required="required"/>
                        </div>
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Nom <span style={{color:"red"}}>*</span></label>
                           <input className="form-control  form-icon-input" name="nom"  type="text" onChange={(e)=>setNom(e.target.value)} placeholder="saisir son nom" pattern=".{3,}" title="3 caractères ou plus" required="required"/>
                        </div>
                    </div>
                </div>
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}} for="email">Adresse email <span style={{color:"red"}}>*</span></label>
                   <input className="form-control form-icon-input" name="email" type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="name@example.com" required="required"/>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Sexe <span style={{color:"red"}}>*</span></label>
                            <div class="mb-2" >
                                <input  className="form-check-input m-1 " type="radio" id="input1" value="homme" name="sexe"  onChange={(e)=>setSexe(e.target.value)}  />
                                <label class="form-check-label m-1" for="flexRadioDefault2">Homme</label>
                            </div>
                            <div class="" >
                                <input  className="form-check-input m-1" type="radio" id="input1" value="femme" name="sexe"  onChange={(e)=>setSexe(e.target.value)}/>
                                <label class="form-check-label  m-1" for="flexRadioDefault2">Femme</label>
                            </div>
                           
                        </div>
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start "><label className="form-label" style={{color:"#06868D"}} >Rôle <span style={{color:"red"}}>*</span></label>
                            <div class="mb-2 ">
                           
                               <input className="form-check-input m-1" type="radio" id="input1" value="chef de projet" name="role"  onChange={(e)=>setRole(e.target.value)}/>
                          
                               <label class="form-check-label m-1" for="flexRadioDefault2"> Chef de projet</label>
                            </div>
                            <div class="mb-2">
                               <input className="form-check-input m-1" type="radio" id="input1" value="membre" name="role"  onChange={(e)=>setRole(e.target.value)}/>
                               <label class="form-check-label m-1" for="flexRadioDefault2"> Membre</label>
                            </div>
                            <div class="mb-2">
                               <input className="form-check-input m-1" type="radio" id="input1" value="client" name="role"  onChange={(e)=>setRole(e.target.value)}/>
                               <label class="form-check-label m-1" for="flexRadioDefault2">  Client</label>
                            </div>
                           
                        </div>
                    </div>
                </div>
                
            {(role==="client")&&(
                <>
                <div class="row">
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Nom de l'entreprise <span style={{color:"red"}}>*</span></label>
                            <input className="form-control  form-icon-input" name="nomE"  type="text" onChange={(e)=>setNomE(e.target.value)} placeholder="saisir nom de l'entreprise" required="required"/>
                        </div>
                    </div>
                    <div class="col-6">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le secteur d'activité <span style={{color:"red"}}>*</span></label>
                            <select value={secteurC} required onChange={ (e) =>  setSecteurC(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                                <option value="" selected disabled> Choisir le secteur</option>
                                {
                                  secteurs.map((item,index)=>(
                                    <option   key={item.id} value={item.id}>{item.titre}</option>
                                    )) }
                            </select> 
                        </div>
                    </div>
                </div>
                </>
                )}
            {(role==="chef de projet")&&(
                <>
                <div class="row">
                    <div class="col-12">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le secteur de projet <span style={{color:"red"}}>*</span></label>
                            <select value={secteur} required onChange={ (e) =>  setSecteur(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                                <option value="" selected disabled> Choisir le secteur</option>
                                {
                                  secteurs.map((item,index)=>(
                                    <option   key={item.id} value={item.id}>{item.titre}</option>
                                    )) }
                            </select> 
                        </div>
                    </div>
                </div>
                </>
                )}
            {(role==="membre")&&(
                <>
                <div class="row">
                    <div class="col-12">
                        <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Le département <span style={{color:"red"}}>*</span></label>
                            <select value={departement} required onChange={ (e) =>  setDepartement(e.target.value)}  style ={{fontSize:"13px",paddingBottom:"5px",paddingTop:"5px"}}class="form-select">
                                <option value="" selected disabled> Choisir le département</option>
                                <option   value="Développement">Développement</option>
                                <option   value="Test">Test</option>
                                <option   value="Marketing | Communication">Marketing | Communication</option>
                                <option   value="Manager">Manager</option>
                                <option   value="Design">Design</option>
                                <option   value="Comptabilité | Finance">Comptabilité | Finance</option>
                                <option   value="Logistique">Logistique</option>
                                <option   value="Autre">Autre</option>
                           </select> 
                        </div>
                    </div>
                </div>
                </>
                )}
                <div class="mt-4" style={{ textAlign:"right" }}> 
                    <button type="submit" class="btn"  disabled={(!sexe ||!role||!nom||!prenom||!email) &&"disabled" }   style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                       Ajouter
                    </button>
                </div>
            </form>
        </Modal.Body>
    </Modal>
<div class="row flex-grow " >
    {typeSelect==="tous"&&users.length!==0&&
                               users.map((item,index)=>(
                                 <Utilisateur  key={index} id={item.id} username={item.username} lastname={item.lastname} userRole={userRole}
                                         photo={item.photo} email={item.email} sexe={item.sexe} etat={item.etat} role={item.roles} type={typeSelect} Désactive={Désactive} Active={Active}
                                         />)) }

    {typeSelect==="membre"&&departementMembre===""&&membres.length!==0&&
                               membres.map((item,index)=>(
                                <Utilisateur  key={index} id={item.utilisateur.id} username={item.utilisateur.username} lastname={item.utilisateur.lastname} userRole={userRole}
                                         photo={item.utilisateur.photo} email={item.utilisateur.email} sexe={item.utilisateur.sexe} etat={item.utilisateur.etat} role={item.utilisateur.roles} type={typeSelect} Désactive={Désactive} Active={Active}
                                         />) ) }
     {typeSelect==="membre"&&departementMembre===""&&membres.length===0&&
           <center style={{fontSize:"15px",marginTop:"200px"}}> La liste des membres est vide.</center>}

    {typeSelect==="client"&&secteurClient===""&&clients.length!==0&&
                               clients.map((item,index)=>(
                                   <Utilisateur  key={index} id={item.utilisateur.id} nomEntreprise={item.nomEntreprise} username={item.utilisateur.username} lastname={item.utilisateur.lastname} userRole={userRole}
                                         photo={item.utilisateur.photo} email={item.utilisateur.email} sexe={item.utilisateur.sexe} etat={item.utilisateur.etat} role={item.utilisateur.roles} type={typeSelect} Désactive={Désactive} Active={Active}
                                         />)) }
     {typeSelect==="client"&&secteurClient===""&&clients.length===0&&
         <center style={{fontSize:"15px",marginTop:"200px"}}> La liste des clients est vide.</center>}
                                    
    {typeSelect==="chefProjet"&&secteurChefProjet===""&&chefProjets.length!==0&&
                               chefProjets.map((item,index)=>(
                                <Utilisateur  key={index} id={item.utilisateur.id}  username={item.utilisateur.username} lastname={item.utilisateur.lastname} userRole={userRole}
                                         photo={item.utilisateur.photo} email={item.utilisateur.email} sexe={item.utilisateur.sexe} etat={item.utilisateur.etat} role={item.utilisateur.roles} type={typeSelect} Désactive={Désactive} Active={Active}
                                         />)) }
    {typeSelect==="chefProjet"&&secteurChefProjet===""&&chefProjets.length===0&&
         <center style={{fontSize:"15px",marginTop:"200px"}}> La liste des chefs de projet est vide.</center>}

    {typeSelect==="membre"&&departementMembre!==""&&departementMembres.length!==0&&
                               departementMembres.map((item,index)=>(
                                  <Utilisateur  key={index} id={item.utilisateur.id} username={item.utilisateur.username} lastname={item.utilisateur.lastname} userRole={userRole}
                                         photo={item.utilisateur.photo} email={item.utilisateur.email} sexe={item.utilisateur.sexe} etat={item.utilisateur.etat} role={item.utilisateur.roles} type={typeSelect} Désactive={Désactive} Active={Active}
                                         />)) }
    {typeSelect==="membre"&&departementMembre!==""&&departementMembres.length===0&&
         <center style={{fontSize:"15px",marginTop:"200px"}}> La liste des membres est vide dont le département est <span style={{fontWeight:"bold"}}> {departementMembre}</span>.</center>}

    {typeSelect==="client"&&secteurClient!==""&&secteurClients.length!==0&&
                               secteurClients.map((item,index)=>(
                                   <Utilisateur  key={index} id={item.utilisateur.id} nomEntreprise={item.nomEntreprise} username={item.utilisateur.username} lastname={item.utilisateur.lastname} userRole={userRole}
                                         photo={item.utilisateur.photo} email={item.utilisateur.email} sexe={item.utilisateur.sexe} etat={item.utilisateur.etat} role={item.utilisateur.roles} type={typeSelect} Désactive={Désactive} Active={Active}
                                         />)) }
    {typeSelect==="client"&&secteurClient!==""&&secteurClients.length===0&&
         <center style={{fontSize:"15px",marginTop:"200px"}}> La liste des clients est vide pour cet secteur.</center>}
        
    {typeSelect==="chefProjet"&&secteurChefProjet!==""&&secteurChefProjets.length!==0&&
                               secteurChefProjets.map((item,index)=>(
                                  <Utilisateur  key={index} id={item.utilisateur.id}  username={item.utilisateur.username} lastname={item.utilisateur.lastname} userRole={userRole}
                                         photo={item.utilisateur.photo} email={item.utilisateur.email} sexe={item.utilisateur.sexe} etat={item.utilisateur.etat} role={item.utilisateur.roles} type={typeSelect} Désactive={Désactive} Active={Active}
                                         />))}
     {typeSelect==="chefProjet"&&secteurChefProjet!==""&&secteurChefProjets.length===0&&
         <center style={{fontSize:"15px",marginTop:"200px"}}> La liste des chefs de projet est vide pour cet secteur.</center>}
     
    {typeSelect==="tousDésac"&&usersDésac.length!==0&&
                               usersDésac.map((item,index)=>(
                                  <Utilisateur  key={index} id={item.id} username={item.username} lastname={item.lastname} userRole={userRole}
                                         photo={item.photo} email={item.email} sexe={item.sexe} etat={item.etat} role={item.roles} type={typeSelect} Désactive={Désactive} Active={Active}
                                         />)) }
      {typeSelect==="tousDésac"&&usersDésac.length===0&&
            <center style={{fontSize:"15px",marginTop:"200px"}}> La liste des utilisateurs désactivés est vide.</center>
                             
                                   }
                               
</div>
</div></div></div></div>}
</>
       )
}

  

