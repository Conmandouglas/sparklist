import './App.css';
import TodoInput from './components/TodoInput.js';
import TodoList from './components/TodoList.js';

function App() {
  return (
    <>
      <div className="container">
        <TodoInput />
        <TodoList />
      </div>
    </>
  );
}

export default App;
