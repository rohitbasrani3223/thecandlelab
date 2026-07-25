"use client";

import React from "react";
import { EnterpriseAdminSystem } from "@/components/EnterpriseAdminSystem";

interface AdminDashboardProps {
  onOpenCollectionsModal?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenCollectionsModal }) => {
  return <EnterpriseAdminSystem onOpenCollectionsModal={onOpenCollectionsModal} />;
};
