import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  IconButton,
  Checkbox,
  Paper,
  AppBar,
  Toolbar,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Delete, ExitToApp, Add } from "@mui/icons-material";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Create a query against the todos collection
    const q = query(
      collection(db, "todos"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    // Listen for realtime updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosData = [];
      querySnapshot.forEach((doc) => {
        todosData.push({ id: doc.id, ...doc.data() });
      });
      setTodos(todosData);
    });

    return unsubscribe;
  }, [currentUser, navigate]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    await addDoc(collection(db, "todos"), {
      text: newTodo,
      completed: false,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setNewTodo("");
  };

  const handleToggleComplete = async (id, completed) => {
    await updateDoc(doc(db, "todos", id), {
      completed: !completed,
    });
  };

  const handleDeleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleFilterChange = (e, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // 'all' filter
  });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<ExitToApp />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Todos
          </Typography>

          <Box
            component="form"
            onSubmit={handleAddTodo}
            sx={{ display: "flex", mb: 3 }}
          >
            <TextField
              fullWidth
              label="Add a new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
              startIcon={<Add />}
            >
              Add
            </Button>
          </Box>

          <Box sx={{ mb: 2 }}>
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleFilterChange}
              aria-label="todo filter"
              size="small"
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="active">Active</ToggleButton>
              <ToggleButton value="completed">Completed</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider />

          <List>
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <ListItem
                  key={todo.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteTodo(todo.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    onClick={() =>
                      handleToggleComplete(todo.id, todo.completed)
                    }
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={todo.completed}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={todo.text}
                      sx={{
                        textDecoration: todo.completed
                          ? "line-through"
                          : "none",
                        color: todo.completed
                          ? "text.secondary"
                          : "text.primary",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary={
                    filter === "all"
                      ? "No todos yet. Add one above!"
                      : `No ${filter} todos`
                  }
                  sx={{ textAlign: "center", color: "text.secondary", py: 2 }}
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Container>
    </>
  );
}
