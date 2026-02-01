import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Firebase
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null); // Simulate no user initially
    return jest.fn(); // Return unsubscribe function
  }),
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('./config/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    currentUser: null,
    signInWithGoogle: jest.fn(),
    logout: jest.fn(),
    loading: false,
  }),
}));

jest.mock('./components/CalcolatoreStipendio', () => {
  return function MockCalcolatoreStipendio() {
    return <div>Calcolatore Stipendio</div>;
  };
});

test('renders Calcolatore Stipendio app', () => {
  render(<App />);
  const titleElement = screen.getByText(/calcolatore stipendio/i);
  expect(titleElement).toBeInTheDocument();
});
