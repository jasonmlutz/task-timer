// REACT
import React from 'react';

// TEST UTILITIES
import renderer from 'react-test-renderer';
// COMPONENTS
import NewSessionForm from '../NewSessionForm';

describe('NewSessionForm component', () => {
  describe('STATIC TESTS', () => {
    test('renders correctly from snapshot', () => {
      const tree = renderer.create(<NewSessionForm />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
