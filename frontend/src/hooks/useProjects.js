import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../service/projectService";

// GET ALL PROJECTS
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};

export const useProject = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
};

// CREATE PROJECT
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

// UPDATE PROJECT
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

// DELETE PROJECT
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};