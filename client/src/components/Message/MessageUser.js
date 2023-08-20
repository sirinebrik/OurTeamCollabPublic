import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import Sidebar from "../Page/Sidebar";
import Navbar from "../Page/Navbar";
import "./MessageList.css"
import EmojiPicker, {
    EmojiStyle,
    SkinTones,
    Theme,
    Categories,
    EmojiClickData,
    Emoji,
    SuggestionMode,
    SkinTonePickerLocation
  } from "emoji-picker-react";

export default function MessageUser({to,from}) {
    let user1 = jwt_decode(localStorage.getItem("token"));
    let role1=user1.roles[0]  
    
    const [messages,setMessages]= useState([])

    const getMessages= (async () => {
        await Axios.get(`http://localhost:8000/messageUser/${to.id}/${from.id}`
        )
        .then((response)=>{
        setMessages(response.data.message) 
         })  });
         useEffect( () => { const interval = setInterval(getMessages, 5000); // Appel toutes les 5 secondes
      
         return () => {
           clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
           console.error = () => {}
          
         };
         }, []);
return (
<>
{messages.map((item,index)=>
   <div>{item.contenu}</div> ) }          
</>
 )
}

  

