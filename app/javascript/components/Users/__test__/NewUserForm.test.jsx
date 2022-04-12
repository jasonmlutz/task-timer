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

    describe('input fields are present', () => {
      test.todo('name input');
      test.todo('password input');
      test.todo('password confirmation input');
    });

    describe('register button', () => {
      test.todo('button is present');
      test.todo('button is initially disabled');
    });

    describe('validation display messages are absent', () => {
      test.todo('name availability');
      test.todo('password agreement');
    });
  });

  describe('DYNAMIC TESTS', () => {
    describe('password fields', () => {
      test.todo('password fields accept input');
      describe('password validation message', () => {
        test.todo('non-empty non-matching passwords reveal warning message');
        test.todo('matching passwords do not reveal warning message');
        test.todo('warning message hidden when only password is empty');
        test.todo('warning message hidden when only password confirmation is hidden');
      });
    });
    describe('name field', () => {
      test.todo('name field accepts input');
      describe('name availibility checking', () => {
        test.todo('username available message is correctly displayed');
        test.todo('username unavailable message is correctly displayed');
      });
    });
  });
});
