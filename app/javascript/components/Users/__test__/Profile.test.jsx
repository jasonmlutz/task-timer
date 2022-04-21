/**
 * @jest-environment jsdom
 */
// REACT and UTILS
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// TEST UTILS
import { cleanup, render, screen } from '@testing-library/react';
import { create, act } from 'react-test-renderer';
import fetchMock, { enableFetchMocks, resetMocks } from 'jest-fetch-mock';
// toBeInTheDocument
import '@testing-library/jest-dom';

// POLYFILLS
import 'regenerator-runtime'; // for regeneratorRuntime

// COMPONENT
import Profile from '../Profile';

const requests = require('../../../resources/requests');

beforeAll(() => {
  enableFetchMocks();
});

beforeEach(() => {
  fetchMock.mockResponse(JSON.stringify({ id: 11235813, name: 'jason' }));
});

afterEach(() => {
  resetMocks();
  cleanup();
});

test('renders correctly from snapshot', async () => {
  let tree;
  await act(async () => {
    tree = create(
      <MemoryRouter initialEntries={['/user/11235813']}>
        <Routes>
          <Route path="/user/:user_id" element={<Profile />} />
        </Routes>
      </MemoryRouter>,
    );
  });

  expect(tree.toJSON()).toMatchSnapshot();
});

test('page load triggers api call', async () => {
  jest.spyOn(requests, 'getRequest');
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/user/11235813']}>
        <Routes>
          <Route path="/user/:user_id" element={<Profile />} />
        </Routes>
      </MemoryRouter>,
    );
  });
  expect(requests.getRequest).toBeCalledTimes(1);
  expect(requests.getRequest).toBeCalledWith('/api/users/11235813', expect.any(Function));
});

test('fetched user name displays after initial load', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/user/11235813']}>
        <Routes>
          <Route path="/user/:user_id" element={<Profile />} />
        </Routes>
      </MemoryRouter>,
    );
  });
  expect(screen.getByText(/name: jason/i)).toBeInTheDocument();
});
