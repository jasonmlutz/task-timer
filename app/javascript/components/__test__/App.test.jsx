/**
 * @jest-environment jsdom
 */
// REACT
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// TEST UTILITIES
import renderer from 'react-test-renderer';

// COMPONENTS
import App from '../App';

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
});
