import React from 'react'
import Time from '../time/time'
import Admin from '../admin/admin'
import Table from '../table/table'
import Loader from '../loader/loader'

const Home = () => {
  return (
    <>
    {/* <Loader /> */}
    <Time />
    <Admin />
    <Table />

    </>
  )
}

export default Home