import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { useNavigation } from "@react-navigation/native";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Start" as never }],
      });
    }
  }, [isAuthenticated, navigation]);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default PrivateRoute;