import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as fcl from "@onflow/fcl"
import { query } from '@onflow/fcl';
import uniqueSockers from '../data/sockers';
import { useMemo, useState, useEffect } from 'react'
import {HAS_FLOAT_COLLECTION} from '../cadence/scripts/script.has-float-collection'
import Table, { TableStyles } from '../components/Table';
import { PROFILE } from '../cadence/scripts/script.profile';
import styled from 'styled-components'



fcl
  .config()
  .put("accessNode.api", "https://access-mainnet-beta.onflow.org")


const Home: NextPage = () => {
  const Video = styled.video`
    width: 400px;
    border-radius: 40px;
  `

  const Img = styled.img`
    border-radius: 100px;
  `

  const Button = styled.button`

background: transparent;
  border-radius: 5px;
  border: 2px solid #60E1D8;
  color: #60E1D8;
  margin: 0 1em;
  padding: 0.25em 1em;
  font-size: 1.2em;
  text-transform: capitalize;
  cursor: pointer;
  `

useEffect(() => {
  mapBatch()
}, [])
	const [mappedBatch, setMappedBatch] = useState<any[] | null>(null);

  const batchColumns = useMemo(
		() => [
			{
				Header: 'Sock Gang Gang',
				columns: [

					{
						Header: 'Avatar',
            Cell: (tableProps:any) => (
              <Img
                src={tableProps.row.original.avatar}
                width={60}
                alt='avatar'
              />
            )
					},
					{
						Header: 'Name',
						accessor: 'name',
					},
					{
						Header: 'Wallet Address',
						accessor: 'address',
					},
					{
						Header: 'Number of Socks',
						accessor: 'numberOfSocks',
					},

				],
			},
		],
		[]
	);

  function handleClick() {
    navigator.clipboard.writeText(JSON.stringify(mappedBatch, null, 2))
  }

  const hasCollection = async (address: any) => {
		try {
			let response = await query({
				cadence: HAS_FLOAT_COLLECTION,
				args: (arg: any, t: any) => [arg(address, t.Address)],
			});
			return response;
		} catch (err) {
			console.log(err);
		}
	};

  const getProfile = async (address: any) => {
		try {
			let response = await query({
				cadence: PROFILE,
				args: (arg: any, t: any) => [arg(address, t.Address)],
			});
      console.log(response)
			return response;
		} catch (err) {
			console.log(err);
		}
	};

  const mapBatch = async () => {
		let mappedBatch = [];
		for (let item in uniqueSockers) {
			let element = uniqueSockers[item];
			var numberOfSocks = false;
			await hasCollection(element.address).then((response: any) => {
				numberOfSocks = response;
			});
      var name = "Anon"
      var avatar = "https://global-uploads.webflow.com/60f008ba9757da0940af288e/618a0cea8665abc4610c4ca6_basic%20beasts-p-500.png"
      await getProfile(element.address).then((response: any) => {
        if (response != null) {
        name = response.name
        avatar = response.avatar
		if(name == "roham") {
			avatar = "https://flovatar.com/api/image/1412"
		}
      }
				// numberOfSocks = response;
			});
			var batchItem = {
				address: element.address,
				numberOfSocks: numberOfSocks.toString(),
        name: name,
        avatar: avatar,
			};

      console.log(batchItem)

			mappedBatch.push(batchItem);
		}
		setMappedBatch(mappedBatch);
	};
  return (
    <div className={styles.container}>
      <Head>
        <title>Flowverse Sock Club</title>
        <meta name="description" content="Flowverse Sock Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <h1>Flowverse Sock Club</h1> 
        <Video autoPlay loop muted src="https://img.rarible.com/prod/video/upload/t_video_big/prod-itemAnimations/FLOW-A.01ab36aaf654a13e.RaribleNFT:14844/184d156f"/>
        <h2>Own a Pair to Become a Member</h2>
		<Button><a href="https://rarible.com/flowverse/created?filter[filter][sort]=cheapest">Join the club</a></Button>
		{/* <button onClick={()=>mapBatch()}>check batch</button> */}
        {/* <button onClick={()=>handleClick()}>Copy</button> */}
        {mappedBatch != null ? (
										<TableStyles>
											<Table
												columns={batchColumns}
												data={mappedBatch}
											/>
										</TableStyles>
									) : (
                    <>
										<TableStyles>

										<div>Fetching data from the blockchain...</div>
											<Table
												columns={batchColumns}
												data={uniqueSockers}
											/>
										</TableStyles>
                    </>
									)}
        
      </main>
      
    </div>
  )
}

export default Home
