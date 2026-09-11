import { MainTabParamList } from "@/app/navigation/types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { mainTabConfig } from "@/app/navigation/tab-config";

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator>
      {mainTabConfig.map((tab) => (
        <Tab.Screen key={tab.name} {...tab} />
      ))}
    </Tab.Navigator>
  );
};
