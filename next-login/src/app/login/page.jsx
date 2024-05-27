"use client"

import React, { useState,useEffect } from 'react'
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, redirect } from 'next/navigation'
import { useSession } from 'next-auth/react';
import liff from '@line/liff';


function LoginPage() {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const { data: session } = useSession();
    if (session) router.replace('welcome');

    useEffect(() => {
        liff.init({
            liffId: '2005153917-wzBM0A0R', // Use own liffId
        });
    },[])

    const handleLoginliff = ()=>{
        try{
            liff.login()
        }catch(err){
            console.log(err);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await signIn("credentials", {
                name, password, redirect: false
            })

            if (res.error) {
                setError("Invalid credentials");
                return;
            }

            // router.replace("welcome");

        } catch(error) {
            console.log(error);
        }
    }

  return (
    <Container>
        <Navbar />
            <div className='flex-grow'>
                <div className="flex justify-center items-center">
                    <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
                        <h3 className='text-3xl'>Login Page</h3>
                        <hr className='my-3' />
                        <form onSubmit={handleSubmit}>
                            <input type="text" onChange={(e) => setName(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your email' />
                            <input type="password" onChange={(e) => setPassword(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your password' />
                            <button type='submit' className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'>Sign In</button>
                        </form>
                         <button type='submit' onClick={handleLoginliff} className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'>Line Login</button>
                        <hr className='my-3' />
                        <p>Go to <Link href="/register" className='text-blue-500 hover:underline'>Register</Link> Page</p>
                    </div>
                </div>
            </div>
        <Footer />
    </Container>
  )
}

export default LoginPage
