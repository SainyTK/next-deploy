import Head from 'next/head'
import { useEffect, useState } from 'react'
import config from '../config'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { getCookie, setCookie } from '../session';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';

export default function Home(props) {

  // const { persons } = props;

  const [persons, setPersons] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  useEffect(() => {
    (async function () {
      const res = await fetch(`${config.apiUrl}/persons`);
      const persons = await res.json();
      setPersons(persons);
    })()
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${config.apiUrl}/login`, { email: username, password });
      alert('Login success. You are ' + res.data.user.first_name);
      setCookie('token', res.data.token);
      setCookie('user', JSON.stringify(res.data.user))
      router.push('/main')
    } catch (e) {
      alert('Login Failed')
    }

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h4>Login</h4>
        <div>
          <div>Username: <input type='text' value={username} onChange={e => setUsername(e.target.value)} /></div>
          <div>Password: <input type='password' value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div><button onClick={handleLogin}>Login</button></div>
        </div>
      </div>
      <div>
        {
          !persons ? <div>Loading...</div> : persons.map((person, index) => (
            <pre key={index}>{JSON.stringify(person)}</pre>
          ))
        }
      </div>

    </div>
  )
}

// export async function getStaticProps(context) {
//   const res = await fetch(`${config.apiUrl}/persons`);
//   const persons = await res.json();
//   return {
//     props: {
//       persons
//     }, // will be passed to the page component as props
//   }
// }