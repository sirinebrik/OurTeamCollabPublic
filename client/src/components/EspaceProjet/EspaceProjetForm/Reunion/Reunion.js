import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams } from "react-router-dom"
import Navbar from "../../../Page/Navbar";
import Sidebar from "../../../Page/Sidebar";
import Modal from 'react-bootstrap/Modal';
import Select  from "react-select";
import moment from 'moment';

export default function Reunion({idR,note,id,projetRole,Delete,archive,raisonAnn,annule,presence,date,lien,idParticip,NonPresence,OuiPresence,heureDebut,heureFin}) {
  let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]
    let noteUser=note;
    if(note){
      noteUser=(jwt_decode(note)).note
    }
    const [noteU,setNoteU]= useState(noteUser)
    const handleDelete = () => {
        Delete(idR);
      };
      const handleNonPresence = () => {
        NonPresence(idParticip);
      };
      const handleOuiPresence = () => {
       OuiPresence(idParticip);
      };
      const [show, setShow] = useState(false);
      const [showN, setShowN] = useState(false);
      const [raison, setRaison] = useState(raisonAnn);
      const [error, setError] = useState("");
   const handleShow = () => {setShow(true);}
    const handleClose = () => {setShow(false);setRaison(raisonAnn);}  
    const handleShowN = () => {setShowN(true);}
    const handleCloseN = () => {setShowN(false);noteUser=note;if(note){noteUser=(jwt_decode(note)).note;};setNoteU(noteUser);}   
    const onSubmitHandler = (e) => {
      e.preventDefault()
       const formData ={
            "raison" : raison,}
      Axios.post(`http://localhost:8000/annuleReunion/${idR}`, formData,{
          headers: {
              "Content-Type": "multipart/form-data",
          }
      })
        .then((res) => { 
          if(role==="ROLE_ADMIN"){window.location=`./${id}`} else{  window.location=`./${projetRole}`};
     
     })
        .catch((err) => setError(err.response.data.danger))
    }
    const date1 = moment(new Date());
const date2 = moment(date);
var beginningTime = moment(date+" "+heureDebut+":00");
var endTime = moment(date+" "+heureFin+":00");
var Time = moment(new Date());
const onSubmitHandlerNote = (e) => {
  e.preventDefault()
   const formData ={
        "note" : noteU,}
  Axios.post(`http://localhost:8000/note/${idR}/${user.id}`, formData,{
      headers: {
          "Content-Type": "multipart/form-data",}
  }).then((res) => { if(role==="ROLE_ADMIN"){window.location=`./${id}`} else{  window.location=`./${projetRole}`};
})
    .catch()}
    console.error = () => {}
return (
<>
<td >
{annule ===true &&"Oui"}{annule ===false &&"Non"} 
</td >
{role!=="ROLE_ADMIN"&&
<><td >
    {annule ===false &&presence===null&&Time.isBefore(endTime)&&archive===false&&
    <>
    <button type="button" title="Oui" className='ms-1 border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleOuiPresence} style={{backgroundColor:"green",color:"white"}}>
      <i class="fa fa-check" style={{fontSize:"14px"}}></i> 
    </button>
     <button type="button" title="Non" className='border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleNonPresence} style={{backgroundColor:"red",color:"white"}}>
     <i class="fa fa-remove" style={{fontSize:"14px"}}></i> 
   </button></>}
    {annule ===false &&presence===false&&Time.isBefore(endTime)&&archive===false&&
    <>
    <button type="button" title="Oui" className='border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleOuiPresence} style={{backgroundColor:"green",color:"white"}}>
      <i class="fa fa-check" style={{fontSize:"14px"}}></i> 
    </button>
    <span title="Non" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Non </span>
   
    </>}
    {annule ===false &&presence===true&&Time.isBefore(endTime)&&archive===false&&
    <>
    <span title="Oui" className='me-1  pe-1' style={{fontWeight:"bold",color:"green",textAlign:"center",fontSize:"12px"}}  >Oui </span>
    <button type="button" title="Non" className='border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleNonPresence} style={{backgroundColor:"red",color:"white"}}>
     <i class="fa fa-remove" style={{fontSize:"14px"}}></i> 
   </button>
  
    </>}
   
    {annule ===true&&
    <>
        <span title="Pas de réunion" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Pas de réunion </span>

    </>}
    {((annule ===false&&presence===null&&(Time.isAfter(endTime)))||archive===true)&&
    <>
        <span title="Non" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Non </span>

    </>}
    {((annule ===false&&presence===false&&(Time.isAfter(endTime)))||archive===true)&&
    <>
    <span title="Non" className='me-1  pe-1' style={{fontWeight:"bold",color:"red",textAlign:"center",fontSize:"12px"}}  >Non </span>

    </>}
    {((annule ===false&&presence===true&&(Time.isAfter(endTime)))||archive===true)&&
    <>
    <span title="Oui" className='me-1  pe-1' style={{fontWeight:"bold",color:"green",textAlign:"center",fontSize:"12px"}}  >Oui </span>

    </>}
</td ></>}


{role!=="ROLE_ADMIN"&&
<><td >
    <Link to={`/détailRéunion/${id}/${projetRole}/${idR}`} title="Détail réunion">
      <i class="fa fa-eye ms-2"  style={{fontSize:"16px",color:"blue"}}></i>
    </Link>
  
  {projetRole==="chefProjet"&&archive===false&&
    <>
    <Link to={`/editRéunion/${id}/${projetRole}/${idR}`} title="Modifier réunion">
      <i class="fa fa-edit" style={{fontSize:"16px",color:"orange"}}></i>
    </Link>
    <button type="button" title="Supprimer réunion" className='border border-top-0 border-end-0  border-start-0 border-bottom-0' onClick={handleDelete} style={{backgroundColor:"white"}}>
      <i class="fa fa-trash" style={{fontSize:"16px",color:"red"}}></i> 
    </button>
    {annule ===false&&
    <button type="button" onClick={ (e) =>  {handleShow()}}  title="Annuler réunion" className=' border border-top-0 border-end-0  border-start-0 border-bottom-0'  style={{backgroundColor:"white"}}>
       <i class="fa fa-remove" style={{fontSize:"16px",color:"rgb(106, 41, 41)"}} ></i> 
    </button>}
  
    </> }
  
  </td ></>
}
{role!=="ROLE_ADMIN"&&
<><td >
{(annule ===false &&presence===true&&((Time.isAfter(beginningTime)&&Time.isBefore(endTime))||Time.isSame(beginningTime)))&&
    <Link to={lien} title="Rejoindre" >
      <span class="me-1  pe-1" style={{fontSize:"14px",color:"white",fontWeight:"bold",backgroundColor:"#06868D" ,borderRadius:"5px"}}>Rejoindre</span>
    </Link>}
{(annule ===false&&presence===true&&note&&Time.isAfter(beginningTime))&&note&&
    <span type="button" className=" pt-1 pe-1" title="Note"  onClick={ (e) =>  {handleShowN()}} style={{fontSize:"14px",color:"white",fontWeight:"bold",backgroundColor:"#06868D",borderRadius:"5px"}} > 
  <i title="note" class="fa fa-edit pe-1" style={{fontSize:"14px",fontWeight:"bold",color:"white"}}></i> Note</span>
  }

</td></>
  }
  
{role==="ROLE_ADMIN"&&
<><td >
    <Link to={`/détailRéunion/${id}/${idR}`} title="Détail réunion">
      <i class="fa fa-eye" style={{fontSize:"16px",color:"blue"}}></i>
    </Link>
  </td ></>
}

<Modal show={show} >
        <Modal.Header  >
          <Modal.Title>Raison d'annulation d'une réunion 
            <button  onClick={handleClose} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"130px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
       
            { ((projetRole!=="chefProjet")||(projetRole==="chefProjet"&&annule===true)||(archive===true))&&<p className="fs-title" style={{"color":"red",textAlign:"center",fontWeight:"bold"}}>{raison } </p>}
            {projetRole==="chefProjet"&&annule===false&&archive===false&&
            <form  enctype="multipart/form-data"  method="post" onSubmit={onSubmitHandler} >
                <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Raison d'annulation  </label>
                    <input className="form-control  form-icon-input" name="raison" value={raison}  type="text" onChange={(e)=>setRaison(e.target.value)} placeholder="saisir le raison d'annulation"/>
                </div>
                <div class="mt-4" style={{ textAlign:"right" }}>
                    <button type="submit" class="btn"    disabled={(!raison) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                     Annuler
                  </button>
              </div>
            </form>}
        </Modal.Body>
    </Modal>
    <Modal show={showN}   >
        <Modal.Header  >
          <Modal.Title>Note
            <button  onClick={handleCloseN} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"370px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body > 
        <form  enctype="multipart/form-data" onSubmit={onSubmitHandlerNote} >
            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Note </label>
                <br></br><textarea className="" name="note"  rows="13" cols="70" value={noteU}  onChange={(e)=>setNoteU(e.target.value)} style={{borderColor:"#06868D"}} placeholder="..."></textarea>
            </div>
            <div class="mt-4" style={{ textAlign:"right" }}>
                <button type="submit" class="btn"    disabled={(!noteU) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                    Enregistrer
                </button>
            </div>
        </form> 
        </Modal.Body>
    </Modal>
</>

       )
}

  

