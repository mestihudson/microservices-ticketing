import 'bootstrap/dist/css/bootstrap.css'

import buildClient from '../api/build-client'

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Header! {currentUser.email}</h1>
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
