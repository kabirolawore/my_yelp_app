/* src/App.js */
import React, { useEffect, useState } from 'react'
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createRestaurant } from './graphql/mutations'
import { listRestaurants } from './graphql/queries'
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import "./app.scss"
import Photo from "./components/Assets/yp-2.jpg"
import Logo from "./images/yelp.png"
import awsExports from "./aws-exports";
import RestaurantCard from './components/RestaurantCard/RestaurantCard';
Amplify.configure(awsExports);

const initialState = { name: '', description: '', state: '' }

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState)
  const [restaurants, setRestaurants] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  useEffect(() => {
    fetchRestaurants()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchRestaurants() {
    try {
      const restaurantsData = await API.graphql(graphqlOperation(listRestaurants))
      const restaurants = restaurantsData.data.listRestaurants.items
      setRestaurants(restaurants)
    } catch (err) { console.log('error fetching restaurants') }
  }

  async function addRestaurants() {
    try {
      if (!formState.name || !formState.description || !formState.state) return
      const restaurant = { ...formState }
      setRestaurants([...restaurants, restaurant])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createRestaurant, {input: restaurant}))
    } catch (err) {
      console.log('error creating restaurant:', err)
    }
  }

  return (
    <div className='container'>
    <div className='top-bar'>
      <Heading className='head' level={1}>Hello {user.attributes.email.split("@")[0]}</Heading>
      <img src={Logo} alt='yelp logo'/>
      <Button onClick={signOut}>Sign out</Button>
    </div>
      <Button onClick={()=>{setShowAdd(!showAdd)}}>Add New</Button>
      {showAdd && <div className='add_restaurant'>
      <div className='input-area'>
      <input
        onChange={event => setInput('name', event.target.value)}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        value={formState.description}
        placeholder="Description"
      />
      <input
        onChange={event => setInput('state', event.target.value)}
        value={formState.state}
        placeholder="State"
      />
      </div>
      <button onClick={addRestaurants}>Create Restaurant</button>
      </div>}
      <div className='main'>
      {
        restaurants.map((restaurant, index) => (
          <RestaurantCard key={restaurant.id ? restaurant.id : index} name={restaurant.name} description = {restaurant.description} pix = {Photo} state = {restaurant.state}/>
        ))
      }
      </div>
    </div>
  )
}

export default withAuthenticator(App);