"use client";

import React from "react";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";

const NavBarServices: React.FC<{ service?: string }> = () => {
  return <TrainNavigation />;
};

export default NavBarServices;
