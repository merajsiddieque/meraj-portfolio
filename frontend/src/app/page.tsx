"use client";

import React from "react";
import { MinimalHero } from "@/components/dashboard/MinimalHero";
import { FeaturedProjectsGrid } from "@/components/dashboard/FeaturedProjectsGrid";
import { KeyInfoCards } from "@/components/dashboard/KeyInfoCards";

export default function Home() {
  return (
    <div className="page-overview space-y-8">
      {/* 1. Hero Section */}
      <MinimalHero />

      {/* 2. Featured Projects 3-Column Grid */}
      <FeaturedProjectsGrid />

      {/* 3. Key Info Cards (4 Columns) & Signature Quote */}
      <KeyInfoCards />
    </div>
  );
}
