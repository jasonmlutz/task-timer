/**
 * @jest-environment jsdom
 */
// REACT
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// TEST UTILITIES
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line no-unused-vars
import { toBeDisabled } from '@testing-library/jest-dom';

// COMPONENTS
import App from '../App';

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

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
    test('/register renders NewUserForm', () => {
      renderWithRouter(<App />, { route: '/register' });

      expect(screen.getByText(/create new account/i)).toBeInTheDocument();
    });
  });
});
