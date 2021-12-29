import 'bootstrap/dist/css/bootstrap.css'

import buildClient from '../api/build-client'
import Header from '../components/header'

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps}/>
      </div>
    </div>
  )
}

App.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/current')

  const pageProps = appContext.Component.getInitialProps
    ? await appContext.Component.getInitialProps(
        appContext.ctx, client, data.currentUser
      )
    : {}

  return { pageProps, ...data }
}

export default App
