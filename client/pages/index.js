import axios from 'axios'

const Landing = ({ currentUser }) => {
  console.log(currentUser)
  return <h1>Landing Page</h1>
}

Landing.getInitialProps = async () => {
  const { data } = await axios.get('/api/users/current')
  return data
}

export default Landing

