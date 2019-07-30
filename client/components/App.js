import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Toc from './Toc';
import Page from './Page';


const App = () => {
	return (
		<Router>
			<div className="container">
				<header>
					<h1>2016 Volkswagen e-Golf Owner's Manual</h1>
				</header>

				<Toc />

				<div className="main" role="main">
					<Route path="/:pageId" component={Page} />
				</div>
			</div>
		</Router>
	);
};

export default App;
