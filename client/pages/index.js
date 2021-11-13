import axios from 'axios'

const Landing = ({ currentUser }) => {
  console.log(currentUser)
  return <h1>Landing Page</h1>
}

Landing.getInitialProps = async ({ req }) => {
  const { headers } = req
  if (typeof window === 'undefined') {
    const { data } = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current', { headers })
    return data
  } else {
    const { data } = await axios.get('/api/users/current')
    return data
  }
}

export default Landing

