import buildClient from '../api/build-client'

const Landing = ({ currentUser }) => {
  return (
    currentUser
      ? <div>You are signed in</div>
      : <div>You are NOT signed in</div>
  )
}

Landing.getInitialProps = async (context) => {
  const uri = '/api/users/current'
  const { data } = await buildClient(context).get(uri)
  return data
}

export default Landing

