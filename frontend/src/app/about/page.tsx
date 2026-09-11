"use client";

import React from "react";
import { AboutSkillsSplit } from "@/components/dashboard/AboutSkillsSplit";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";

export default function AboutPage() {
  return (
    <div className="page-overview space-y-6">
      <AboutSkillsSplit />
      <JourneyTimeline />
    </div>
  );
}
