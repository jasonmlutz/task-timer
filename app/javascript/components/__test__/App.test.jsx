/**
 * @jest-environment jsdom
 */
// REACT
import React from 'react';
// TEST UTILITIES
import renderer from 'react-test-renderer';

// COMPONENTS
import App from '../App';

describe('App component', () => {
  describe('STATIC TESTS', () => {
    test('renders correctly from snapshot', () => {
      const tree = renderer.create(<App />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
