import { useState } from "react";
import { WebSidebar } from "@/components/navigation/WebSidebar";
import { EnhancedWebDashboard } from "./EnhancedWebDashboard";
import { AIChat } from "./AIChat";
import { DetailedScheduleScreen } from "./DetailedScheduleScreen";
import { DetailedTaskScreen } from "./DetailedTaskScreen";
import { DetailedGroceryScreen } from "./DetailedGroceryScreen";
import { DetailedNotificationsScreen } from "./DetailedNotificationsScreen";
import { UserProfileScreen } from "./UserProfileScreen";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { FamilyManagementScreen } from "./FamilyManagementScreen";

export function WebAppContainer() {
  const [currentScreen, setCurrentScreen] = useState("home");

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setCurrentScreen("home");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#FFF5F0] via-[#E8F4F8] to-[#F0F8FF]">
      {/* Sidebar Navigation */}
      <WebSidebar currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {currentScreen === "home" && <EnhancedWebDashboard />}
        {currentScreen === "ai" && (
          <div className="h-full">
            <AIChat onBack={handleBack} />
          </div>
        )}
        {currentScreen === "schedule" && <DetailedScheduleScreen onBack={handleBack} />}
        {currentScreen === "tasks" && <DetailedTaskScreen onBack={handleBack} />}
        {currentScreen === "grocery" && <DetailedGroceryScreen onBack={handleBack} />}
        {currentScreen === "notifications" && <DetailedNotificationsScreen onBack={handleBack} />}
        {currentScreen === "family" && <FamilyManagementScreen onBack={handleBack} />}
        {currentScreen === "analytics" && <AnalyticsDashboard onBack={handleBack} />}
        {currentScreen === "settings" && <UserProfileScreen onBack={handleBack} onNavigate={handleNavigate} />}
      </div>
    </div>
  );
}
