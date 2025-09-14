import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}


const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <div className="Header px-[34px] py-[16px] h-screen flex flex-col">
                <header className='flex justify-between items-center'>
                    <Link className="flex items-center font-bold gap-2" to="/">
                        <img className='h-[32px] w-[32px]' src="/logo.png" alt="" />
                        <span className='text-3xl'>Chat AI</span>
                    </Link>
                    <div className='user'>
                        {/* <SignedOut>
                            <SignInButton />
                        </SignedOut> */}
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </header>

                <main className='flex-1 overflow-auto'>
                    <Outlet />
                </main>
            </div>
        </ClerkProvider>
    )
}

export default RootLayout;
