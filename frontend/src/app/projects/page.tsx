"use client";

import React from "react";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

export default function ProjectsPage() {
  return (
    <div className="page-projects p-6 sm:p-8 space-y-6">
      <ProjectGrid />
    </div>
  );
}
