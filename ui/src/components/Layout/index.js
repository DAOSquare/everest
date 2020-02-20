/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import { Global } from '@emotion/core'

import Footer from '../Footer'
import Navbar from '../Navbar'
import Seo from '../Seo'

const LayoutTemplate = ({ children, mainStyles, ...props }) => {
  console.log('layoug props: ', props)
  const styles = {
    maxWidth: '1260px',
    mx: 'auto',
    px: 4,
    boxSizing: 'content-box',
    position: 'relative',
  }

  const mStyles =
    props.path.includes('new') || props.path.includes('edit')
      ? { backgroundColor: 'secondary', marginTop: '-18px' }
      : {}
  return (
    <div>
      <Global
        styles={theme => {
          return {
            '*, *::after, *::before': {
              boxSizing: 'border-box',
              margin: 0,
              padding: 0,
            },
            body: {
              fontFamily: 'Space Mono, monospace',
              transition: 'all 0.3s ease',
              WebkitFontSmoothing: 'antialiased',
              fontSmoothing: 'antialiased',
            },
          }
        }}
      />
      <Seo />
      <section {...props}>
        <Navbar sx={styles} path={props && props.path} />
        <Box
          sx={{
            ...mStyles,
            py: [5, 5, 9],
            '@keyframes fadein': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
            animation: 'fadein 0.5s',
          }}
        >
          <main
            sx={{
              ...styles,
              mt: [5, 5, 0],
              minHeight: 'calc(100vh - 400px)',
              position: 'static',
            }}
          >
            {children}
          </main>
        </Box>
        <Footer sx={styles} />
      </section>
    </div>
  )
}

export default LayoutTemplate
