import React from 'react';
import { SignUp } from '@clerk/clerk-react'

const SignUpPage = () => {
    return <div className='SignUpPage h-screen w-full flex justify-center items-center'>
        <SignUp signInUrl="/signin"/>
    </div>;
}

export default SignUpPage;