import axios from 'axios'

const Landing = ({ currentUser }) => {
  console.log(currentUser)
  return <h1>Landing Page</h1>
}

Landing.getInitialProps = async ({ req }) => {
  const { headers } = req
  const url = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
  const uri = '/api/users/current'
  if (typeof window === 'undefined') {
    const { data } = await axios.get(`${url}${uri}`, { headers })
    return data
  } else {
    const { data } = await axios.get(uri)
    return data
  }
}

export default Landing

