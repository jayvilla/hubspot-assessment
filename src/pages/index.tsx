import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Home() {
  console.log('process', process.env)
  return (
    <>
      <div>Hello World</div>
    </>
  )
}
