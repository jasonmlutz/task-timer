/**
 * @jest-environment jsdom
 */
// REACT
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// TEST UTILITIES
import renderer, { act } from 'react-test-renderer';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock, { enableFetchMocks, resetMocks } from 'jest-fetch-mock';
// eslint-disable-next-line no-unused-vars
import { toBeDisabled } from '@testing-library/jest-dom';

// COMPONENTS
import App from '../../App';
import NewUserForm from '../NewUserForm';

// POLYFILLS
import 'regenerator-runtime'; // for regeneratorRuntime

const requests = require('../../../resources/requests');

// GLOBAL SETUP
let container;
beforeEach(() => {
  enableFetchMocks();
  container = document.createElement('div');
  const root = ReactDOM.createRoot(container);
  document.body.appendChild(container);
  // POST, PATCH, DELETE requests expect to find the X-CSRF-TOKEN to send to Rails
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'csrf-token');
  meta.setAttribute('content', 'valid-csrf-token');
  document.head.appendChild(meta);
  act(() => {
    root.render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>,
    );
  });
});

// GLOBAL TEARDOWN
afterEach(() => {
  document.body.removeChild(container);
  container = null;
  jest.clearAllMocks();
  resetMocks();
  cleanup();
});

describe('NewUserForm component', () => {
  describe('STATIC TESTS', () => {
    test('renders correctly from snapshot', () => {
      const tree = renderer.create(
        <BrowserRouter>
          <NewUserForm />
        </BrowserRouter>,
      ).toJSON();
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
      beforeEach(async () => {
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('validName');
          await user.click(passwordField);
          await user.keyboard('goodPassword');
          await user.click(passwordConfirmField);
          await user.keyboard('goodPassword');
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
      beforeEach(async () => {
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('validName');
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
      test('password fields accept input', async () => {
        const user = userEvent.setup();
        await act(async () => {
          await user.click(passwordField);
          await user.keyboard('firstPassword');
          await user.click(passwordConfirmField);
          await user.keyboard('secondPassword');
        });
        expect(passwordField.value).toBe('firstPassword');
        expect(passwordConfirmField.value).toBe('secondPassword');
      });

      describe('password validation message & warning', () => {
        test('non-empty non-matching passwords reveal warning', async () => {
          const user = userEvent.setup();
          await act(async () => {
            await user.click(passwordField);
            await user.keyboard('firstPassword');
            await user.click(passwordConfirmField);
            await user.keyboard('secondPassword');
          });
          expect(screen.queryByText(/passwords do not match/i)).not.toBeNull();
        });

        test('matching passwords reveal matching message', async () => {
          const user = userEvent.setup();
          await act(async () => {
            await user.click(passwordField);
            await user.keyboard('firstPassword');
            await user.click(passwordConfirmField);
            await user.keyboard('firstPassword');
          });
          expect(screen.queryByText(/passwords match/i)).not.toBeNull();
        });

        test('neither message nor warning shown when only password is empty', async () => {
          const user = userEvent.setup();
          await act(async () => {
            await user.click(passwordConfirmField);
            await user.keyboard('secondPassword');
          });
          expect(screen.queryByText(/passwords do not match/i)).toBeNull();
          expect(screen.queryByText(/passwords match/i)).toBeNull();
        });

        test('neither message nor warning shown when only password confirmation is empty', async () => {
          const user = userEvent.setup();
          await act(async () => {
            await user.click(passwordField);
            await user.keyboard('firstPassword');
          });
          expect(screen.queryByText(/passwords do not match/i)).toBeNull();
          expect(screen.queryByText(/passwords match/i)).toBeNull();
        });
      });
    });

    describe('name field', () => {
      test('name field accepts input', async () => {
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('validName');
        });
        expect(nameField.value).toBe('validName');
      });
    });
    describe('check availability button action', () => {
      test('click triggers one GET request to /api/check_availability/:name', async () => {
        fetchMock.mockResponse(JSON.stringify({ foo: 'bar' }));
        jest.spyOn(requests, 'getRequest');
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('validName');
          await user.click(checkAvailabilityButton);
        });
        expect(requests.getRequest).toBeCalledTimes(1);
        expect(requests.getRequest).toBeCalledWith('/api/check_availability/validName', expect.any(Function));
      });
      test('name_available: true response triggers matching message', async () => {
        fetchMock.mockResponse(JSON.stringify({ name_available: true }));
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('availableName');
          await user.click(checkAvailabilityButton);
        });
        expect(screen.getByText(/availableName is available!/i)).toBeInTheDocument();
      });
      test('name_available: false response triggers matching message', async () => {
        fetchMock.mockResponse(JSON.stringify({ name_available: false }));
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('unavailableName');
          await user.click(checkAvailabilityButton);
        });
        expect(screen.getByText(/unavailableName is not available!/i)).toBeInTheDocument();
      });
      test('!response.ok triggers window alert', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        fetchMock.mockResponse('fail', {
          headers: { 'content-type': 'text/plain; charset=UTF-8' },
          status: 401,
          statusText: 'check availability button fake error message',
        });
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('unavailableName');
          await user.click(checkAvailabilityButton);
        });
        expect(alertMock).toBeCalledTimes(1);
        expect(alertMock).toBeCalledWith('An error has occurred: check availability button fake error message');
      });
    });
    describe('submit button action', () => {
      test('triggers one POST request to /api/users with correct headers and body', async () => {
        fetchMock.mockResponse(JSON.stringify({ foo: 'bar' }));
        jest.spyOn(requests, 'postRequest');
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('validName');
          await user.click(passwordField);
          await user.keyboard('password');
          await user.click(passwordConfirmField);
          await user.keyboard('password');
          await user.click(registerButton);
        });
        expect(requests.postRequest).toBeCalledTimes(1);
        expect(requests.postRequest).toBeCalledWith(
          {
            name: 'validName',
            password: 'password',
            password_confirmation: 'password',
          },
          '/api/users',
          expect.any(Function),
        );
      });
      test.todo('successful creation sets current user state');
      test('creation attempt but username unavailable triggers window alert', async () => {
        fetchMock.mockResponse(JSON.stringify({ error: 'name not available' }));
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('unavailableName');
          await user.click(passwordField);
          await user.keyboard('password');
          await user.click(passwordConfirmField);
          await user.keyboard('password');
          await user.click(registerButton);
        });
        expect(alertMock).toBeCalledTimes(1);
        expect(alertMock).toBeCalledWith('name not available');
      });
      test('!response.ok triggers alert', async () => {
        fetchMock.mockResponse('fail', {
          headers: { 'content-type': 'text/plain; charset=UTF-8' },
          status: 401,
          statusText: 'fake error message',
        });
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('unavailableName');
          await user.click(passwordField);
          await user.keyboard('password');
          await user.click(passwordConfirmField);
          await user.keyboard('password');
          await user.click(registerButton);
        });
        expect(alertMock).toBeCalledTimes(1);
        expect(alertMock).toBeCalledWith('An error has occurred: fake error message');
      });
    });

    describe('NAVIGATION TESTS', () => {
      test('successful creation triggers navigate call to profile', async () => {
        fetchMock.mockResponse(JSON.stringify({ name: 'validName', id: 123456 }));
        const user = userEvent.setup();
        await act(async () => {
          await user.click(nameField);
          await user.keyboard('validName');
          await user.click(passwordField);
          await user.keyboard('password');
          await user.click(passwordConfirmField);
          await user.keyboard('password');
          await user.click(registerButton);
        });
        expect(screen.getByText(/profile for user id: 123456/i));
      });
    });
  });
});
