/**
 * @jest-environment jsdom
 */
// REACT
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
// TEST UTILITIES
import renderer, { act } from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import fetchMock, { enableFetchMocks, resetMocks } from 'jest-fetch-mock';
import '@testing-library/jest-dom';

// COMPONENTS
import Profile from '../Profile';

// POLYFILLS
import '@babel/polyfill'; // for regeneratorRuntime

// GLOBAL SETUP
beforeEach(async () => {
  enableFetchMocks();
  resetMocks();
  fetchMock.mockResponse(JSON.stringify({ name: 'jason', id: '11235813' }));
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/user/11235813']}>
        <Routes>
          <Route path="/user/:user_id" element={<Profile />} />
        </Routes>
      </MemoryRouter>,
    );
  });
});

// GLOBAL TEARDOWN
afterEach(() => {
  resetMocks();
});

describe('Profile component', () => {
  describe('STATIC TESTS', () => {
    test('renders correctly from snapshot', () => {
      const tree = renderer.create(
        <MemoryRouter initialEntries={['/user/11235813']}>
          <Routes>
            <Route path="/user/:user_id" element={<Profile />} />
          </Routes>
        </MemoryRouter>,
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('DYNAMIC TESTS', () => {
    test('page load triggers api call', () => {
      jest.spyOn(global, 'fetch');
      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith('/api/users/11235813');
    });

    test('fetched user name displays after initial load', () => {
      expect(screen.getByText(/name: jason/i)).toBeInTheDocument();
    });
  });
});
