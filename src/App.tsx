import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import './App.css';
import axios from 'axios';
const url = process.env.REACT_APP_ENVELOPE_BACKEND_URL;

function App() {
  const [value, onChange] = useState(new Date());

  const submit = async (event: any) => {
    event.preventDefault();
    const res = await axios.get(`${url}/publickey`);
    console.log(res.data);
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-800 text-stone-200">
      <div className="rounded-md bg-cyan-600 p-3">
        <form onSubmit={submit} >
          <div className="lex flex-col">
            <div className="flex-1 flex flex-col m-2">
              <textarea id="message"
                className="p-2.5 bg-gray-800 rounded-lg border"
                placeholder="Your secret message...">
              </textarea>
              <div className="mt-3">
                <Calendar onChange={onChange} value={value} />
              </div>
            </div>
            <div className="flex flex-row justify-center mt-2">
              <input className="hover:underline cursor-pointer"
                type="submit"
                value="Encrypt" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
