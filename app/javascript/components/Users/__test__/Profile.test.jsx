/**
 * @jest-environment jsdom
 */
// REACT
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// TEST UTILITIES
import renderer, { act } from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import fetchMock, { enableFetchMocks, resetMocks } from 'jest-fetch-mock';
import '@testing-library/jest-dom';

// COMPONENTS
import App from '../../App';

// POLYFILLS
import '@babel/polyfill'; // for regeneratorRuntime

// GLOBAL SETUP
let container;
beforeEach(async () => {
  enableFetchMocks();
  resetMocks();
  container = document.createElement('div');
  document.body.appendChild(container);
  fetchMock.mockResponse(JSON.stringify({ name: 'jason', id: '11235813' }));
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/user/11235813']}>
        <App />
      </MemoryRouter>,
      container,
    );
  });
});

// GLOBAL TEARDOWN
afterEach(() => {
  document.body.removeChild(container);
  container = null;
  resetMocks();
});

describe('Profile component', () => {
  describe('STATIC TESTS', () => {
    test('renders correctly from snapshot', () => {
      const tree = renderer.create(
        <MemoryRouter initialEntries={['/user/11235813']}>
          <App />
        </MemoryRouter>,
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('DYNAMIC TESTS', () => {
    test('page load triggers api call', () => {
      jest.spyOn(global, 'fetch');
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/users/11235813');
    });

    test('fetched user name displays after initial load', () => {
      expect(screen.getByText(/name: jason/i)).toBeInTheDocument();
    });
  });
});
