import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faChevronDown,
  faChevronRight,
  faTimes,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Planejamento");
  const [priority, setPriority] = useState("Baixa");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Aguardando");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);

  const addTask = () => {
    if (!newTask || !dueDate) {
      alert("Preencha o 'nome' e o 'prazo' da tarefa!");
      return;
    }

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
  };

  const toggleAccordion = (index) => {
    setExpandedTaskIndex(expandedTaskIndex === index ? null : index);
  };

  const showAccordion = expandedTaskIndex !== null ? "show" : "";

  const removeTask = (index) => {
    const confirmRemove = window.confirm(
      "Tem certeza que deseja remover esta tarefa?"
    );
    if (confirmRemove) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  };

  const startEditing = (index) => {
    setCurrentTaskIndex(index);
    const task = tasks[index];
    setNewTask(task.name);
    setCategory(task.category);
    setPriority(task.priority);
    setDueDate(task.dueDate === "Não especificada" ? "" : task.dueDate);
    setStatus(task.status);
    setIsEditing(true);
  };

  const saveTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[currentTaskIndex] = {
      ...updatedTasks[currentTaskIndex],
      name: newTask,
      category,
      priority,
      dueDate: dueDate || "Não especificada",
      status,
    };
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    cancelEditing();
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentTaskIndex(null);
    setNewTask("");
    setCategory("Planejamento");
    setPriority("Baixa");
    setDueDate("");
    setStatus("Aguardando");
  };

  const calculateDays = (createdAt, dueDate) => {
    // Converte createdAt de "16/01/2025, 21:07:13" para um formato válido de data
    const [date, time] = createdAt.split(", ");
    const [day, month, year] = date.split("/");
    const formattedCreatedAt = `${year}-${month}-${day}T${time}`;

    const start = new Date(formattedCreatedAt);
    const end = new Date(dueDate);

    if (isNaN(start) || isNaN(end)) return "Data inválida";

    const diffInMs = end - start;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Entrega - hoje";
    } else if (diffInDays === 1) {
      return "Falta - 1 dia";
    } else if (diffInDays > 1) {
      return `Faltam - ${diffInDays} dias`;
    } else {
      return `Atrasado por ${Math.abs(diffInDays)} dias`;
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Lista de tarefas</h1>
      <p className="app-description">Crie a sua lista de tarefas preenchendo os campos abaixo</p>
      <div className="task-form">
        <input
          type="text"
          placeholder="Nome da tarefa"
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
          <option>Execução</option>
          <option>Revisão</option>
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

      <div className="accordion">
        {tasks.map((task, index) => (
          <div key={index} className="accordion-item">
            <div
              className="accordion-header"
              onClick={() => toggleAccordion(index)}
            >
              <div className="accordion-task-name">
                <FontAwesomeIcon
                  icon={
                    expandedTaskIndex === index ? faChevronDown : faChevronRight
                  }
                  className="toggle-chevron-button"
                />
                <span>{task.name}</span>
                {task.status == "Concluído" ? (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="icon-check"
                  />
                ) : (
                  <span className={`square ${task.priority}`}></span>
                )}
              </div>
              <div>
                <p className="due-date">
                  {calculateDays(task.createdAt, task.dueDate)}
                </p>
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={() => startEditing(index)}
                  className="icon-button"
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => removeTask(index)}
                  className="icon-button"
                />
              </div>
            </div>
            {expandedTaskIndex === index && (
              <div className={`accordion-content ${showAccordion}`}>
                <p>
                  <strong>Categoria:</strong> {task.category}
                </p>
                <p>
                  <strong>Prioridade:</strong> {task.priority}
                </p>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                <p>
                  <strong>Prazo:</strong> {task.dueDate}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h2>Editar Tarefa</h2>
              <FontAwesomeIcon
                icon={faTimes}
                onClick={cancelEditing}
                className="close-icon"
              />
            </div>
            <div className="popup-content">
              <input
                type="text"
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
                <option>Execução</option>
                <option>Revisão</option>
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
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="task-select"
              >
                <option>Aguardando</option>
                <option>Em Progresso</option>
                <option>Concluído</option>
              </select>
            </div>
            <div className="popup-actions">
              <button onClick={cancelEditing} className="task-remove-button">
                Cancelar
              </button>
              <button onClick={saveTask} className="task-button">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
