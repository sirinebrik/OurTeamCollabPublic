import React,{ useEffect, useReducer, useState } from "react"
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom"


export default function List({idP,projetRole}) {
   
    const [tasks,setTasks]= useState([])
    const [type2,setType2]= useState("Tous")
    const [typeResponsable,setTypeResponsable]= useState("Tous")

    let user = jwt_decode(localStorage.getItem("token"));
    let role=user.roles[0]

       
const getTasks = (async () => {
    if(type2==="Tous"&&projetRole!=="client"&&projetRole!=="membre"&&typeResponsable==="Tous"){
    await Axios.get(`http://localhost:8000/tasksTousProjet/${idP}`
  ).then((response)=>{
    setTasks(response.data.task) 
 
  })} 
 if(typeResponsable!=="Tous"&&type2==="Tous"&&typeResponsable!=="null"){
    await Axios.get(`http://localhost:8000/tasksUserProjet/${idP}/${typeResponsable}`
      ).then((response)=>{
        setTasks(response.data.task) 
     
      }) }
      if(type2==="Mes"||(type2==="Tous"&&projetRole==="membre")){
        await Axios.get(`http://localhost:8000/tasksUserProjet/${idP}/${user.id}`
          ).then((response)=>{
            setTasks(response.data.task) 
         
          }) }
      if(type2==="Tous"&&projetRole==="client"){
        await Axios.get(`http://localhost:8000/tasksTousRéaliséProjet/${idP}`
          ).then((response)=>{
            setTasks(response.data.task) 
         
          }) }
         
          if(typeResponsable==="null"){
            await Axios.get(`http://localhost:8000/tasksNonAffectéProjet/${idP}`
              ).then((response)=>{
                setTasks(response.data.task) 
             
              }) }
});
  useEffect( () => {getTasks ();},[]);
 
const [usersProjet,setUsersProjet]= useState([])

//detailprojetUser
const getDetailProjet = (async () => {
await Axios.get(`http://localhost:8000/detailMembreProjet/${idP}`
)
.then((response)=>{
setUsersProjet(response.data.projet) 
})  });
useEffect( () => {getDetailProjet();},[]);
  

return (
<>
{(projetRole==="chefProjet")&&
        <>
            <div class="row  mb-3 ">
                <div class="col-7"></div>
                <div class="col-5">
                            <div class="row ">
                                <div class="col-6">     
                                {type2==="Tous"&&projetRole!=="client"&&
                                <select value={typeResponsable} style={{fontSize:"12px"}} onChange={ (e) => { setTypeResponsable(e.target.value)}}  onClick={ (e) => { getTasks();}}   class="form-select ">
                                <option value="Tous" selected > Tous les responsables</option>
                          {usersProjet.map((item,index)=>      
                        <>
                                <option   key={item.user.id} value={item.user.id}>   {item.user.username} {item.user.lastname}</option>       
                        </>)}  
                        <option value="null"  > Non affectées</option>

                            </select> }
                    </div>
                     <div class="col-6">
                     <select value={type2} style={{fontSize:"12px"}} onChange={ (e) => { setType2(e.target.value);setTypeResponsable("Tous")}}  onClick={ (e) => { getTasks();}}   class="form-select ">
                                <option value="Tous" selected > Toutes les  tâches</option>
                         
                                <option   value="Mes">  Mes tâches</option>  </select>      
           
                                </div>
                            </div>
                        </div>
                    </div>
           </>}
           {(role==="ROLE_ADMIN")&&
        <>
            <div class="row  mb-3 ">
                <div class="col-7"></div>
                <div class="col-5">
                            <div class="row ">
                            <div class="col-4"></div>
                                <div class="col-8">     
                                {type2==="Tous"&&projetRole!=="client"&&
                                <select value={typeResponsable} style={{fontSize:"12px"}} onChange={ (e) => { setTypeResponsable(e.target.value)}}  onClick={ (e) => { getDetailProjet();getTasks()}}   class="form-select ">
                                <option value="Tous" selected > Toutes les  tâches</option>
                          {usersProjet.map((item,index)=>      
                        <>
                                <option   key={item.user.id} value={item.user.id}>   {item.user.username} {item.user.lastname}</option>       
                        </>)}  
                        <option value="null"  > Non affectées</option>

                            </select> }
                    </div>
                 
                            </div>
                        </div>
                    </div>
           </>}

           
           <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr style={{color:"#06868D"}}>
                          <th>Titre</th>
                          <th> Phase</th>
                          <th> Etat</th>
                          <th> Responsable</th>
                          <th> Date début</th>
                          <th>Date Fin </th>
                          <th> Priorité</th>
                          <th> Taux d'avancement</th>
                         
                        </tr>
                      </thead>
                      <tbody  >
                     { tasks.map((item,index)=>(
                        <tr  >
                          <td ><div class="ms-4" style={{fontWeight:"bold"}}> 
                          {role!=="ROLE_ADMIN"&& <Link to={ `/detailTâche/${idP}/${item.id}/${projetRole}`} style={{textDecoration:"none",color:"black"}}  >{item.titre}</Link>}
  
                              {role==="ROLE_ADMIN"&& <Link to={ `/detailTâche/${idP}/${item.id}`} style={{textDecoration:"none",color:"black"}}  >{item.titre}</Link>}
                               </div>
                         </td>
                          <td>{item.etat.phase.titre}</td>
                          <td>{item.etat.titre}
                             {item.valide===true&&item.etat.titre==="Terminé"&&<span> (validée)</span>}
                             {item.valide===false&&item.etat.titre==="Terminé"&&<span> (réfusée)</span>}
                             {item.valide===null&&item.etat.titre==="Terminé"&&<span> (attendre la validation)</span>}
                             
                        </td>
                        <td>{item.user===null&& <span>non affectée</span>}
                          {item.user!==null&& 
                        <>   
                         <span>
                         {item.user.user.photo&& <img class="rounded-circle" src={require(`../../../assets/uploads/${item.user.user.photo}`)} width="25px" height="25px" title={item.user.user.username+" "+item.user.user.lastname}/>}
                        {!item.user.user.photo  &&  <img class="rounded-circle"  src={require('../../../assets/img/logos/user.png')} width="25px" height="25px" title={item.user.user.username+" "+item.user.user.lastname}/>}
                             </span>
                            <span className="col-9 mt-2 ms-2"  >{item.user.user.username} {item.user.user.lastname}</span>
                       </>            
                          }</td>
                          <td>{item.dateDebut}</td>
                          <td>{item.dateFin}</td>
                          <td>
                          {item.priorite==="Aucune"&&
                  <div class="pe-2" style={{backgroundColor:"rgb(184 188 194)",color:"white",borderRadius:"10px"}} >  
                    {item.priorite} 
                  </div> }   
                  {item.priorite==="Basse"&&
                  <div  class="pe-2"  style={{backgroundColor:"rgb(78, 205, 151)",color:"white",borderRadius:"10px"}} >  
                    {item.priorite} 
                  </div> }
                  {item.priorite==="Moyenne"&&
                  <div  class="pe-2"  style={{backgroundColor:"rgb(255, 198, 60)",color:"white",borderRadius:"10px"}} >  
                    {item.priorite}  
                  </div> }  
                  {item.priorite==="Haute"&&
                  <div class="pe-2"  style={{backgroundColor:"rgb(225, 45, 66)",color:"white",borderRadius:"10px"}} >  
                    {item.priorite} 
                  </div> } 
                          </td>
                          <td>
                          <div class="dropdown  pe-2">
                  <div class="progress " style={{height: `17px`}}>
                    {item.tauxAvancement==="0" &&<div   style={{fontSize:"9px",paddingLeft:"7px"}} >{item.tauxAvancement}%</div>}
                    {item.tauxAvancement>"0" &&   <div class="progress-bar" role="progressbar" style={{width: `${item.tauxAvancement}%`,fontSize:"9px"}} 
                    aria-valuenow={item.tauxAvancement} aria-valuemin="0" aria-valuemax="100">{item.tauxAvancement}%</div>}
                  </div>
                  </div>
                          </td>
                        </tr>))}
                      </tbody>
                    </table>
               </div> 

</>
       )
}

  

