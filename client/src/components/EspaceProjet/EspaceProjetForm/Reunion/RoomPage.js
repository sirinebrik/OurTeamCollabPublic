import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams} from "react-router-dom"
import Navbar from "../../../Page/Navbar";
import Sidebar from "../../../Page/Sidebar";
import {ZegoUIKitPrebuilt} from "@zegocloud/zego-uikit-prebuilt";
import "./RoomPage.css";
import Modal from 'react-bootstrap/Modal';
import Select  from "react-select";

export default function RoomPage() {
    const [isLoding, setIsLoding] = useState(true);
    const { id } = useParams()
    const { roomId } = useParams()
    const { idR} = useParams()
    const [note,setNote]= useState("")
    const [projetRole,setProjetRole]= useState("")
    const [show, setShow] = useState(false);
    const handleShow = () => {setShow(true);}
    const handleClose = () => {setShow(false)}
    const [showP, setShowP] = useState(false);
    const handleShowP = () => {setShowP(true);}
    const handleCloseP = () => {setShowP(false)}
   let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]
 const myMeeting=async(element)=>{
    const appId=251201204 ;
    const serverSecret="d3361567ad057d3bea135a5a4e90ddb1";
    const kitToken=ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        Date.now().toString(),
        user.name+" "+user.lastname
    );
    const zp=ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
        container:element,
        scenario:{
            mode:ZegoUIKitPrebuilt.VideoConference,
        },
    });
};
const onSubmitHandler = (e) => {
    e.preventDefault()
     const formData ={
          "note" : note,}
    Axios.post(`http://localhost:8000/note/${idR}/${user.id}`, formData,{
        headers: {
            "Content-Type": "multipart/form-data",}
    }).then((res) => {handleClose() }) }

       //le note d'un utilisateur d'une réunion
    const getNote = (async () => {
        await Axios.get(`http://localhost:8000/noteUser/${idR}/${user.id}`)
        .then((response)=>{
        setNote(response.data.note)
      })  });
    useEffect( () => {getNote();},[]) ;  

    const [usersId,setUsersId]= useState([])
    const [users,setUsers]= useState([])
    const [usersReunion,setUsersReunion]= useState([])
    //detailprojet
    const getUsers = (async () => {
    await Axios.get(`http://localhost:8000/detailProjet/${id}`
  )
    .then((response)=>{
        setIsLoding(false);
    setUsers(response.data.projet) 
})  });useEffect( () => {getUsers();},[]);
 //projetRole
 const getProjetRole = (async () => {
    await Axios.get(`http://localhost:8000/projetRoleUser/${idR}/${user.id}`
  )
    .then((response)=>{
        setProjetRole(response.data.projetRole[0].user.role)
})  });useEffect( () => {getProjetRole();},[]);

    const optionso = [];
    users.map((item, index) => {
        let i="yes"
        if(item.role!=="chefProjet"){
            usersReunion.map((item1, index1) => {
                if(item.id===item1.user.id){ i="no"; }
        })
        if(i==="yes"){
            optionso.push({
                label: item.user.username+" "+item.user.lastname+" ("+item.role+")",value: item.id})}}
          });
          const getReunion = (async () => {
            await Axios.get(`http://localhost:8000/reunion/${user.id}/${idR}`)
            .then((response)=>{
            setUsersReunion(response.data.reunionUser)
           
           })  });
        useEffect( () => {getReunion()});

        const onSubmitHandlerPart = (e) => {
            e.preventDefault()
             const formData ={
                 "users":usersId,}
            Axios.post(`http://localhost:8000/inviterReunion/${idR}`, formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
              .then((res) => {handleCloseP() })}
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
        <div class="main-panel mt-3">
           <div class="row mb-3">
                <div class="col-6 ">
                    <span type="button" class="me-4 " style={{fontWeight:"bold",fontSize:"13px"}} onClick={ (e) =>  {window.location=`/tableauDeBord/${id}`}} > <i class="fa fa-arrow-left "></i> Retour</span>     
                </div>
                <div class="col-3"></div>
                <div class="col-3 ">
                    <div class="row">
                       <div class="col-2 "></div>
                       <div class="col-10 ">
                        {projetRole==="chefProjet"&&
                            <button className="btn pt-2 pb-2 pe-4 ps-4"  onClick={ (e) =>  {handleShowP()}} style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" }}  >
                                <i class="fa fa-fw fa-plus menu-title" style={{fontSize:"14px"}} > </i> Inviter des participants
                           </button> }                   
                        </div>
                    </div>
                </div>
            </div>
           <div class="mt-2 me-7">
               <div ref={myMeeting} class="" >
               </div> 
            </div>
            <div class="divNote ">
                <button type="button" className="btn note " title="Note"  onClick={ (e) =>  {handleShow()}}  > <i style={{fontSize:"19px", color:"white" }} class="fa fa-edit note  " ></i>
            </button>
            </div>
        </div>
    </div>
</div>}
<Modal show={show}  style={{ width: 300}} className="modalNote" >
        <Modal.Header  >
          <Modal.Title>Note
            <button  onClick={handleClose} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"180px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body > 
        <form  enctype="multipart/form-data" onSubmit={onSubmitHandler} >
            <div className="mb-3 text-start"><label className="form-label" style={{color:"#06868D"}}>Note </label>
                <br></br><textarea className="" name="note"  rows="13" cols="70" value={note}  onChange={(e)=>setNote(e.target.value)} style={{borderColor:"#06868D"}} placeholder="..."></textarea>
            </div>
            <div class="mt-4" style={{ textAlign:"right" }}>
                <button type="submit" class="btn"    disabled={(!note) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                    Enregistrer
                </button>
            </div>
        </form> 
        </Modal.Body>
    </Modal>
    <Modal show={showP}   >
        <Modal.Header  >
          <Modal.Title>Inviter des participants
            <button  onClick={handleCloseP} class="btn" style={{fontWeight:"bold" ,padding:"2px" ,paddingLeft:"230px"}}>
                      <i class="fa fa-close"  style={{fontSize:"17px"}}></i>
                    </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body > 
        <form  enctype="multipart/form-data" onSubmit={onSubmitHandlerPart} >
            <div className="mb-3 text-start">
                <Select isMulti options={optionso}   onChange={setUsersId} labelledBy={"Select"}      overrideStrings={{
                                  selectSomeItems: "Choisir le(s) participant(s)",

                                }}
                                className="select fs-9" />
            </div>
            <div class="mt-4" style={{ textAlign:"right" }}>
                <button type="submit" class="btn"    disabled={(!usersId.length) &&"disabled" } style={{ backgroundColor:"#06868D" , color:"white" ,fontSize:"14px",fontWeight:"bold" ,padding:"10px"}}>
                    Inviter
                </button>
            </div>
        </form> 
        </Modal.Body>
    </Modal>
 
</>
       )
}

  

