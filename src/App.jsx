import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails"
import Tasks from "./pages/Tasks";
import SideNav from "./components/SideNav";
import TaskBoard from "./pages/TaskBoard";
import TaskDetails from "./pages/TaskDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SideNav />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="taskboard" element={<TaskBoard />} />
          <Route path="tasks/:id" element={<TaskDetails /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;