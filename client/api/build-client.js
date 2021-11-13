import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    const baseURL = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
    const { headers } = req
    return axios.create({ baseURL, headers })
  } else {
    const baseURL = '/'
    return axios.create({ baseURL })
  }
}

export default buildClient
