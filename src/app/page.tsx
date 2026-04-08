import { redirect } from 'next/navigation';

export default function Home() {
  // Directly point the root route to our new authentication flow
  redirect('/login');
}
