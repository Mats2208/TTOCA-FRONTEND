import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import HeaderDashboard from "../components/HeaderDashboard"

const Dashboard = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const session = localStorage.getItem("ttoca_session")
    if (!session) {
      navigate("/login")
    }
  }, [])

  return (
  <div>
    <HeaderDashboard /> 
    <h1
    className="py-20">Hola Dashboard</h1>
  </div>
)
}

export default Dashboard
