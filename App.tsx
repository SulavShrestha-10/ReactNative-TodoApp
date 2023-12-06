import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./AuthContext";
import List from "./app/screens/List";
import Login from "./app/screens/Login";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const InsideLayout = () => {
	return (
		<InsideStack.Navigator>
			<InsideStack.Screen name="Todo List" component={List} />
		</InsideStack.Navigator>
	);
};
const AuthNavigator = () => {
	const { user } = useAuth();
	console.log("User: ", user);

	return (
		<Stack.Navigator initialRouteName="Login">
			{user ? (
				<Stack.Screen name="Todo" component={InsideLayout} options={{ headerShown: false }} />
			) : (
				<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
			)}
		</Stack.Navigator>
	);
};
export default function App() {
	return (
		<AuthProvider>
			<NavigationContainer>
				<AuthNavigator />
			</NavigationContainer>
		</AuthProvider>
	);
}
