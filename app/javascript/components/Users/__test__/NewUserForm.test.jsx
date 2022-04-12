// REACT
import React from 'react';

// TEST UTILITIES
import renderer from 'react-test-renderer';

// COMPONENTS
import NewUserForm from '../NewUserForm';

describe('NewUserForm component', () => {
  describe('STATIC TESTS', () => {
    test('renders correctly from snapshot', () => {
      const tree = renderer.create(<NewUserForm />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
