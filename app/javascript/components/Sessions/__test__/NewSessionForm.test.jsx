/**
 * @jest-environment jsdom
 */
// REACT
import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// TEST UTILITIES
import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react';
import fetchMock, { enableFetchMocks, resetMocks } from 'jest-fetch-mock';
// eslint-disable-next-line no-unused-vars
import { toBeDisabled } from '@testing-library/jest-dom';

// COMPONENTS
import App from '../../App';
import NewSessionForm from '../NewSessionForm';

// POLYFILLS
import '@babel/polyfill'; // for regeneratorRuntime

// GLOBAL SETUP
let container;
beforeEach(() => {
  enableFetchMocks();
  resetMocks();
  container = document.createElement('div');
  document.body.appendChild(container);
  // POST, PATCH, DELETE requests expect to find the X-CSRF-TOKEN to send to Rails
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'csrf-token');
  meta.setAttribute('content', 'valid-csrf-token');
  document.head.appendChild(meta);
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>,
    container,
  );
});

// GLOBAL TEARDOWN
afterEach(() => {
  document.body.removeChild(container);
  container = null;
  resetMocks();
});

describe('NewSessionForm component', () => {
  describe('STATIC TESTS', () => {
    test('renders correctly from snapshot', () => {
      const tree = renderer.create(
        <BrowserRouter>
          <NewSessionForm />
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
    });

    describe('login button initial state', () => {
      let loginButton;
      beforeEach(() => {
        loginButton = screen.getByRole('button', { name: /login/i });
      });
      test('button is present', () => {
        expect(loginButton);
      });
      test('button is disabled', () => {
        expect(loginButton).toBeDisabled();
      });
      test('button color is gray', () => {
        expect(loginButton.classList).toContain('bg-gray-600');
        expect(loginButton.classList).not.toContain('bg-indigo-600');
      });
      test('cursor is not-available', () => {
        expect(loginButton.classList).toContain('cursor-not-allowed');
      });
    });
  });

  describe('DYNAMIC TESTS', () => {
    // SETUP - grab fields and buttons
    let nameField; let passwordField; let
      loginButton;
    beforeEach(() => {
      nameField = screen.getByRole('textbox', { name: /name:/i });
      passwordField = screen.getByLabelText(/^password:$/i);
      loginButton = screen.getByRole('button', { name: /login/i });
    });

    describe('name field', () => {
      test('name field accepts input', () => {
        act(() => {
          fireEvent.change(nameField, { target: { value: 'validName' } });
        });
        expect(nameField.value).toBe('validName');
      });
    });

    describe('login button with valid field values', () => {
      beforeEach(() => {
        act(() => {
          fireEvent.change(nameField, { target: { value: 'validName' } });
          fireEvent.change(passwordField, { target: { value: 'goodPassword' } });
        });
      });
      test('button is enabled', () => {
        expect(loginButton).toBeEnabled();
      });
      test('button has cursor-allowed', () => {
        expect(loginButton.classList).not.toContain('cursor-not-allowed');
      });
      test('button is colored', () => {
        expect(loginButton.classList).toContain('bg-indigo-600');
      });
      test('button has hover effects', () => {
        expect(loginButton.classList).toContain('hover:bg-indigo-700');
      });
    });

    describe('login button actions', () => {
      test('triggers one POST request to /api/session with correct headers and body', async () => {
        fetchMock.mockResponse(JSON.stringify({ foo: 'bar' }));

        await act(async () => {
          fireEvent.change(nameField, { target: { value: 'validName' } });
          fireEvent.change(passwordField, { target: { value: 'password' } });
          fireEvent.click(loginButton);
        });
        expect(fetch).toBeCalledTimes(1);
        expect(fetch).toBeCalledWith('/api/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': 'valid-csrf-token',
          },
          body: JSON.stringify({
            name: 'validName',
            password: 'password',
          }),
        });
      });
      test('login attempt with invalid credentials triggers window alert', async () => {
        fetchMock.mockResponse(JSON.stringify({ error: 'name and/or password incorrect' }));
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();
        await act(async () => {
          fireEvent.change(nameField, { target: { value: 'invalidName' } });
          fireEvent.change(passwordField, { target: { value: 'incorrectPassword' } });
          fireEvent.click(loginButton);
        });
        expect(alertMock).toBeCalledTimes(1);
        expect(alertMock).toBeCalledWith('name and/or password incorrect');
      });
      test('!response.ok triggers alert', async () => {
        fetchMock.mockResponse('fail', {
          headers: { 'content-type': 'text/plain; charset=UTF-8' },
          status: 401,
          statusText: 'fake error message',
        });
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();
        await act(async () => {
          fireEvent.change(nameField, { target: { value: 'errorTriggeringName' } });
          fireEvent.change(passwordField, { target: { value: 'errorTriggeringPassword' } });
          fireEvent.click(loginButton);
        });
        expect(alertMock).toBeCalledTimes(1);
        expect(alertMock).toBeCalledWith('An error has occurred: fake error message');
      });
      test.todo('successful creation sets current user state');
    });

    describe('NAVIGATION TESTS', () => {
      test('successful login triggers navigate call to profile', async () => {
        fetchMock.mockResponse(JSON.stringify({ name: 'validName', id: 123456 }));
        await act(async () => {
          fireEvent.change(nameField, { target: { value: 'validName' } });
          fireEvent.change(passwordField, { target: { value: 'password' } });
          fireEvent.click(loginButton);
        });
        expect(screen.getByText(/profile for user id: 123456/i)).toBeInTheDocument();
      });
    });
  });
});
