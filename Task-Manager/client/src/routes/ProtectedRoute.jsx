import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))

    if (!token) {
        return <Navigate to="/login" />
    }

    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
        return <Navigate to={user?.role === "Admin" ? "/dashboard" : "/tasks"} />
    }

    return children
}

export default ProtectedRoute