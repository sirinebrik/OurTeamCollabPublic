import React,{ useEffect, useState, useRef } from "react"
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

export default function Message({messages,nouveau,change,changeId,idM,to,from,roleFrom,roleTo,contact}) {
    let user1 = jwt_decode(localStorage.getItem("token"));
    let role1=user1.roles[0]  
    const [text, setText] = useState("");
    const [userId, setUserId] = useState("");
   
    let u=""
    let F=""
    if(to.id===user1.id){
      u=to.id
      F=from.id
     }
     else{
      u=to.id
      F=from.id
     }
     if(idM.length!==0&&u.length!==0&&F.length!==0){
    Axios.post(`http://localhost:8000/marquerLuMessages/${user1.id}`,{
      headers: {
          "Content-Type": "multipart/form-data",}
      })}
    function onClick(emojiData) {
        let sym = emojiData.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);   
             setText(text + emoji );}

      console.error = () => {}
     
      const [users,setUsers]= useState([])

      const getUsers = (async () => {
        await Axios.get(`http://localhost:8000/contact/${user1.id}/${role1}`
        )
        .then((response)=>{
        setUsers(response.data.users) 
        })  });
        useEffect( () => {getUsers();},[]);

        const onSubmitHandlerN = () => {
          const formData ={
               "contenu" : text,
            }
          
         Axios.post(`http://localhost:8000/ajouterMessage/${user1.id}/${userId}`, formData,{
             headers: {
                 "Content-Type": "multipart/form-data",
             }
         }).then((res) => { 
           changeId(res.data.success,res.data.to,res.data.from) 
          change()
          setText("")
          getUsers() 
          setUserId("")
          })
       }
       const onSubmitHandler = () => {
        const formData ={
             "contenu" : text,
          }
         let qui=""
          
            if(to.id!==user1.id){
             qui=to.id
            }
            else{
             qui=from.id
            }
          
        
       Axios.post(`http://localhost:8000/ajouterMessage/${user1.id}/${qui}`, formData,{
           headers: {
               "Content-Type": "multipart/form-data",
           }
       }).then((res) => { 
        setText("")

        })
     }
     

return (
<>
{contact.length===0&&nouveau===false&&
              <div class="col-9 border" style={{backgroundColor:"white" ,boxShadow: "0 0 12px 1px rgba(0, 0, 0, 0.2)"}} >
                 <div class="" style={{textAlign:"center",marginTop:"250px"}}>
                    Sélectionner une discussion ou lancer une conversation
                </div>
               
              </div>
}
{nouveau===true&&
             <>
                    <div class="col-9 border" style={{backgroundColor:"white" ,boxShadow: "0 0 12px 1px rgba(0, 0, 0, 0.2)"}} >
                       <div class="mt-3">
                           <span class="mt-4 " style={{fontSize:"14px",fontWeight:"bold"}}>À : 
                               <select  value={userId} onChange={ (e) =>  setUserId(e.target.value)}  class="border-0 me-1" style={{fontSize:"13px"}}  >
                                  <option value=""  selected disabled >Choisir le contact</option>
                                  {
                                  users.map((item,index)=>(
                                    <option   key={item.id} value={item.id}>
                                      {item.roles[0]!=="ROLE_ADMIN"&&item.username+" "+item.lastname}
                                      {item.roles[0]==="ROLE_ADMIN"&&"Administrateur"}
                                    </option>
                                    )) }
                               </select> 
                           </span>
                        </div>
                       <hr />
                       <div class="message mb-2" >
                       </div>
                       {userId&&
                          <div class="row ">
                            <div class="col-11 mb-3">
                               <input   type="text" class="form-control "  value={text}
                               onChange={(e)=> setText(e.target.value)} name="message" placeholder="Message..." required style={{backgroundColor:"white",borderColor:"#06868D"}}/>
                            </div>
                           <div class="col-1">
                                <a class="ms-1" id="UserDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false" style={{textDecoration:"none"}}>
                                   <span   > 😊</span>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
                                    <div class="dropdown-header text-center">
                                      <EmojiPicker
                                          onEmojiClick={onClick}
                                          autoFocusSearch={false}
                                          emojiStyle={EmojiStyle.NATIVE}
                                         style={{fontSize:"12px"}}
                                         />
                                    </div>
                                </div>
                                <i type="button" onClick={(text) => {onSubmitHandlerN()}} class="fa fa-paper-plane mt-2" style={{ fontSize:"14px",backgroundColor:"white",color:"#06868D" }}></i>
                            </div>
                          </div>}
                    </div>
                    </>}    
 
                 {contact.length!==0&&nouveau===false&&
                   <>
 
                    <div class="col-9 border" style={{backgroundColor:"white" ,boxShadow: "0 0 12px 1px rgba(0, 0, 0, 0.4)"}} >
                       <div class="mt-3">
                       {user1.id!==from.id&&
                       <>
                       {from.photo&&
                           <img class="rounded-circle border border-success " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require(`../../assets/uploads/${from.photo}`)} width="43px" height="43px" alt=""/>
                        }
                       {!from.photo  &&  <img class="rounded-circle border border-success" style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require('../../assets/img/logos/user.png')} width="43px" height="43px" alt="Profile image"/>} 
                         
                           <span class="mt-4 me-2" style={{fontSize:"14px",fontWeight:"bold"}}>{from.username} {from.lastname} </span>
                           </>}
                           {user1.id!==to.id&&
                       <>
                       {to.photo&&
                           <img class="rounded-circle border border-success " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require(`../../assets/uploads/${to.photo}`)} width="43px" height="43px" alt=""/>
                        }
                       {!to.photo  &&  <img class="rounded-circle border border-success" style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require('../../assets/img/logos/user.png')} width="43px" height="43px" alt="Profile image"/>} 
                         
                           <span class="mt-4 me-2" style={{fontSize:"14px",fontWeight:"bold"}}>{to.username} {to.lastname} </span>
                           </>}
                           {user1.id!==from.id&&
                            <>
                              {(roleFrom[0]==="ROLE_CHEFPROJET")&&
                              <Link class="" to={ `/profile/${from.id}`} style={{textDecoration:"none"}}>
                                 <i class="fa fa-info-circle "  style={{color:"#06868D",marginLeft:"680px",fontSize:"20px"}}></i>
                              </Link>}
                              {(roleFrom[0]==="ROLE_CLIENT")&&
                              <Link class="" to={ `/profileC/${from.id}`} style={{textDecoration:"none"}}>
                                 <i class="fa fa-info-circle "  style={{color:"#06868D",marginLeft:"680px",fontSize:"20px"}}></i>
                              </Link>}
                              {(roleFrom[0]==="ROLE_MEMBRE")&&
                              <Link class="" to={ `/profileM/${from.id}`} style={{textDecoration:"none"}}>
                                 <i class="fa fa-info-circle "  style={{color:"#06868D",marginLeft:"680px",fontSize:"20px"}}></i>
                              </Link>}
                             
                            </> }
                           {user1.id!==to.id&&
                           <>
                              {(roleTo[0]==="ROLE_CHEFPROJET")&&
                              <Link class="" to={ `/profile/${to.id}`} style={{textDecoration:"none"}}>
                                 <i class="fa fa-info-circle "  style={{color:"#06868D",marginLeft:"680px",fontSize:"20px"}}></i>
                              </Link>}
                              {(roleTo[0]==="ROLE_CLIENT")&&
                              <Link class="" to={ `/profileC/${to.id}`} style={{textDecoration:"none"}}>
                                 <i class="fa fa-info-circle "  style={{color:"#06868D",marginLeft:"680px",fontSize:"20px"}}></i>
                              </Link>}
                              {(roleTo[0]==="ROLE_MEMBRE")&&
                              <Link class="" to={ `/profileM/${to.id}`} style={{textDecoration:"none"}}>
                                 <i class="fa fa-info-circle "  style={{color:"#06868D",marginLeft:"680px",fontSize:"20px"}}></i>
                              </Link>}
                            </>}
                      </div>
                       <hr />
                       <div   class="message mb-2" style={{fontSize:"13px"}} >
                       {messages.map((item,index)=>
                        <> 
                          {item.fromUser.id===user1.id&&
                            <div class="row scroll mb-2">
                                <div class="col-7"></div>
                          <div class="col-4 pt-1" style={{backgroundColor:"#06868D",borderRadius:"6px",color:"white"}}>{(jwt_decode(item.contenu)).contenu}</div> 
                          <div class="col-1">
                              {item.fromUser.photo&&
                               <img class="rounded-circle border  " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require(`../../assets/uploads/${item.fromUser.photo}`)} width="32px" height="32px" alt=""/>
                              }
                              {!item.fromUser.photo  &&  <img class="rounded-circle border " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require('../../assets/img/logos/user.png')} width="32px" height="32px" alt="Profile image"/>} 
                             </div>
                             <span  class="mt-1" style={{fontSize:"10px",color:"gray",marginLeft:"735px"}}> {item.dateEnvoi} {item.heureEnvoi}  
                             {item.messageLu===false&&
                             <>
                             <i class="me-1 fa fa-check-circle-o" style={{fontSize:"13px"}}></i>
                             </>
                             }
                              {item.messageLu===true&&
                             <>
                             {item.toUser.photo&&
                               <img class=" me-1 rounded-circle border  " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require(`../../assets/uploads/${item.toUser.photo}`)} width="20px" height="20px" alt=""/>
                              }
                              {!item.toUser.photo  &&  <img class="me-1 rounded-circle border " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require('../../assets/img/logos/user.png')} width="20px" height="20px" alt="Profile image"/>} 
                             </>
                             }
                             </span>
                             
                          </div> }
                          
                          {item.toUser.id===user1.id&&
                          <div class="row scroll mb-2">
                            <div class="col-1">
                              {item.toUser.photo&&
                               <img class="rounded-circle border  " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require(`../../assets/uploads/${item.toUser.photo}`)} width="32px" height="32px" alt=""/>
                              }
                              {!item.toUser.photo  &&  <img class="rounded-circle border " style={{borderColor:"#06868D",borderRadius:"20px",backgroundColor:"white"}} src={require('../../assets/img/logos/user.png')} width="32px" height="32px" alt="Profile image"/>} 
                             </div>
                          <div class="col-4 pt-1" style={{backgroundColor:"#ECF3FF",borderRadius:"6px"}}>
                            {(jwt_decode(item.contenu)).contenu}</div>
                            <span  class="mt-1" style={{fontSize:"10px",color:"gray",marginLeft:"290px"}}> {item.dateEnvoi} {item.heureEnvoi} </span>
                            </div> }
                        </>)}
                      
                       </div>
                       <div class="row ">
                            <div class="col-11 mb-3">
                               <input type="text" class="form-control "value={text}  onChange={(e)=> setText(e.target.value)} name="message" placeholder="Message..." required style={{backgroundColor:"white",borderColor:"#06868D"}}/>
                            </div>
                           <div class="col-1">
                                <a class="ms-1" id="UserDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false" style={{textDecoration:"none"}}>
                                   <span   > 😊</span>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
                                    <div class="dropdown-header text-center">
                                      <EmojiPicker
                                          onEmojiClick={onClick}
                                          autoFocusSearch={false}
                                          emojiStyle={EmojiStyle.NATIVE}
                                         style={{fontSize:"12px"}}
                                         />
                                    </div>
                                </div>
                                <i type="button" onClick={(text) => {onSubmitHandler()}} class="fa fa-paper-plane mt-2" style={{ fontSize:"14px",backgroundColor:"white",color:"#06868D" }}></i>
                            </div>
                       </div>
                    </div>
                 
                    </>
}                 
</>
 )
}

  

