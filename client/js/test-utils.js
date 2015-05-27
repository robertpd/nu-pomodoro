import React from 'react/addons';
import Flux from 'flummox';
import assign from 'react/lib/Object.assign';
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

// Flux helpers
class FakeFlux extends Flux {
  constructor({ actions = {}, stores = {} } = {}) {
    super();

    this.getStore = sinon.stub();
    this.getActions = sinon.stub();
    this.getActionIds = sinon.stub();

    _.each(actions, (v, k) => {
      this.getActions.withArgs(k).returns(v);
      this.getActionIds.withArgs(k).returns(v.getActionIds());
    });

    _.each(stores, (v, k) => {
      this.getStore.withArgs(k).returns(v);
    });
  }
}

const FakeStore = () => {
  const store = {
    addListener: sinon.stub()
  };

  return store;
};

const simulateAction = (store, actionId, body) => store.handler( { actionId: actionId, body: body });

const seq = (function () {
  let i = 1;
  return () => i++;
});

export { renderInto, stubRouterContext, FakeFlux, FakeStore, simulateAction, seq };
