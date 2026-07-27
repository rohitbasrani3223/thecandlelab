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
import { CMSBuilderModule } from "@/components/modules/CMSBuilderModule";
import { MarketingModule } from "@/components/modules/MarketingModule";
import { AnalyticsHubModule } from "@/components/modules/AnalyticsHubModule";
import { OperationsModule } from "@/components/modules/OperationsModule";
import { SystemSettingsModule } from "@/components/modules/SystemSettingsModule";
import { SupportLiveChatModule } from "@/components/modules/SupportLiveChatModule";

interface EnterpriseAdminSystemProps {
  onOpenCollectionsModal?: () => void;
}

export const EnterpriseAdminSystem: React.FC<EnterpriseAdminSystemProps> = () => {
  const { showToast, collections } = useStore();
  const [activeModule, setActiveModule] = useState<string>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleQuickAction = (action: string) => {
    if (action === "new-product") { setActiveModule("products"); showToast("Opened Product Atelier 🛍️"); }
    else if (action === "new-coupon") { setActiveModule("coupons"); showToast("Opened Coupons Hub 🎟️"); }
    else if (action === "db-backup") { setActiveModule("settings"); showToast("Database Backup Sync Completed 💾"); }
  };

  const PAGE_TITLES: Record<string, string> = {
    overview: "Executive Dashboard",
    orders: "Orders & Fulfillment",
    products: "Products Atelier Catalog",
    categories: "Categories & Taxonomy",
    collections: "Curated Collections",
    customers: "Customer CRM 360°",
    coupons: "Coupons & Discounts",
    offers: "Offers & Flash Sales",
    banners: "Hero & Banner CMS",
    reviews: "Reviews & Customer Ratings",
    cms: "CMS & Storefront Studio",
    reports: "Enterprise Reports & GMV Analytics",
    settings: "Atelier System Settings",
    alerts: "Audit History & Security Logs"
  };

  return (
    <div
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      className="min-h-screen bg-[#FAF7F2] text-[#1F1F1F] flex flex-col antialiased"
    >
      {/* Top Command Bar */}
      <TopCommandBar
        onOpenCmdK={() => setIsCmdKOpen(true)}
        onToggleNotifications={() => setIsNotificationsOpen((p) => !p)}
        onQuickAction={handleQuickAction}
      />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <SmartSidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#FAF7F2]">
          {/* Breadcrumb sub-header */}
          <div className="sticky top-0 z-20 bg-[#FAF7F2] border-b border-[#E6DFD3] px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#78716C] font-semibold">The Candle Lab Admin</span>
              <span className="text-[11px] text-[#C8A75A]">/</span>
              <span className="text-[11px] font-bold text-[#1F1F1F] font-serif">{PAGE_TITLES[activeModule] || activeModule}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                PostgreSQL Live Connected
              </span>
            </div>
          </div>

          <div className="p-6">
            {activeModule === "overview"    && <AdminOverviewModule />}
            {activeModule === "orders"      && <OrderManagementModule />}
            {activeModule === "products"    && <ProductManagementModule />}
            {activeModule === "categories"  && <ProductManagementModule />}
            {activeModule === "collections" && <ProductManagementModule />}
            {activeModule === "customers"   && <CustomerCRMModule />}
            {activeModule === "coupons"     && <MarketingModule />}
            {activeModule === "offers"      && <MarketingModule />}
            {activeModule === "banners"     && <CMSBuilderModule />}
            {activeModule === "reviews"     && <CustomerCRMModule />}
            {activeModule === "cms"         && <CMSBuilderModule />}
            {activeModule === "reports"     && <AnalyticsHubModule />}
            {activeModule === "settings"    && <SystemSettingsModule />}
            {activeModule === "alerts"      && <OperationsModule />}
          </div>
        </main>
      </div>

      {/* Modals */}
      <RaycastCommandPalette
        isOpen={isCmdKOpen}
        onClose={() => setIsCmdKOpen(false)}
        onSelectModule={(mod) => setActiveModule(mod)}
      />
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

