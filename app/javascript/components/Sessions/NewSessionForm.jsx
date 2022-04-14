import React, { useState } from 'react';

import { postRequest } from '../../resources/requests';

function NewSessionForm() {
  const [credentials, setCredentials] = useState({
    name: '',
    password: '',
  });

  function preventLoginFormSubmit() {
    return !credentials.name || !credentials.password;
  }

  function renderLoginButton() {
    let classes = 'py-2 px-4 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg ';
    if (preventLoginFormSubmit()) {
    // grayed-out theme, no mouse-over action
      classes += 'bg-gray-600 cursor-not-allowed';
    } else {
    // colored and interactive
      classes += 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    }
    return (
      <button
        type="submit"
        className={classes}
        disabled={preventLoginFormSubmit()}
        onClick={(e) => {
          e.preventDefault();
          postRequest(
            credentials,
            '/api/session',
            (user) => {
              if (user.error) {
                window.alert(user.error);
              } else {
                console.log(user);
              }
            },
          );
        }}
      >
        Login
      </button>
    );
  }

  return (
    <div className="bg-indigo-200 relative overflow-hidden h-screen">
      <div className="container mx-auto relative z-10 mt-20">
        <div className="flex flex-col content-center relative">
          <div className="self-center mb-2 text-xl font-light text-gray-800">
            Login to your account
          </div>
          <div className="p-6 mt-8">
            <form>
              <label htmlFor="name">
                Name:
                <div className="flex flex-row">
                  <input type="text" id="name" className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2" placeholder="enter your name" value={credentials.name} onChange={(e) => setCredentials({ ...credentials, name: e.target.value })} />
                </div>
              </label>
              <label htmlFor="password">
                Password:
                <input
                  type="password"
                  id="password"
                  className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2"
                  placeholder="enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </label>
              {renderLoginButton()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewSessionForm;
