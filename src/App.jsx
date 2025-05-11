import { useState, useRef, useEffect } from "react";
import LoginRegister from "./components/LoginRegister/LoginRegister";
import Form from "./components/Form/Form";
import Todo from "./components/Todo/Todo";
import { nanoid } from "nanoid";
import FilterButtons from "./components/FilterButtons/FilterButtons";
import useLocalStorage from "use-local-storage";
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import usePrevious from "./components/UsePrevious";
import "./App.scoped.css";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

  export default function App({ tasks }) {
    const [user, setUser] = useState(null);
    const [todos, setTodos] = useState(tasks);
    const [filter, setFilter] = useState("All");
    const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [theme, setTheme] = useLocalStorage(
      "theme",
      defaultDark ? "dark" : "light"
    );

    function logout() {
      localStorage.removeItem('token');
      setUser(null);
    }

  const filterButtons = {
    All: () => true,
    Active: todo => !todo.completed,
    Completed: todo => todo.completed
  };

  const filterNames = Object.keys(filterButtons);

  const taskList = todos
    .filter(filterButtons[filter])
    .map(todo => (
      <Todo
        id={todo.id}
        name={todo.name}
        key={todo.id}
        completed={todo.completed}
        editTask={editTask}
        deleteTask={deleteTask}
        handleToggleCompleted={handleToggleCompleted}
      />
    ));

  const buttonsList = filterNames.map(name => (
    <FilterButtons
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function switchTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }

  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name: name, completed: false };
    setTodos([...todos, newTask]);
  }

  function editTask(id, newName) {
    const editedTasks = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, name: newName };
      } else {
        return todo;
      }
    });
    setTodos(editedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = todos.filter(todo => todo.id !== id);
    setTodos(remainingTasks);
  }

  function handleToggleCompleted(id) {
    const updatedTasks = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
    });
    setTodos(updatedTasks);
  }

  function clearCompleted() {
    const activeTasks = todos.filter(todo => !todo.completed);
    setTodos(activeTasks);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over === null) {
      return;
    } else {
      if (active.id !== over.id) {
        setTodos(items => {
          const activeIndex = items.findIndex(item => item.id === active.id);
          const overIndex = items.findIndex(item => item.id === over.id);
          return arrayMove(items, activeIndex, overIndex);
        });
      }
    }
  }

  const taskCounterTextRef = useRef(null);
  const activeTasksNumber = todos.filter(filterButtons["Active"]).length;
  const itemsNoun = activeTasksNumber > 1 ? "items" : "item";
  const prevTodosLength = usePrevious(todos.length);

  useEffect(() => {
    if (prevTodosLength - todos.length === 1) {
      taskCounterTextRef.current.focus();
    }
  }, [todos.length, prevTodosLength]);

  if (!user) {
    return <LoginRegister onLoginSuccess={setUser} />;
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="App" data-theme={theme}>
        <div className="wrapper">
          <header>
            <h1>TODO</h1>
            <button onClick={switchTheme} style={{ color: theme === "dark" ? "hsl(0, 0%, 100%)" : "hsl(0, 0%, 0%)" }}>
              {theme === "dark" ? (
                <BsSunFill className="theme-btn" />
              ) : (
                <BsMoonFill className="theme-btn" />
              )}
              <span className="visually-hidden">
                Switch to {theme === "light" ? "dark" : "light"} theme
              </span>
            </button>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </header>
          <Form addTask={addTask} />
          <main className="todo-list-and-buttons-wrapper">
            <SortableContext
              items={todos}
              strategy={verticalListSortingStrategy}
            >
              <ul className="todo-list">{taskList}</ul>
            </SortableContext>

            <aside className="buttons-wrapper">
              <p className="task-counter" tabIndex="-1" ref={taskCounterTextRef}>
                {activeTasksNumber} {itemsNoun} left
              </p>
              <div className="filter-button-wrapper">{buttonsList}</div>
              <button className="clear-completed-btn" onClick={clearCompleted}>
                Clear Completed<span className="visually-hidden"> tasks</span>
              </button>
            </aside>
          </main>
          <footer>Drag and drop to reorder list</footer>
        </div>
      </div>
    </DndContext>
  );
}
