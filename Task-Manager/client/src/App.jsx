import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Project";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/Layout";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Layout Routes (Navbar visible) */}
                <Route element={<MainLayout />}>

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["Admin", "Member"]}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* PROJECT LIST */}
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute allowedRoles={["Admin", "Member"]}>
                                <Projects />
                            </ProtectedRoute>
                        }
                    />

                    {/* PROJECT DETAILS (IMPORTANT) */}
                    <Route
                        path="/projects/:projectId"
                        element={
                            <ProtectedRoute allowedRoles={["Admin", "Member"]}>
                                <ProjectDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* CREATE PROJECT */}
                    <Route
                        path="/create-project"
                        element={
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <CreateProject />
                            </ProtectedRoute>
                        }
                    />

                    {/* TASKS */}
                    <Route
                        path="/tasks"
                        element={
                            <ProtectedRoute allowedRoles={["Admin", "Member"]}>
                                <Tasks />
                            </ProtectedRoute>
                        }
                    />

                    {/* CREATE TASK */}
                    <Route
                        path="/create-task"
                        element={
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <CreateTask />
                            </ProtectedRoute>
                        }
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;