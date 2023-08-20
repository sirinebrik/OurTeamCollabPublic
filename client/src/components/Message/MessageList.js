import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import Sidebar from "../Page/Sidebar";
import Navbar from "../Page/Navbar";
import "./MessageList.css"
import Message from "./Message";
import Contact from "./Contact";


export default function MessageList() {
  const [isLoding, setIsLoding] = useState(true);
    let user1 = jwt_decode(localStorage.getItem("token"));
    let role1=user1.roles[0]  
    const [nouveau,setNouveau]= useState(false)
    const [text, setText] = useState("");

    const [contact,setContact]= useState([])
    const [id, setId] = useState("");
    const [to, setTo] = useState([]);
    const [from, setFrom] = useState([]);
    const [u, setI] = useState(0);
      const getContact = (async () => {
      await Axios.get(`http://localhost:8000/message/${user1.id}`
      )
      .then((response)=>{
      setContact(response.data.message)
      setIsLoding(false);
    setI(1);
      })  });
      useEffect( () => { const interval = setInterval(getContact, 5000); // Appel toutes les 5 secondes
      return () => { clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
     };
      }, []);
      const [messages,setMessages]= useState([])

      const getId= () => {
        Axios.get(`http://localhost:8000/message/${user1.id}`
        )
        .then((response)=>{
            let i=0;
            {response.data.message.map((item,index)=>{
               if(i===0){
                Axios.get(`http://localhost:8000/messageUser/${item.toUser.id}/${item.fromUser.id}`
                )
                .then((response)=>{
                setMessages(response.data.message) 
                 }) 
              setId(item.id)
              setTo(item.toUser) 
              setFrom(item.fromUser) 
              
                ; 
            i=i+1;}
            
            })} }) 
      
      } ;
      useEffect( () => {getId();},[]);  
     
      function change() {
        setNouveau(false);
      }  
      function changeId(id,to,from) {
        Axios.get(`http://localhost:8000/messageUser/${to.id}/${from.id}`
        )
        .then((response)=>{
        setMessages(response.data.message) 
         }) 
        setId(id);
        setTo(to)
        setFrom(from)
      }  

     
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
               <div class="row">
                    <div class="col-3 border  " style={{backgroundColor:"white" ,boxShadow: "0 0 4px 1px rgba(0, 0, 0, 0.4)"}} >
                        <div class="row mb-2 mt-3">
                            <div class="col-9" style={{fontSize:"18px" ,fontWeight:"bold"}} >
                              Discussions
                           </div>
                           <div class="col-3 ">
                               <i type="button" title="Ajouter nouveau contact" class="fa fa-user-plus me-4 " style={{fontSize:"17px",marginTop:"4px" }} onClick={(text) => {setNouveau(!nouveau)}}></i>
                           </div>
                        </div>
                        
                        <div class="contact  mt-3" >
                            {nouveau===true&&
                            <div class="mb-3" style={{backgroundColor:"#ECF3FF" ,borderRadius:"5px"}}>
                                <div class="row">
                                    <div class="col-2">
                                        <i class="fa fa-user border   " style={{backgroundColor:"rgba(0, 0, 0, 0.1)",borderColor:"#06868D",borderRadius:"20px",padding:"11px 13px"}}  width="39px" height="39px" alt=""/>
                                    </div>
                                    <div class="col-10 mt-2">
                                        <span class="" style={{fontSize:"13px",fontWeight:"bold"}}>Nouveau message</span>                                 
                                    </div>
                                </div>
                            </div>}
                           
                        {contact.map((item,index)=>
                        <>
                            <Contact id={item.id} idM={id}  toUser={item.toUser} change={change} nouveau={nouveau} fromUser={item.fromUser} changeId={changeId} contenu={(jwt_decode(item.contenu)).contenu} date={item.dateEnvoi} heure={item.heureEnvoi} messageLu={item.messageLu}/> 
                         </>

                           )}

                       </div>
                    </div>
                  <Message to={to} messages={messages} contact={contact} from={from} idM={id} roleFrom={from.roles}  roleTo={to.roles} nouveau={nouveau}  change={change} changeId={changeId}/>
           
                </div>


            </div>
        </div>
    </div>
</div>}
</>
 )
}

  

