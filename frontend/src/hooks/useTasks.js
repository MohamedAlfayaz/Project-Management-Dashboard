// hooks/useTasks.js

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} from "../service/taskService";


// ==========================
// GET ALL TASKS
// ==========================

export const useTasks = () => {

  return useQuery({

    queryKey: ["tasks"],

    queryFn: getTasks,

  });
};

export const useTaskById = (id) => {

  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTaskById(id),
  });
};

// ==========================
// CREATE TASK
// ==========================

export const useCreateTask = () => {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: createTask,

    onSuccess: () => {

      // REFRESH TASKS
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

    },
  });
};


// ==========================
// UPDATE TASK
// ==========================

export const useUpdateTask = () => {

  const queryClient =
    useQueryClient();

  return useMutation({

    // ✅ IMPORTANT
    mutationFn: ({
      id,
      data,
    }) =>
      updateTask(id, data),

    onSuccess: () => {

      // REFRESH TASKS
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

    },
  });
};


// ==========================
// DELETE TASK
// ==========================

export const useDeleteTask = () => {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: deleteTask,

    onSuccess: () => {

      // REFRESH TASKS
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

    },
  });
};