import buildClient from '../api/build-client'

const Landing = ({ currentUser }) => {
  console.log(currentUser)
  return <h1>Landing Page</h1>
}

Landing.getInitialProps = async (context) => {
  const uri = '/api/users/current'
  const { data } = await buildClient(context).get(uri)
  return data
}

export default Landing

