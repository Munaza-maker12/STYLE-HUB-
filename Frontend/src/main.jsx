
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
    <Toaster position='top-right'/>
      <App />
    </BrowserRouter>
  </Provider>
)
  