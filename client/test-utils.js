import React from '../node_modules/react/addons';
import assign from '../node_modules/react/lib/Object.assign.js';
import sinon from 'sinon';
import _ from 'lodash';

const { func } = React.PropTypes;

// React helpers

const renderInto = (tagName, item) => {
  const el = document.createElement(tagName);
  React.render(item, el);
  return el;
};

// Router helpers
const stubRouterContext = (Component, props, stubs) => {
  return React.createClass({
    childContextTypes: {
      makePath: func,
      makeHref: func,
      transitionTo: func,
      replaceWith: func,
      goBack: func,
      getCurrentPath: func,
      getCurrentRoutes: func,
      getCurrentPathname: func,
      getCurrentParams: func,
      getCurrentQuery: func,
      isActive: func,
    },

    getChildContext () {
      return assign({
        makePath () {},
        makeHref () {},
        transitionTo () {},
        replaceWith () {},
        goBack () {},
        getCurrentPath () {},
        getCurrentRoutes () {},
        getCurrentPathname () {},
        getCurrentParams () {},
        getCurrentQuery () {},
        isActive () {}
      }, stubs);
    },

    render () {
      return <Component {...this.props} />
    }
  });
};

const seq = (function () {
  let i = 1;
  return () => i++;
});

export { renderInto, stubRouterContext, seq };
