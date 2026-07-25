"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { SmartSidebar } from "@/components/shell/SmartSidebar";
import { TopCommandBar } from "@/components/shell/TopCommandBar";
import { RaycastCommandPalette } from "@/components/shell/RaycastCommandPalette";
import { NotificationsDrawer } from "@/components/shell/NotificationsDrawer";

import { AdminOverviewModule } from "@/components/modules/AdminOverviewModule";
import { OrderManagementModule } from "@/components/modules/OrderManagementModule";
import { ProductManagementModule } from "@/components/modules/ProductManagementModule";
import { CustomerCRMModule } from "@/components/modules/CustomerCRMModule";
import { SellerManagementModule } from "@/components/modules/SellerManagementModule";
import { CMSBuilderModule } from "@/components/modules/CMSBuilderModule";
import { MarketingModule } from "@/components/modules/MarketingModule";
import { AnalyticsHubModule } from "@/components/modules/AnalyticsHubModule";
import { OperationsModule } from "@/components/modules/OperationsModule";
import { SystemSettingsModule } from "@/components/modules/SystemSettingsModule";
import { SupportLiveChatModule } from "@/components/modules/SupportLiveChatModule";

interface EnterpriseAdminSystemProps {
  onOpenCollectionsModal?: () => void;
}

export const EnterpriseAdminSystem: React.FC<EnterpriseAdminSystemProps> = ({ onOpenCollectionsModal }) => {
  const { showToast } = useStore();
  const [activeModule, setActiveModule] = useState<string>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals state
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleQuickAction = (action: string) => {
    if (action === "new-product") {
      setActiveModule("products");
      showToast("Opened Product CMS to create new SKU 🛍️");
    } else if (action === "new-coupon") {
      setActiveModule("marketing");
      showToast("Opened Marketing Hub to activate coupon 🎟️");
    } else if (action === "db-backup") {
      setActiveModule("settings");
      showToast("Database backup trigger initialized 💾");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Top Enterprise Command Bar */}
      <TopCommandBar
        onOpenCmdK={() => setIsCmdKOpen(true)}
        onToggleNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        onQuickAction={handleQuickAction}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden max-w-[1700px] w-full mx-auto">
        {/* Smart Sidebar */}
        <SmartSidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Main Work Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
          {activeModule === "overview" && <AdminOverviewModule />}
          {activeModule === "orders" && <OrderManagementModule />}
          {activeModule === "products" && <ProductManagementModule />}
          {activeModule === "customers" && <CustomerCRMModule />}
          {activeModule === "sellers" && <SellerManagementModule />}
          {activeModule === "cms" && <CMSBuilderModule />}
          {activeModule === "marketing" && <MarketingModule />}
          {activeModule === "analytics" && <AnalyticsHubModule />}
          {activeModule === "operations" && <OperationsModule />}
          {activeModule === "settings" && <SystemSettingsModule />}
          {activeModule === "support" && <SupportLiveChatModule />}
        </main>
      </div>

      {/* Raycast Command Palette Modal */}
      <RaycastCommandPalette
        isOpen={isCmdKOpen}
        onClose={() => setIsCmdKOpen(false)}
        onSelectModule={(mod) => setActiveModule(mod)}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};
