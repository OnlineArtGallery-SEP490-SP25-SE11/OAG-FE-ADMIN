'use client';
import { signIn } from 'next-auth/react';

export default function Auth() {
	const handleSignIn = async () => {
		await signIn('google');
	};
	return (
		<>
			<button onClick={handleSignIn}>Sign in with Google</button>
		</>
	);
}
