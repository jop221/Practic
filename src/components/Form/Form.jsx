import { useState } from "react";
import "./form.scoped.css";

export default function Form({ addTask }) {
  const [name, setName] = useState("");

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (name === "") {
      return;
    }
    addTask(name);
    setName("");
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <label id="todoInput" />
      <input
        className="add-task-input"
        type="text"
        placeholder="Create a new task..."
        name="todoInput"
        value={name}
        onChange={handleChange}
        maxLength="75"
      />
      <button className="add-button" type="submit">
        Add<span className="visually-hidden"> task</span>
      </button>
    </form>
  );
}
