import { unstable_HistoryRouter as HistoryRouter, Route, Routes } from 'react-router-dom'
import { history } from './utils/history';
import Layout from './pages/Layout';
import Login from './pages/Login';
// import { Button } from 'antd';
import { AuthComponent } from '@/components/AuthComponent'
import './App.css'
import Home from './pages/Home';
import Article from './pages/Article';
import Publish from './pages/Publish';

function App() {
  return (
    // 路由配置
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          {/* 需要鉴权的路由 */}
          <Route path="/" element={
            <AuthComponent>
              <Layout />
            </AuthComponent>
          } >

            <Route index element={<Home/>} />
            <Route path='article' element={<Article/>} />
            <Route path='publish' element={<Publish/>} />
          </Route>
          {/* 不需要鉴权的路由 */}
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </HistoryRouter>
    
  );
}

export default App;
