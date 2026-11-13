import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthScreen from '../../components/public/AuthScreen';
import { registerUser } from '../../services/authServices';

const fields = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
];

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      await registerUser(values);
      toast.success('Account created. You can now sign in.');
      navigate('/login');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Couldn’t create your account. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthScreen title="Create your account" description="Set up your CourseCraft workspace."
      fields={fields} values={values}
      onChange={(event) => setValues({ ...values, [event.target.name]: event.target.value })}
      onSubmit={handleSubmit} error={error} busy={busy} action="Create account" pendingAction="Creating account…"
      prompt="Already have an account?" alternatePath="/login" alternateAction="Sign in" />
  );
}
