import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
    return <div className='SignInPage h-screen w-full flex justify-center items-center'>
        <SignIn signUpUrl="/signup" forceRedirectUrl="/dashboard"/>
    </div>;
}

export default SignInPage;