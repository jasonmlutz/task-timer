import React, { useState } from 'react';

async function handleRegister(credentials) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('[name=csrf-token]').content,
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }

  const user = await response.json();
  if (user.error) {
    window.alert(user.error);
  } else {
    console.log(user);
  }
}

function handleSubmit(credentials) {
  if (
    !credentials.name.length
      || !credentials.password.length
      || !credentials.password_confirmation.length
  ) {
    window.alert('please complete all fields');
  } else if (credentials.password !== credentials.password_confirmation) {
    window.alert('passwords do not match');
  } else {
    handleRegister(credentials);
  }
}

function preventSubmit(credentials) {
  return !credentials.name.length
  || !credentials.password.length
  || !(credentials.password === credentials.password_confirmation);
}

function renderPasswordStatusMessage(credentials) {
  // determine whether we need to render any message
  if (credentials.password.length
    && credentials.password_confirmation.length) {
    // set the styling and text for success or warning
    let classes = 'border-l-4 p-2 mx-2 ';
    let message;
    if (credentials.password === credentials.password_confirmation) {
      classes += 'bg-green-200 border-green-600 text-green-600';
      message = 'Passwords match!';
    } else {
      classes += 'bg-yellow-200 border-yellow-600 text-yellow-600';
      message = 'Passwords do not match!';
    }
    // return the element
    return (
      <div className="flex flex-col mb-2 mx-auto">
        <div
          className={classes}
          role="alert"
        >
          <p>{message}</p>
        </div>
      </div>
    );
  }
  // no message needed? great! return null
  return null;
}

function renderRegisterButton(credentials) {
  let classes = 'py-2 px-4 ';
  if (preventSubmit(credentials)) {
    // grayed-out theme, no mouse-over action
    classes += 'bg-gray-600 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg cursor-not-allowed';
  } else {
    // colored and interactive
    classes += 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg';
  }
  return (
    <button
      type="submit"
      className={classes}
      disabled={preventSubmit(credentials)}
      onClick={(e) => {
        e.preventDefault();
        handleSubmit(credentials);
      }}
    >
      Register
    </button>
  );
}

function NewUserForm() {
  const [credentials, setCredentials] = useState({
    name: '',
    password: '',
    password_confirmation: '',
  });

  return (
    <div className="bg-indigo-200 relative overflow-hidden h-screen">
      <div className="container mx-auto relative z-10 mt-20">
        <div className="flex flex-col content-center relative">
          <div className="self-center mb-2 text-xl font-light text-gray-800">
            Create New Account
          </div>
          <div className="p-6 mt-8">
            <form>
              <label htmlFor="name">
                Name:
                <input type="text" id="name" className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2" placeholder="please select a user name" value={credentials.name} onChange={(e) => setCredentials({ ...credentials, name: e.target.value })} />
              </label>

              <label htmlFor="password">
                Password:
                <input
                  type="password"
                  id="password"
                  className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2"
                  placeholder="enter a password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </label>
              <label htmlFor="password_confirmation">
                Confirm Password:
                <input
                  type="password"
                  id="password_confirmation"
                  className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2"
                  placeholder="please re-enter your password"
                  value={credentials.password_confirmation}
                  onChange={(e) => setCredentials(
                    { ...credentials, password_confirmation: e.target.value },
                  )}
                />
              </label>
              {renderPasswordStatusMessage(credentials)}
              {renderRegisterButton(credentials)}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewUserForm;
