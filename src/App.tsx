import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import './App.css';
import axios from 'axios';
import { cryptico, RSAKey } from '@veikkos/cryptico';
import moment from 'moment';
import Spinner from './Spinner';
import Modal from './Modal';
const url = process.env.REACT_APP_ENVELOPE_BACKEND_URL;

function App() {
  const [calendarDate, onChange] = useState(new Date());
  const [inputText, onInputChange] = useState('');
  const [enableSpinner, setEnableSpinner] = useState(false);
  const [enableModal, setEnableModal] = useState(false);
  const [modalText, setmodalText] = useState("");

  async function encrypt(event: any) {
    const plaintext = event.target[0].value;

    if (plaintext.length) {
      const res = await axios.get(`${url}/publickey/${calendarDate.toISOString()}`);
      const key = res.data.key;
      if (key) {
        // @ts-ignore
        const secret = cryptico.encrypt(plaintext, key, undefined);
        if ("cipher" in secret) {
          const cipher = `${calendarDate.toISOString()}_${secret.cipher}`;
          setmodalText(cipher);
          setEnableModal(true);
        }
      }
    }
  }

  async function decrypt(event: any) {
    const input = event.target[0].value;

    if (input) {
      const split = input.split("_");

      if (split.length > 1 && isNaN(Date.parse(split[0])) === false) {
        try {
          const res = await axios.get(`${url}/privatekey/${split[0]}`);
          const key = res.data.key;
          if (key) {
            const rsaKey = RSAKey.parse(key)
            if (rsaKey) {
              const plaintext = cryptico.decrypt(split[1], rsaKey);
              if ("plaintext" in plaintext) {
                setmodalText(plaintext.plaintext);
                setEnableModal(true);
              } else {
                alert('Invalid input...')
              }
            }
          }
        } catch (err: any) {
          if (err.response.data.message === 'It\'s not yet time') {
            const diff = new Date(input.split('_')[0]);
            alert(`Can be decrypted ${moment(diff).fromNow()}`)
          } else {
            alert('Unknown decryption error...')
          }
        }
      } else {
        alert('Not something we can decrypt...')
      }
    }
  }

  const submit = async (event: any) => {
    event.preventDefault();
    setEnableSpinner(true);
    if (event.nativeEvent.submitter.name === "encrypt") {
      await encrypt(event);
    } else {
      await decrypt(event);
    }
    setEnableSpinner(false)
  };

  const handleChange = (event: any) => {
    onInputChange(event.target.value);
  };

  return (
    <div>
      <Spinner visible={enableSpinner}></Spinner>
      <Modal visible={enableModal} text={modalText} onClose={() => { setEnableModal(false) }}></Modal>
      <div className="grid place-items-center h-screen text-stone-200">
        <div className="container p-4">
          <div className="rounded-md bg-cyan-600 shadow-lg shadow-cyan-900 p-4">
            <form onSubmit={submit} >
              <div className="flex flex-col">
                <div className="flex-1 flex flex-col m-2">
                  <h2 className="font-bold text-xl mb-4">Timed Envelope</h2>
                  <textarea id="message"
                    className="p-2.5 bg-gray-800 rounded-lg border"
                    placeholder="Your message to encrypt / decrypt..."
                    onChange={handleChange}>
                  </textarea>
                  <div className="pt-2">
                    <h2 className="font-semibold text-lg">Open date (encryption only):</h2>
                  </div>
                  <div className="mt-3 text-gray-600 flex justify-center flex">
                    <div className="calendar-container">
                      <Calendar onChange={onChange} minDate={new Date()} value={calendarDate} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-evenly mt-2 text-lg">
                  <input className="button"
                    disabled={!inputText.length}
                    type="submit"
                    name="encrypt"
                    value="Encrypt" />
                  <input className="button"
                    disabled={!inputText.length}
                    type="submit"
                    name="decrypt"
                    value="Decrypt" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
