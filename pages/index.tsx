import { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/client';
import Nav from '../components/nav';


const IndexPage: NextPage = () => {
 const [session, loading] = useSession();

 return (
   <div>
     <Nav />
     {!session && (
        <div className="">
         No signed in<br />
         <button onClick={(): Promise<void> => signIn()}>Sign in</button>
        </div>
     )}
     {session && (
        <div className="">
          Signed in as {session.user.email}<br />
          <button onClick={(): Promise<void> => signOut()}>Sign out</button>
        </div>
     )}
   </div>
 );
};

export default IndexPage;


