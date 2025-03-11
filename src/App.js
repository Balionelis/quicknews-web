import React from 'react';
import NewsList from './components/NewsList';
import './styles.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>QuickNews</h1>
      </header>
      <main>
        <NewsList />
      </main>
      <footer>
        <p>Powered by Google News RSS & Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;