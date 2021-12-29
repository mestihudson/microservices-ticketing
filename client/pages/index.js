import buildClient from '../api/build-client'

const Landing = ({ currentUser }) => {
  return (
    currentUser
      ? <div>You are signed in</div>
      : <div>You are NOT signed in</div>
  )
}

Landing.getInitialProps = async (context, client, currentUser) => {
  return {}
}

export default Landing

