import Api from "../api/api";

export const getProjects = async () => {
    const response = await Api.get("/projects");
    return response.data;
};

export const getProjectById = async (id) => {
  const response = await Api.get(`/projects/${id}`);
  return response.data;
};

// CREATE
export const createProject = async (data) => {
    const response = await Api.post("/projects", data);
    return response.data;
};


// UPDATE
export const updateProject = async ({ id, data }) => {
    const response = await Api.put(`/projects/${id}`, data);
    return response.data;
};


// DELETE
export const deleteProject = async (id) => {
    const response = await Api.delete(`/projects/${id}`);
    return response.data;
};