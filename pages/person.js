import Head from 'next/head'
import { useEffect, useState } from 'react'
import config from '../config'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { getCookie, removeCookie, setCookie } from '../session';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';

export default function Person(props) {

  const [firstname, setFirstname] = useState('');
  const [person, setPerson] = useState();

  const router = useRouter();

  const handleFetch = async () => {
    try {
      console.log('token', props.token);
      const res = await axios.post(`${config.apiUrl}/persons/${firstname}`, {
        headers: { Authorization: `Bearer ${props.token}` }
      })
      setPerson(res.data);
    } catch (e) {
      console.error(e)
    }

  }

  const handleLogout = async () => {
    removeCookie('token')
    removeCookie('user')
    router.replace('/')
  }

  return (
    <div className={styles.container}>
      <div>Firstname: <input value={firstname} onChange={e => setFirstname(e.target.value)} /></div>
      <div>{JSON.stringify(person)}</div>
      <button onClick={handleFetch}>Fetch</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export async function getServerSideProps(context) {
  const token = getCookie('token', context.req);
  try {
    const user = jwtDecode(token);
    return {
      props: { token, user },
    }
  } catch (e) {
    return {
      props: {},
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
}