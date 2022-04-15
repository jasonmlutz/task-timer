/**
 * @jest-environment jsdom
 */
// REACT
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// TEST UTILITIES
import renderer from 'react-test-renderer';

// COMPONENTS
import App from '../../App';

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
});
