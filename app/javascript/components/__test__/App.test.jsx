/**
 * @jest-environment jsdom
 */
// REACT
import React from 'react';
import { Router, BrowserRouter } from 'react-router-dom';

// TEST UTILITIES
import renderer, { act } from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock, { enableFetchMocks, resetMocks } from 'jest-fetch-mock';

// POLYFILLS
import 'regenerator-runtime'; // for regeneratorRuntime

// COMPONENTS
import App from '../App';

// GLOBAL SETUP
let container;
beforeEach(() => {
  enableFetchMocks();
  resetMocks();
  fetchMock.mockResponse(JSON.stringify({ foo: 'bar' }));
  container = document.createElement('div');
  document.body.appendChild(container);
});

// GLOBAL TEARDOWN
afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('App component', () => {
  describe('STATIC TESTS', () => {
    test('renders correctly from snapshot', () => {
      const tree = renderer.create(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('ROUTING TESTS', () => {
    test('/ renders Landing', async () => {
      render(
        <Router location={{ pathname: '/' }}>
          <App />
        </Router>,
        container,
      );
      expect(screen.getByText(/landing/i)).toBeInTheDocument();
    });
    test('/register renders NewUserForm', async () => {
      render(
        <Router location={{ pathname: '/register' }}>
          <App />
        </Router>,
        container,
      );
      expect(screen.getByText(/create new account/i)).toBeInTheDocument();
    });
    test('/login renders NewSessionForm', () => {
      render(
        <Router location={{ pathname: '/login' }}>
          <App />
        </Router>,
        container,
      );
      expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
    });
    test('/user:id renders Profile', async () => {
      await act(async () => {
        render(
          <Router location={{ pathname: '/user/11235813' }}>
            <App />
          </Router>,
          container,
        );
      });
      expect(screen.getByText(/Profile for user id: 11235813/i));
    });
  });
});
