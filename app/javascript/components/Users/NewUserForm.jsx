import React, { useState } from 'react';

import { getRequest, postRequest } from '../../resources/requests';

function NewUserForm() {
  const [credentials, setCredentials] = useState({
    name: '',
    password: '',
    password_confirmation: '',
  });

  const [nameAvailability, setNameAvailability] = useState({
    name: '',
    available: false,
    renderMessage: false,
  });

  function preventRegistrationFormSubmit() {
    return !credentials.name
  || !credentials.password
  || !(credentials.password === credentials.password_confirmation);
  }

  function passwordStatusMessage() {
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

  function nameAvailabilityMessage() {
  // determine whether we need to render any message
    if (nameAvailability.renderMessage) {
    // set the styling and text for success or warning
      let classes = 'border-l-4 p-2 mx-2 ';
      let message;
      if (nameAvailability.available) {
        classes += 'bg-green-200 border-green-600 text-green-600';
        message = `${nameAvailability.name} is available!`;
      } else {
        classes += 'bg-yellow-200 border-yellow-600 text-yellow-600';
        message = `${nameAvailability.name} is not available!`;
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

  function renderRegisterButton() {
    let classes = 'py-2 px-4 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg ';
    if (preventRegistrationFormSubmit()) {
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
        disabled={preventRegistrationFormSubmit()}
        onClick={(e) => {
          e.preventDefault();
          postRequest(
            credentials,
            '/api/users',
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
        Register
      </button>
    );
  }

  function renderCheckAvailibilityButton() {
    let classes = 'w-auto ml-2 px-2 py-2 text-base font-semibold shadow-md rounded-lg text-white w-full transition ease-in duration-200 text-center ';
    if (credentials.name.length === 0) {
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
        disabled={credentials.name.length === 0}
        onClick={(e) => {
          e.preventDefault();
          getRequest(
            `/api/check_availability/${credentials.name}`,
            (response) => {
              const available = response.name_available;
              setNameAvailability(
                {
                  name: credentials.name,
                  available,
                  renderMessage: true,
                },
              );
            },
          );
        }}
      >
        Check Availability
      </button>
    );
  }

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
                <div className="flex flex-row">
                  <input type="text" id="name" className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2" placeholder="please select a user name" value={credentials.name} onChange={(e) => setCredentials({ ...credentials, name: e.target.value })} />
                  {renderCheckAvailibilityButton(credentials.name)}
                </div>
              </label>
              {nameAvailabilityMessage()}

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
              {passwordStatusMessage()}
              {renderRegisterButton()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewUserForm;
