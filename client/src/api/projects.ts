import { http } from "./http";
import type { Project } from "../types";

export const getProjects = async () => {
  return await http.get<Project[]>("/api/projects") as any as Project[];
};

export const getProjectBySlug = async (slug: string) => {
  return await http.get<Project>(`/api/projects/${slug}`) as any as Project;
};
