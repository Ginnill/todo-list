import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Planejamento");
  const [priority, setPriority] = useState("Baixa");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Aguardando");

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObject = {
        name: newTask.trim(),
        category,
        priority,
        dueDate: dueDate || "Não especificada",
        createdAt: new Date().toLocaleString(),
        status,
      };

      const updatedTasks = [...tasks, newTaskObject];
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      setNewTask("");
      setCategory("Planejamento");
      setPriority("Baixa");
      setDueDate("");
      setStatus("Aguardando");
    }
  };

  const editTask = (index) => {
    const taskToEdit = tasks[index];
    setEditingTaskIndex(index);
    setCategory(taskToEdit.category);
    setPriority(taskToEdit.priority);
    setDueDate(taskToEdit.dueDate === "Não especificada" ? "" : taskToEdit.dueDate);
    setStatus(taskToEdit.status);
  };

  const saveTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      category,
      priority,
      dueDate: dueDate || "Não especificada",
      status,
    };
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setEditingTaskIndex(null);
  };

  const removeTask = (index) => {
    const confirmRemove = window.confirm("Tem certeza que deseja remover esta tarefa?");
    if (confirmRemove) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">To-Do List</h1>

      <div className="task-form">
        <input
          type="text"
          placeholder="Nova Tarefa"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="task-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="task-select"
        >
          <option>Planejamento</option>
          <option>Design</option>
          <option>Desenvolvimento</option>
          <option>Revisão</option>
          <option>Entregue</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="task-select"
        >
          <option>Baixa</option>
          <option>Média</option>
          <option>Alta</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="task-input"
        />

        <button onClick={addTask} className="task-button">
          Adicionar
        </button>
      </div>

      <div className="task-tables">
        {tasks.map((task, index) => (
          <table key={index} className="task-table">
            <thead>
              <tr>
                <th>Tarefa</th>
                <th>Categoria</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`task-row priority-${task.priority}`}>
                <td>{task.name}</td>
                <td>
                  {editingTaskIndex === index ? (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="task-select"
                    >
                      <option>Planejamento</option>
                      <option>Design</option>
                      <option>Desenvolvimento</option>
                      <option>Revisão</option>
                      <option>Entregue</option>
                    </select>
                  ) : (
                    task.category
                  )}
                </td>
                <td>
                  {editingTaskIndex === index ? (
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="task-select"
                    >
                      <option>Baixa</option>
                      <option>Média</option>
                      <option>Alta</option>
                    </select>
                  ) : (
                    task.priority
                  )}
                </td>
                <td>
                  {editingTaskIndex === index ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="task-select"
                    >
                      <option>Aguardando</option>
                      <option>Pausado</option>
                      <option>Desenvolvimento</option>
                      <option>Finalizado</option>
                    </select>
                  ) : (
                    task.status
                  )}
                </td>
                <td>
                  {editingTaskIndex === index ? (
                    <button
                      onClick={() => saveTask(index)}
                      className="task-button"
                    >
                      Salvar
                    </button>
                  ) : (
                    <button
                      onClick={() => editTask(index)}
                      className="task-edit-button"
                    >
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => removeTask(index)}
                    className="task-remove-button"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="created-at-row">
                  Criado em: {task.createdAt} | Entrega: {task.dueDate}
                </td>
              </tr>
            </tfoot>
          </table>
        ))}
      </div>
    </div>
  );
}

export default App;
