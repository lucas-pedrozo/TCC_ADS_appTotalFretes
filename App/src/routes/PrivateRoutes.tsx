import React, { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useNavigation } from "@react-navigation/native";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" as never }],
      });
    }
  }, [isAuthenticated, navigation]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default PrivateRoute;