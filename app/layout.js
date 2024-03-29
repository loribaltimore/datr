import './globals.css'
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { Inter } from 'next/font/google'
import Nav from '../components/Nav';
const inter = Inter({ subsets: ['latin'] })
import { NextAuthProvider } from 'components/NextAuthProvider';
import { headers } from 'next/headers'
import Flash from 'components/Flash';
import { ReviewProvider } from 'components/ReviewContext';
import { RegistrationProvider } from 'components/RegistrationContext';
import { NotifProvider } from 'components/NotifContext';
import Footer from 'components/Footer';
import database from 'models/database';
import User from 'models/userSchema';
import {ObjectId} from "mongodb";


export const metadata = {
  title: 'Datr',
  description: 'A Dating App for Pros',
}
export const dynamic = 'force-dynamic';
const url = process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.NEXTAUTH_URL;

async function getSession(cookie) {
  const response = await fetch(`${url}/api/auth/session`, {
    headers: {
      cookie,
    },
  }).then(async data => {return data}).catch(err => console.log(err));
  const session = await response.json();
  return Object.keys(session).length > 0 ? session : null;
};

async function getCurrentUser(userId) {
  await database();
  const currentUser = await User.findById(userId).then(data => data).catch(err => console.log(err));
  return currentUser;
};


export default async function RootLayout({ children }) {
  let currentUser = null;
  const session = await getSession(headers().get('cookie') ?? '').then(data => {
    if (data) {
      return data
    } else {
     return null;
    };
  }).catch(err => console.log(err));
  if (session) {
    currentUser = await getCurrentUser(session.userId.toString());
  }

  return (
    <html lang="en">
      <body className={`${inter.className} relative overflow-hidden h-screen bg-gradient-to-tr from-[#FF33E7] to-[#33FFD1]` } style={{backgroundColor: 'gray'}}>
        <NextAuthProvider session={session}>
          <RegistrationProvider>
            <ReviewProvider>
              <NotifProvider>
                <Nav disabledRegistration={currentUser !== null && currentUser.username && currentUser.username.length ? false : true}>
            {
             session && session.flash && session.flash.message ?
              <Flash flash={session.flash} /> : null
            }
                  {children}
                </Nav>

                {
                  !session ?
                  <Footer /> : null
                }
              </NotifProvider>
            </ReviewProvider>
            </RegistrationProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
