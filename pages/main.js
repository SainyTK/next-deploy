import Head from 'next/head'
import { useEffect, useState } from 'react'
import config from '../config'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { getCookie, removeCookie, setCookie } from '../session';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';

export default function Main(props) {

  const router = useRouter();

  const handleLogout = async () => {
    removeCookie('token')
    removeCookie('user')
    router.replace('/')
  }

  return (
    <div className={styles.container}>
      <div>{JSON.stringify(props.user)}</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export async function getServerSideProps(context) {
  const token = getCookie('token', context.req);
  try {
    const user = jwtDecode(token);
    return {
      props: { user },
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