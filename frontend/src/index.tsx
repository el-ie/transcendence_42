import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Social from './pages/Social';
import Game from './pages/Game';
import Header from './components/Header';
import LoginForm from './pages/Login/LoginForm';
import RouteProtection from './components/RouteProtection';
import { SocketProvider } from './components/Socket';
import Profile from './pages/Profile';
import Settings from './pages/Settings';


const root_element: HTMLElement = document.getElementById('root') as HTMLElement;
const root                      = ReactDOM.createRoot(root_element);

root.render(
	<Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={
          <RouteProtection>
              <Header />
              <SocketProvider>
                <Home />
              </SocketProvider>
            </RouteProtection>
        } />
        <Route path="/social" element={
            <RouteProtection>
              <Header />
              <SocketProvider>
               <Social />
              </SocketProvider>
            </RouteProtection>
        } />
        <Route path="/game" element={
            <RouteProtection>
              <Header />
              <SocketProvider>
                <Game />
              </SocketProvider>
            </RouteProtection>
        } />
        <Route path="/game/:direct" element={
            <RouteProtection>
              <Header />
              <SocketProvider>
                <Game />
              </SocketProvider>
            </RouteProtection>
        } />
        <Route path="/profile/:userId" element={
            <RouteProtection>
              <Header />
              <SocketProvider>
                <Profile />
              </SocketProvider>
            </RouteProtection>
        } />
		<Route path="/settings" element={
			<RouteProtection>
				<Header />
				<SocketProvider>
					<Settings />
				</SocketProvider>
			</RouteProtection>
		} />
      </Routes>
	  </Router>
);
