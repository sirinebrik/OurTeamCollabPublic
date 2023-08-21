import React,{ useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  
} from "react-router-dom";
import './App.css';
import Login from "./components/Login/Login";
import ForgotPassword from "./components/Login/ForgotPassword";
import ResetPassword from "./components/Login/ResetPassword";
import { me } from "./service/user"
import EnvoiMail from './components/Login/EnvoiMail';
import Index from './components/Page/Index';
import UtilisateurPage from './components/Utilisateur/utilisateurPage/UtilisateurPage';
import Inscrire from './components/Login/Inscrire';
import InscriptionValide from './components/Login/InscriptionValide';
import DetailUtilisateur from './components/Utilisateur/utilisateurForm/DetailChefProjet';
import DetailChefProjet from './components/Utilisateur/utilisateurForm/DetailChefProjet';
import DetailClient from './components/Utilisateur/utilisateurForm/DetailClient';
import DetailMembre from './components/Utilisateur/utilisateurForm/DetailMembre';
import DetailAdmin from './components/Utilisateur/utilisateurForm/DetailAdmin';
import ProjetPage from './components/Projet/projetPage/ProjetPage';
import EspaceProjetPage from './components/EspaceProjet/EspaceProjetPage/EspaceProjetPage';
import ParametreProjet from './components/EspaceProjet/EspaceProjetForm/ParametreProjet';
import DetailProjet from './components/EspaceProjet/EspaceProjetForm/DetailProjet';
import EquipeProjet from './components/EspaceProjet/EspaceProjetForm/EquipeProjet';
import PhaseProjet from './components/EspaceProjet/EspaceProjetForm/PhaseProjet';
import EditTask from './components/EspaceProjet/EspaceProjetForm/EditTask';
import DetailTask from './components/EspaceProjet/EspaceProjetForm/DetailTask';
import EditTaskDuplicate from './components/EspaceProjet/EspaceProjetForm/EditTaskDuplicate';

import NavbarActivitésAdmin from './components/Activités/NavbarActivitésAdmin';
import NavbarActivitésChefProjet from './components/Activités/NavbarActivitésChefProjet';
import NavbarActivitésMembre from './components/Activités/NavbarActivitésMembre';
import NavbarActivitésClient from './components/Activités/NavbarActivitésClient';

import UtilisateurList from './components/Utilisateur/utilisateurList/UtilisateurList';
import ProjetList from './components/Projet/projetList/ProjetList';
import InscrireAdmin from './components/Login/InscrireAdmin';


function App() {
  const token = localStorage.getItem("token")
  const [user, setUser] = useState({})
  const [role, setRole] = useState("")
  useEffect(() => {
    const fetchMe = async () => {
      try{
      const user = await me()
      setUser(user)
      setRole(user.roles[0])
     }catch(e){

      }
    }
    fetchMe()
  }, [])
  if (!token||token==="undefined") {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes> 
          <Route path="/"
                 element={<Login/>}
                 title="Connexion"
          />
          <Route path="/forgotPassword"
                 element={<ForgotPassword/>}
                 title="ForgotPassword"
          />
          <Route path="/resetPassword/:token"
                 element={<ResetPassword/>}
                 title="ResetPassword"
          />
          <Route path="/envoiMail"
                 element={<EnvoiMail/>}
                 title="EnvoiMail"
          />
          <Route path="/inscrire/:token"
                 element={<Inscrire/>}
                 title="Inscrire"
          />
            <Route path="/inscrireOrganisation"
                 element={<InscrireAdmin/>}
                 title="InscrireAdmin"
          />
           <Route path="/inscriptionValide"
                 element={<InscriptionValide/>}
                 title="InscriptionValide"
          />
        </Routes> 
      </BrowserRouter>
    </div>
  );}
  if (token) {
    return (
      <div >
        <BrowserRouter>
          <Routes> 
            <Route path="/"
                   element={<Index/>}
                  
            />
            <Route path="/dashboard" 
                   element={<Index/>}
                  
            />
            {(role!=="ROLE_CLIENT") &&
            <Route path="/utilisateurs"
                   element={<UtilisateurList user={user} userRole={role}/>}
                  
            />}
             <Route path="/profile/:id"
                   element={<DetailChefProjet user={user} userRole={role}/>}
                  
            />
             <Route path="/profileC/:id"
                   element={<DetailClient user={user} userRole={role}/>}
                  
            />
                <Route path="/profileM/:id"
                   element={<DetailMembre user={user} userRole={role}/>}
                  
            />
               <Route path="/profileA/:id"
                   element={<DetailAdmin user={user} userRole={role}/>}
                  
            />
             <Route path="/projets"
                   element={<ProjetList user={user} userRole={role}/>}
                  
            />
            <Route path="/tableauDeBord/:id"
                   element={<EspaceProjetPage user={user} userRole={role}/>}
                  
            />
            
            
              
            
            {(role==="ROLE_CLIENT"||role==="ROLE_CHEFPROJET"||role==="ROLE_MEMBRE")&&
            <>
           
            <Route path="/parametreProjet/:id/:projetRole"
                   element={<ParametreProjet user={user} userRole={role}/>}/>
            <Route path="/equipeProjet/:id/:projetRole"
                   element={<EquipeProjet user={user} userRole={role}/>}/>
          
            <Route path="/detailProjet/:id/:projetRole"
                   element={<DetailProjet user={user} userRole={role}/>}
                        
            />
              <Route path="/tâcheProjet/:id/:projetRole"
                   element={<PhaseProjet user={user} userRole={role}/>}/>
                
              <Route path="/editTâche/:id/:idPh/:idT/:projetRole"
                   element={<EditTask user={user} userRole={role}/>}/>
              <Route path="/dupliquerTâche/:id/:idPh/:idT/:projetRole"
                   element={<EditTaskDuplicate user={user} userRole={role}/>}/> 
              <Route path="/detailTâche/:id/:idT/:projetRole"
                   element={<DetailTask user={user} userRole={role}/>}/>
             
                    <Route path="/activitésChefProjet"
               element={<NavbarActivitésChefProjet user={user} userRole={role}/>}/>
                 <Route path="/activitésMembre"
               element={<NavbarActivitésMembre user={user} userRole={role}/>}/>
                 <Route path="/activitésClient"
               element={<NavbarActivitésClient user={user} userRole={role}/>}/>
              </>  

              
                   }
             {(role==="ROLE_ADMIN")&&<>
            <Route path="/parametreProjet/:id"
                   element={<ParametreProjet user={user} userRole={role}/>}/>
            <Route path="/equipeProjet/:id"
                   element={<EquipeProjet user={user} userRole={role}/>}/>
                     <Route path="/detailProjet/:id"
                   element={<DetailProjet user={user} userRole={role}/>}/>
               <Route path="/tâcheProjet/:id"
                   element={<PhaseProjet user={user} userRole={role}/>}/>
                   <Route path="/detailTâche/:id/:idT"
                 element={<DetailTask user={user} userRole={role}/>}    />  
                   
               
                    <Route path="/activités"
               element={<NavbarActivitésAdmin user={user} userRole={role}/>}/>
              </>   
              
        
                
                   }
                  
           </Routes> 
        </BrowserRouter>
      </div>
    );}
}

export default App;
