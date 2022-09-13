import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import './App.css';
import axios from 'axios';
import { cryptico, RSAKey } from '@daotl/cryptico';
const url = process.env.REACT_APP_ENVELOPE_BACKEND_URL;

function App() {
  const [calendarDate, onChange] = useState(new Date());

  async function encrypt(event: any) {
    const plaintext = event.target[0].value;

    if (plaintext.length) {
      const res = await axios.get(`${url}/publickey/${calendarDate.toISOString()}`);
      const key = res.data.key;
      if (key) {
        // @ts-ignore
        const secret = cryptico.encrypt(plaintext, key, undefined);
        if ("cipher" in secret) {
          console.log(`${calendarDate.toISOString()}_${secret.cipher}`);
        }
      }
    }
  }

  async function decrypt(event: any) {
    const input = event.target[0].value;

    if (input) {
      const split = input.split("_");
      const res = await axios.get(`${url}/privatekey/${split[0]}`);
      const key = res.data.key;
      if (key) {
        const rsaKey = RSAKey.parse(key)
        if (rsaKey) {
          const plaintext = cryptico.decrypt(split[1], rsaKey);
          console.log(plaintext);
        }
      }
    }
  }

  const submit = async (event: any) => {
    event.preventDefault();
    console.log(event.nativeEvent.submitter.name);
    if (event.nativeEvent.submitter.name === "encrypt") {
      await encrypt(event);
    } else {
      await decrypt(event);
    }
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
                <Calendar onChange={onChange} value={calendarDate} />
              </div>
            </div>
            <div className="flex flex-row justify-evenly mt-2">
              <input className="hover:underline cursor-pointer"
                type="submit"
                name="encrypt"
                value="Encrypt" />
              <input className="hover:underline cursor-pointer"
                type="submit"
                name="decrypt"
                value="Decrypt" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
