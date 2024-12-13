import './App.css';
import {HashRouter,Routes,Route} from 'react-router-dom'

import Login from './pages/Login';
import SessionTimeout from './pages/SessionTimeout';
import AgentNavbar from './AgentNavbar/AgentNavbar';

import Dashboard from './AgentPages/Dashboard';

import Nextstep from './AgentPages/Nextstep';
import Bankdetails from './AgentPages/Bankdetails';
import AttachBtn from  './AgentPages/AttachBtn';
import Nomineedetails from './AgentPages/Nomineedetails';

import Agenttreegridview from './AgentPages/Agenttreegridview';
import AgentPasswordreset from './AgentPages/AgentPasswordreset';
import AgentProductlist from './AgentPages/AgentProductlist';
import AgentPolicyselling from './AgentPages/AgentPolicyselling';
import Agentincentiveslist from './AgentPages/Agentincentiveslist';

import PasswordResetMain from './AgentPages/PasswordResetMain';
import AgentTermsandCondition from './AgentPages/AgentTermsandCondition';
import Agentfaq from './AgentPages/Agentfaq';


function App() {
  return (
    <HashRouter>
      
    <div className="App">
 <SessionTimeout/>
      <Routes>
       <Route path='/' element={<Login/>}/>
       
       
       
       

{/* ----------------------------------------Agent Screens-------------------------------------- */}
     <Route path='/agentnavbar' element={<AgentNavbar/>}/>
     <Route path='/dashboard' element={<Dashboard/>}/>
     <Route path='/nextstep' element={<Nextstep/>}/>
     <Route path='/bankdetails' element={<Bankdetails/>}/>
     <Route path='/attachbtn' element={<AttachBtn/>}/>
     <Route path='/nomineedetails' element={<Nomineedetails/>}/>
     
   
     <Route path='/baBelowdata' element={<Agenttreegridview/>}/>
     <Route path='/agentpasswordreset' element={<AgentPasswordreset/>}/>
     <Route path='/agentproductlist' element={<AgentProductlist/>}/>
     <Route path='/agentpolicyselling' element={<AgentPolicyselling/>}/>
     <Route path='/agentincentivelist' element={<Agentincentiveslist/>}/>

     <Route path='/agentTermsandCondition' element={<AgentTermsandCondition/>}/>
     <Route path='/passwordResetMain' element={<PasswordResetMain/>}/>
     <Route path='/agentfaq' element={<Agentfaq/>}/>

{/* -----------------------------------Admin screens---------------------- */}
   

      </Routes>
    
    </div>
    </HashRouter>
  );
}

export default App;