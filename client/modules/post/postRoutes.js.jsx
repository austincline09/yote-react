

import React from 'react';
import { Route, IndexRoute } from 'react-router';

//import Components
import Layout from './components/PostLayout.js.jsx';
import List from './components/PostList.js.jsx';
import Populated from './components/PopulatedPost.js.jsx';
import Create from './components/CreatePost.js.jsx';
import Update from './components/UpdatePost.js.jsx';

const postRoutes =
<Route path="/posts" component={Layout} >
  <IndexRoute component={List} />
  <Route path="/posts/new" component={Create} />
  <Route path="/posts/:slug">
    <IndexRoute component={Populated} />
    <Route path="/posts/:slug/update" component={Update} />
  </Route>
</Route>

;

export default postRoutes;
