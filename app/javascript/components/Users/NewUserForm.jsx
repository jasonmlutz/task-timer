import React, { useState } from 'react';

export async function handleRegister(credentials) {
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

function NewUserForm() {
  const [credentials, setCredentials] = useState({
    name: '',
    password: '',
    password_confirmation: '',
  });

  function handleSubmit() {
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

  return (
    <div className="bg-indigo-200 relative overflow-hidden h-screen">
      <div className="container mx-auto relative z-10 mt-20">
        <div className="flex flex-col content-center relative">
          <div className="self-center mb-2 text-xl font-light text-gray-800">
            Create New Account
          </div>
          <div className="p-6 mt-8">
            <form>
              <input type="text" className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2" placeholder="Name" value={credentials.name} onChange={(e) => setCredentials({ ...credentials, name: e.target.value })} />
              <input
                type="password"
                className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
              <input
                type="password"
                className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2"
                placeholder="Confirm Password"
                value={credentials.password_confirmation}
                onChange={(e) => setCredentials(
                  { ...credentials, password_confirmation: e.target.value },
                )}
              />
              <button
                type="submit"
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewUserForm;
