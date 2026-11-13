import { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import AuthScreen from '../../components/public/AuthScreen';
import { loginUser } from '../../services/authServices';
import { setCredentials } from '../../features/auth/authSlice';

const fields = [
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
];

export default function Login() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      const data = await loginUser(values);
      const { token, user } = data?.data ?? data ?? {};
      if (!token || !user) {
        setError('We couldn’t start your session. Please try again.');
        return;
      }

      dispatch(setCredentials({ user, token }));
      toast.success('Welcome to CourseCraft');
      window.location.assign('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Couldn’t sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthScreen title="Welcome back" description="Sign in to pick up where you left off."
      fields={fields} values={values}
      onChange={(event) => setValues({ ...values, [event.target.name]: event.target.value })}
      onSubmit={handleSubmit} error={error} busy={busy} action="Sign in" pendingAction="Signing in…"
      prompt="New to CourseCraft?" alternatePath="/register" alternateAction="Create an account" />
  );
}
