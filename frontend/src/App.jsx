
import './App.css'
import QueryApp from './components/QueryApp'
import Layout from './components/Layout'
import{ Router,Routes,Route} from 'react-router-dom'

function App() {
  
  return (
    <>
  
       <Layout>
        <Routes>
       <Route path='/' element={<QueryApp/>} />
        </Routes>
    </Layout>
  
    </>
  )
}

export default App
