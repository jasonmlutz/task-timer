/**
 * @jest-environment jsdom
 */
import ReactDOM from 'react-dom/client';

describe('APPLICATION ROOT', () => {
  describe('STATIC TESTS', () => {
    test('should render without crashing', () => {
      jest.spyOn(ReactDOM, 'createRoot');
      const div = document.createElement('div');
      div.id = 'root';
      document.body.appendChild(div);
      require('../index.jsx');
      expect(ReactDOM.createRoot).toBeCalledWith(div);
    });
  });
});
