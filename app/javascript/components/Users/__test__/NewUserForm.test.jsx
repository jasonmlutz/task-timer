/**
 * @jest-environment jsdom
 */
// REACT
import React from 'react';
import { createRoot } from 'react-dom/client';

// TEST UTILITIES
import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line no-unused-vars
import { toBeDisabled } from '@testing-library/jest-dom';
import fetchMock, { enableFetchMocks, resetMocks } from 'jest-fetch-mock';

// COMPONENTS
import NewUserForm from '../NewUserForm';

// POLYFILLS
import '@babel/polyfill'; // for regeneratorRuntime

// GLOBAL SETUP
let container;
beforeEach(() => {
  enableFetchMocks();
  resetMocks();
  container = document.createElement('div');
  container.setAttribute('name', 'csrf-token');
  container.innerHTML = 'valid-csrf-token';
  document.body.appendChild(container);
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'csrf-token');
  meta.setAttribute('content', 'valid-csrf-token');
  document.head.appendChild(meta);
  act(() => {
    createRoot(container).render(
      <NewUserForm />,
    );
  });
  // POST, PATCH, DELETE requests expect to find the X-CSRF-TOKEN to send to Rails
  // const tokenContainer = document.createElement('div');
  // tokenContainer.setAttribute('name', 'csrf-token');
  // tokenContainer.setAttribute('content', 'valid-csrf-token');
  // container.appendChild(tokenContainer);
});

// GLOBAL TEARDOWN
afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('NewUserForm component', () => {
  describe('STATIC TESTS', () => {
    test('renders correctly from snapshot', () => {
      const tree = renderer.create(<NewUserForm />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    describe('input fields are present', () => {
      test('name input', () => {
        expect(screen.getByRole('textbox', { name: /name:/i }));
      });
      test('password input', () => {
        expect(screen.getByLabelText(/^password:$/i));
      });
      test('password confirmation input', () => {
        expect(screen.getByLabelText(/^confirm password:$/i));
      });
    });

    describe('register button initial status', () => {
      // LOCAL SETUP
      let registerButton;
      beforeEach(() => {
        registerButton = screen.getByRole('button', { name: /register/i });
      });
      test('button is present', () => {
        expect(registerButton);
      });
      test('button is disabled', () => {
        expect(registerButton).toBeDisabled();
      });
      test('button color is gray', () => {
        expect(registerButton.classList).toContain('bg-gray-600');
        expect(registerButton.classList).not.toContain('bg-indigo-600');
      });
      test('cursor is not-available', () => {
        expect(registerButton.classList).toContain('cursor-not-allowed');
      });
    });

    describe('check availability button initial status', () => {
      let checkAvailabilityButton;
      beforeEach(() => {
        checkAvailabilityButton = screen.getByRole('button', { name: /check availability/i });
      });

      test('button is present', () => {
        expect(checkAvailabilityButton);
      });

      test('button is disabled', () => {
        expect(checkAvailabilityButton).toBeDisabled();
      });

      test('button color is gray', () => {
        expect(checkAvailabilityButton.classList).toContain('bg-gray-600');
        expect(checkAvailabilityButton.classList).not.toContain('bg-indigo-600');
      });

      test('cursor is not-available', () => {
        expect(checkAvailabilityButton.classList).toContain('cursor-not-allowed');
      });
    });

    describe('validation display messages are absent', () => {
      test('name availability', () => {
        expect(screen.queryAllByText(/not available/)).toStrictEqual([]);
      });
      test('password agreement', () => {
        expect(screen.queryAllByText(/do not match/)).toStrictEqual([]);
      });
    });
  });

  describe('DYNAMIC TESTS', () => {
    // SETUP - grab fields and buttons
    let nameField;
    let passwordField;
    let passwordConfirmField;
    let registerButton;
    let checkAvailabilityButton;
    beforeEach(() => {
      nameField = screen.getByRole('textbox', { name: /name:/i });
      passwordField = screen.getByLabelText(/^password:$/i);
      passwordConfirmField = screen.getByLabelText(/^confirm password:$/i);
      registerButton = screen.getByRole('button', { name: /register/i });
      checkAvailabilityButton = screen.getByRole('button', { name: /check availability/i });
    });

    describe('register button with valid field values', () => {
      beforeEach(() => {
        act(() => {
          fireEvent.change(nameField, { target: { value: 'validName' } });
          fireEvent.change(passwordField, { target: { value: 'goodPassword' } });
          fireEvent.change(passwordConfirmField, {
            target: { value: 'goodPassword' },
          });
        });
      });

      test('button is enabled', () => {
        expect(registerButton).toBeEnabled();
      });
      test('button has cursor-allowed', () => {
        expect(registerButton.classList).not.toContain('cursor-not-allowed');
      });
      test('button is colored', () => {
        expect(registerButton.classList).toContain('bg-indigo-600');
      });
      test('button has hover effects', () => {
        expect(registerButton.classList).toContain('hover:bg-indigo-700');
      });
    });

    describe('check availability button with name input', () => {
      beforeEach(() => {
        act(() => {
          fireEvent.change(nameField, { target: { value: 'validName' } });
        });
      });

      test('button is enabled', () => {
        expect(checkAvailabilityButton).toBeEnabled();
      });
      test('button has cursor-allowed', () => {
        expect(checkAvailabilityButton.classList).not.toContain('cursor-not-allowed');
      });
      test('button is colored', () => {
        expect(checkAvailabilityButton.classList).toContain('bg-indigo-600');
      });
      test('button has hover effects', () => {
        expect(checkAvailabilityButton.classList).toContain('hover:bg-indigo-700');
      });
    });

    describe('password fields', () => {
      test('password fields accept input', () => {
        act(() => {
          fireEvent.change(passwordField, { target: { value: 'firstPassword' } });
          fireEvent.change(passwordConfirmField, {
            target: { value: 'secondPassword' },
          });
        });
        expect(passwordField.value).toBe('firstPassword');
        expect(passwordConfirmField.value).toBe('secondPassword');
      });

      describe('password validation message & warning', () => {
        test('non-empty non-matching passwords reveal warning', () => {
          act(() => {
            fireEvent.change(passwordField, { target: { value: 'password' } });
            fireEvent.change(passwordConfirmField, {
              target: { value: 'badPassword' },
            });
          });
          expect(screen.queryByText(/passwords do not match/i)).not.toBeNull();
        });

        test('matching passwords reveal matching message', () => {
          act(() => {
            fireEvent.change(passwordField, { target: { value: 'password' } });
            fireEvent.change(passwordConfirmField, {
              target: { value: 'password' },
            });
          });
          expect(screen.queryByText(/passwords match/i)).not.toBeNull();
        });

        test('neigher message nor warning shown when only password is empty', () => {
          act(() => {
            fireEvent.change(passwordConfirmField, {
              target: { value: 'password' },
            });
          });
          expect(screen.queryByText(/passwords do not match/i)).toBeNull();
          expect(screen.queryByText(/passwords match/i)).toBeNull();
        });

        test('neigher message nor warning shown when only password confirmation is hidden', () => {
          act(() => {
            fireEvent.change(passwordConfirmField, {
              target: { value: 'password' },
            });
          });
          expect(screen.queryByText(/passwords do not match/i)).toBeNull();
          expect(screen.queryByText(/passwords match/i)).toBeNull();
        });
      });
    });

    describe('name field', () => {
      test('name field accepts input', () => {
        act(() => {
          fireEvent.change(nameField, { target: { value: 'validName' } });
        });
        expect(nameField.value).toBe('validName');
      });
    });
    describe('check availability button action', () => {
      test('click triggers one GET request to /api/check_availability/:name', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ foo: 'bar' }));
        jest.spyOn(global, 'fetch');
        await act(async () => {
          fireEvent.change(nameField, { target: { value: 'validName' } });
          fireEvent.click(checkAvailabilityButton);
        });
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('/api/check_availability/validName');
      });
      test('name_available: true response triggers matching message', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ name_available: true }));
        await act(async () => {
          fireEvent.change(nameField, { target: { value: 'availableName' } });
          fireEvent.click(checkAvailabilityButton);
        });
        expect(screen.getByText(/availableName is available!/i)).toBeInTheDocument();
      });
      test('name_available: false response triggers matching message', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ name_available: false }));
        await act(async () => {
          fireEvent.change(nameField, { target: { value: 'unavailableName' } });
          fireEvent.click(checkAvailabilityButton);
        });
        expect(screen.getByText(/unavailableName is not available!/i)).toBeInTheDocument();
      });
      test('!response.ok triggers window alert', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();
        fetchMock.mockResponseOnce('fail', {
          headers: { 'content-type': 'text/plain; charset=UTF-8' },
          status: 401,
          statusText: 'check availability button fake error message',
        });
        await act(async () => {
          fireEvent.change(nameField, { target: { value: 'unavailableName' } });
          fireEvent.click(checkAvailabilityButton);
        });
        expect(alertMock).toBeCalled();
        expect(alertMock).toBeCalledWith('An error has occurred: check availability button fake error message');
      });
    });
    describe('submit button action', () => {
      test('triggers one POST request to /api/users with correct headers and body', () => {
        fetchMock.mockResponseOnce(JSON.stringify({ foo: 'bar' }));
        act(() => {
          fireEvent.change(nameField, { target: { value: 'validName' } });
          fireEvent.change(passwordField, { target: { value: 'password' } });
          fireEvent.change(passwordConfirmField, { target: { value: 'password' } });
          fireEvent.click(registerButton);
        });
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': 'valid-csrf-token',
          },
          body: JSON.stringify({
            name: 'validName',
            password: 'password',
            password_confirmation: 'password',
          }),
        });
      });
      test.todo('successful creation triggers navigate call to profile');
      test.todo('successful creation sets current user state');
      test('creation attempt but username unavailable triggers window alert', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'name not available' }));
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();
        await act(async () => {
          fireEvent.change(nameField, { target: { value: 'unavailableName' } });
          fireEvent.change(passwordField, { target: { value: 'password' } });
          fireEvent.change(passwordConfirmField, { target: { value: 'password' } });
          fireEvent.click(registerButton);
        });
        expect(alertMock).toBeCalled();
        expect(alertMock).toBeCalledWith('name not available');
      });
      test('!response.ok triggers alert', async () => {
        fetchMock.mockResponseOnce('fail', {
          headers: { 'content-type': 'text/plain; charset=UTF-8' },
          status: 401,
          statusText: 'fake error message',
        });
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();
        await act(async () => {
          fireEvent.change(nameField, { target: { value: 'unavailableName' } });
          fireEvent.change(passwordField, { target: { value: 'password' } });
          fireEvent.change(passwordConfirmField, { target: { value: 'password' } });
          fireEvent.click(registerButton);
        });
        expect(alertMock).toBeCalled();
        expect(alertMock).toBeCalledWith('An error has occurred: fake error message');
      });
    });
  });
});
