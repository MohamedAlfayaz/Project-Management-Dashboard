import API from "../api/api";


// GET ALL EMPLOYEES
export const getEmployees = async () => {
    const response = await API.get("/employees");
    return response.data;
};



// GET EMPLOYEE BY ID
export const getEmployeeById = async (id) => {
    const response = await API.get(
        `/employees/${id}`
    );
    return response.data;
};



// CREATE EMPLOYEE
export const createEmployee = async (
    employeeData
) => {
    const response = await API.post(
        "/employees",
        employeeData,
    );
    return response.data;
};



// UPDATE EMPLOYEE
export const updateEmployee = async (
    id,
    employeeData
) => {
    const response = await API.put(
        `/employees/${id}`,
        employeeData
    );
    return response.data;
};



// DELETE EMPLOYEE
export const deleteEmployee = async (
    id
) => {
    const response = await API.delete(
        `/employees/${id}`
    );
    return response.data;
};