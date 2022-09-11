import React from 'react';
import './App.css';

const url = process.env.REACT_APP_ENVELOPE_BACKEND_URL;

function App() {
  return (
    <div className="grid place-items-center h-screen bg-gray-800 text-stone-200">
      <div className="rounded-md bg-cyan-600 p-3">
        <form>
          <div className="flex flex-col m-2">
            <div>
              <textarea id="message"
                className="p-2.5 bg-gray-800 rounded-lg border"
                placeholder="Your secret message...">
              </textarea>
            </div>
            <div className="flex flex-row justify-center mt-2">
              <input className="hover:underline cursor-pointer" type="submit" value="Encrypt" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
