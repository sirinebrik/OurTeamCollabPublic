import React,{ useEffect, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link,useNavigate,useParams } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import Sidebar from "../Page/Sidebar";
import Navbar from "../Page/Navbar";
import {ZIMKitManager,Common} from "@zegocloud/zimkit-react";
import "@zegocloud/zimkit-react/index.css";



export default function Chat() {
    let user1 = jwt_decode(localStorage.getItem("token"));
    let role1=user1.roles[0]  

    const [state,setState]= useState(
       { appConfig:{
        appId:1787527237,
        serverSecret:'ae9c34a63a71d9026282fbb66345d3d2'},
        userInfo:{
            userID:user1.id,
            userName:user1.name,
            userAvatarUrl:''
        } }
    )
    useEffect(()=>{
const init=async()=>{
    const zimKit=new ZIMKitManager();
    const token=zimKit.generateKitTokenForTest(
       state.appConfig.appId,
        state.appConfig.serverSecret,
        state.userInfo.userID);
    await zimKit.init(state.appConfig.appId);
    await zimKit.connectUser(state.userInfo,token);
}
init()
    },[])

     
return (
<>
<div>
<Common></Common>
</div>
</>
 )
}

  

