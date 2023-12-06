import { AntDesign, Entypo } from "@expo/vector-icons";
import { NavigationProp, StackActions } from "@react-navigation/native";
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../AuthContext";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";

export interface Todo {
	id: string;
	userId: string;
	title: string;
	done: boolean;
}

interface RouterProps {
	navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(true);
	const [todo, setTodo] = useState("");
	const [editing, setEditing] = useState(false);
	const [todoId, setTodoId] = useState<string | null>(null);
	const { user } = useAuth();

	useEffect(() => {
		const todosRef = collection(FIREBASE_DB, "todos");
		const subscriber = onSnapshot(todosRef, {
			next: (snapshot) => {
				const todos: Todo[] = [];
				snapshot.docs.forEach((doc) => {
					const todoData = doc.data() as Todo;
					if (todoData.userId === user?.uid) {
						todos.push({ id: doc.id, userId: todoData.userId, title: todoData.title, done: todoData.done });
					}
				});
				setTodos(todos);
				setLoading(false);
			},
		});
		return () => subscriber();
	}, []);
	const addTodo = async () => {
		setTodo("");
		if (editing && todoId) {
			const todoRef = doc(FIREBASE_DB, `todos/${todoId}`);
			await updateDoc(todoRef, { title: todo });
			setEditing(false);
			setTodoId(null);
		} else {
			await addDoc(collection(FIREBASE_DB, "todos"), { title: todo, done: false, userId: user?.uid });
		}
	};
	const editTodo = async (item: Todo) => {
		setEditing(true);
		setTodoId(item.id);
		setTodo(item.title);
	};
	const renderTodos = ({ item }: any) => {
		const todoRef = doc(FIREBASE_DB, `todos/${item.id}`);
		const toggleDone = async () => {
			updateDoc(todoRef, { done: !item.done });
		};
		const deleteItem = async () => {
			deleteDoc(todoRef);
		};
		return (
			<View style={styles.todoContainer}>
				<TouchableOpacity style={styles.todo} onPress={toggleDone}>
					{item.done && <AntDesign name="checkcircleo" size={30} color="green" />}
					{!item.done && <Entypo name="circle" size={30} color="black" />}
					<Text style={styles.todoText}>{item.title}</Text>
				</TouchableOpacity>
				<AntDesign name="edit" size={30} color="black" style={{ marginRight: 5 }} onPress={() => editTodo(item)} />
				<AntDesign name="delete" size={30} color="red" onPress={deleteItem} />
			</View>
		);
	};
	const emptyView = () => {
		return loading ? (
			<ActivityIndicator animating={loading} size="large" color="#0000ff" />
		) : (
			<View style={{ flex: 1, alignItems: "center" }}>
				<Text>No todos available!</Text>
			</View>
		);
	};
	const handleLogout = () => {
		FIREBASE_AUTH.signOut();
	};

	return (
		<View style={styles.container}>
			<View style={styles.form}>
				<TextInput
					style={styles.input}
					placeholder="Add new todo"
					onChangeText={(text: string) => setTodo(text)}
					value={todo}
				/>
				<Button onPress={addTodo} title="Add Todo" disabled={todo === ""} />
			</View>
			<FlatList
				data={todos}
				renderItem={renderTodos}
				keyExtractor={(item: Todo) => item.id}
				ListEmptyComponent={emptyView}
			/>
			<TouchableOpacity style={styles.button} onPress={handleLogout}>
				<Text style={styles.buttonText}>Logout</Text>
			</TouchableOpacity>
		</View>
	);
};

export default List;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20,
	},
	form: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 15,
	},
	input: {
		height: 40,
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginVertical: 10,
		flex: 1,
		marginRight: 10,
	},
	todoContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 5,
		backgroundColor: "#fff",
		padding: 10,
		borderRadius: 5,
	},
	todo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	todoText: {
		flex: 1,
		paddingHorizontal: 5,
	},
	button: {
		backgroundColor: "#274690",
		borderRadius: 5,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
	},
	buttonText: {
		color: "#fff",
	},
});
