import 'bootstrap/dist/css/bootstrap.css'

import buildClient from '../api/build-client'
import Header from '../components/header'

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

App.getInitialProps = async (appContext) => {
  const { data } = await buildClient(appContext.ctx).get('/api/users/current')

  const pageProps = appContext.Component.getInitialProps
    ? await appContext.Component.getInitialProps(appContext.ctx)
    : {}

  return { pageProps, ...data }
}

export default App
