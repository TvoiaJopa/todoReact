import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TextInput,
} from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "todos";

export default function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const addTodo = () => {
    const newKey = String(todos.length);
    const object = { key: newKey, description: newTodo };
    const newTodos = [...todos, object];
    storeData(newTodos);
    setTodos(newTodos);
    setNewTodo("");
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        const parsedData = JSON.parse(jsonValue);
        setTodos(parsedData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Todos</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new todo..."
        value={newTodo}
        onChangeText={(text) => setNewTodo(text)}
        returnKeyType="done"
        onSubmitEditing={addTodo}
      />
      <FlatList
        style={styles.list}
        data={todos}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item }) => <Text>{item.description}</Text>}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FAFAFA",
    height: 40,
    margin: 8,
  },
  list: {
    margin: 8,
  },
});
