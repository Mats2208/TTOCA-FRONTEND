import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";  
import NotFoundpage from "./pages/404";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Profile from "./pages/Profile";  
import Pricing from "./pages/Pricing";
import Service from "./pages/Service";
import CrearProyecto from "./pages/CrearProyecto";
import MonitorView from "./pages/MonitorView";
import EntradaView from "./pages/EntradaView";
import AdminView from "./pages/AdminView";
import VerificarTurnoView from "./pages/VerificarTurnoView";
import MiTurnoView from "./pages/MiTurnoView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Dashboard/:id" element={<Dashboard />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/Servicios" element={<Service />} />
        <Route path="*" element={<NotFoundpage />} />
        <Route path="/CrearProyecto" element={<CrearProyecto />} />
        <Route path="/monitor/:empresaId/:colaId" element={<MonitorView />} />
        <Route path="/entrada/:empresaId/:colaId" element={<EntradaView />} />
        <Route path="/admin/:empresaId/:colaId" element={<AdminView />} />
        <Route path="/verificar-turno" element={<VerificarTurnoView />} />
        <Route path="/mi-turno/:empresaId" element={<MiTurnoView />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
