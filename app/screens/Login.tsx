import { CommonActions, StackActions, useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const auth = FIREBASE_AUTH;
	const navigation = useNavigation();
	const signUp = async () => {
		Keyboard.dismiss();
		setLoading(true);
		try {
			const res = await createUserWithEmailAndPassword(auth, email, password);
			alert("User created!");
			navigation.dispatch(StackActions.replace("Todo"));
		} catch (error: any) {
			console.log(error);
			alert("Sign up failed: " + error.message);
		} finally {
			setEmail("");
			setPassword("");
			setLoading(false);
		}
	};
	const login = async () => {
		Keyboard.dismiss();
		setLoading(true);
		try {
			const res = await signInWithEmailAndPassword(auth, email, password);
			navigation.dispatch(StackActions.replace("Todo"));
		} catch (error: any) {
			console.log(error);
			alert("Login failed: " + error.message);
		} finally {
			setEmail("");
			setPassword("");
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="Email"
				onChangeText={(text: string) => setEmail(text)}
				autoCapitalize="none"
				value={email}
			/>
			<TextInput
				style={styles.input}
				secureTextEntry={true}
				placeholder="Password"
				autoCapitalize="none"
				onChangeText={(text: string) => setPassword(text)}
				value={password}
			/>
			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" />
			) : (
				<>
					<TouchableOpacity style={styles.button} onPress={login}>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={signUp}>
						<Text style={styles.buttonText}>Create your account</Text>
					</TouchableOpacity>
				</>
			)}
		</View>
	);
};

export default Login;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	input: {
		height: 40,
		marginVertical: 5,
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		width: "100%",
	},
	button: {
		backgroundColor: "#274690",
		borderRadius: 5,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
		width: "100%",
	},
	buttonText: {
		color: "#fff",
	},
});
