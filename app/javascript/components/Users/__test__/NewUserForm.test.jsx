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

// COMPONENTS
import NewUserForm from '../NewUserForm';

// GLOBAL SETUP
let container;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <NewUserForm />,
    );
  });
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
      test('button is present', () => {
        expect(screen.getByRole('button', { name: /register/i }));
      });
      test('button is disabled', () => {
        expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
      });
      test('button color is gray', () => {
        const button = screen.getByRole('button', { name: /register/i });
        expect(button.classList).toContain('bg-gray-600');
        expect(button.classList).not.toContain('bg-indigo-600');
      });
      test('cursor is not-available', () => {
        const button = screen.getByRole('button', { name: /register/i });
        expect(button.classList).toContain('cursor-not-allowed');
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
    // LOCAL SETUP
    let nameField;
    let passwordField;
    let passwordConfirmField;
    beforeEach(() => {
      nameField = screen.getByRole('textbox', { name: /name:/i });
      passwordField = screen.getByLabelText(/^password:$/i);
      passwordConfirmField = screen.getByLabelText(/^confirm password:$/i);
    });
    describe('register button with valid field values', () => {
      let button;
      beforeEach(() => {
        button = screen.getByRole('button', { name: /register/i });
        act(() => {
          fireEvent.change(nameField, { target: { value: 'validName' } });
          fireEvent.change(passwordField, { target: { value: 'goodPassword' } });
          fireEvent.change(passwordConfirmField, {
            target: { value: 'goodPassword' },
          });
        });
      });
      test('button is enabled', () => {
        expect(button).toBeEnabled();
      });
      test('button has cursor-allowed', () => {
        expect(button.classList).not.toContain('cursor-not-allowed');
      });
      test('button is colored', () => {
        expect(button.classList).toContain('bg-indigo-600');
      });
      test('button has hover effects', () => {
        expect(button.classList).toContain('hover:bg-indigo-700');
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
      describe('name availibility checking', () => {
        test.todo('username available message is correctly displayed');
        test.todo('username unavailable message is correctly displayed');
      });
    });
    describe('submit button action', () => {
      test.todo('triggers handleSubmit call');
      test.todo('triggers handleRegister call');
    });
  });

  describe('SUPPORTING RESOURCES TESTS', () => {
    describe('function handleRegister', () => {
      test.todo('has no return');
      test.todo('triggers a fetch API call');
      test.todo('triggers alert if !response.ok');
      test.todo('triggers alert if user.error');
      test.todo('logs user object on successful fetch');
    });

    describe('function allowSubmit', () => {
      test.todo('');
    });
  });
});
