// hooks/useEmployees.js

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../service/employeeService";


// ==============================
// GET ALL EMPLOYEES
// ==============================

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
};


// ==============================
// GET SINGLE EMPLOYEE
// ==============================

export const useEmployee = (id) => {
  return useQuery({
    queryKey: ["employee", id],

    queryFn: () =>
      getEmployeeById(id),

    enabled: !!id,
  });
};


// ==============================
// CREATE EMPLOYEE
// ==============================

export const useCreateEmployee = () => {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: createEmployee,

    onSuccess: () => {

      // REFRESH EMPLOYEES
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

    },
  });
};


// ==============================
// UPDATE EMPLOYEE
// ==============================

export const useUpdateEmployee = () => {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: ({ id, data }) =>
      updateEmployee(id, data),

    onSuccess: (_, variables) => {

      // REFRESH EMPLOYEES LIST
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      // REFRESH SINGLE EMPLOYEE
      queryClient.invalidateQueries({
        queryKey: [
          "employee",
          variables.id,
        ],
      });

    },
  });
};


// ==============================
// DELETE EMPLOYEE
// ==============================

export const useDeleteEmployee = () => {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: deleteEmployee,

    onSuccess: () => {

      // REFRESH EMPLOYEES
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

    },
  });
};