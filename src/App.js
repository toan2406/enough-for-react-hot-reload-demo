import React, { Component } from 'react';

const createProxy = InitialComponent => {
  let ProxyComponent = null;

  // Map instance properties
  // e.g. props, context, state, refs
  const instantiate = (Component, context, params) => {
    const instance = new Component(...params);
    Object.keys(instance).forEach(key => {
      context[key] = instance[key];
    });
  };

  const update = NextComponent => {
    let nextPrototype = NextComponent.prototype;

    // Map prototype methods
    // e.g. handleClick, render
    Object.getOwnPropertyNames(nextPrototype).forEach(key => {
      ProxyComponent.prototype[key] = function(...args) {
        return nextPrototype[key].apply(this, args);
      };
    });

    // Setup prototype chain
    ProxyComponent.prototype.__proto__ = nextPrototype;
  };

  const get = () => ProxyComponent;

  // Map properties, methods, prototype for the InitialComponent
  ProxyComponent = function(...args) {
    instantiate(InitialComponent, this, args);
  };
  update(InitialComponent);

  return {
    update,
    get,
  };
};

class Counter1 extends Component {
  state = {
    count: 0,
  };

  handleClick() {
    this.setState(({ count }) => ({
      count: ++count,
    }));
  }

  render() {
    return (
      <div style={styles.counter}>
        <h1 style={styles.header}>{this.state.count}</h1>
        <button
          onClick={this.handleClick.bind(this)}
          style={{ ...styles.button, background: 'cyan' }}>
          Increase 1
        </button>
      </div>
    );
  }
}

class Counter3 extends Component {
  state = {
    count: 0,
  };

  handleClick() {
    this.setState(({ count }) => ({
      count: count + 3,
    }));
  }

  render() {
    return (
      <div style={styles.counter}>
        <h1 style={styles.header}>{this.state.count}</h1>
        <button
          onClick={this.handleClick.bind(this)}
          style={{ ...styles.button, background: 'yellow' }}>
          Increase 3
        </button>
      </div>
    );
  }
}

// Create proxy for Counter1
const counterProxy = createProxy(Counter1);
const Counter = counterProxy.get();

class App extends Component {
  handleClick = () => {
    // Proxy now point to Counter3
    counterProxy.update(Counter3);
    this.forceUpdate();
  };

  render() {
    return (
      <div style={styles.app}>
        <Counter />
        <br />
        <br />
        <br />
        <button onClick={this.handleClick} style={styles.button}>
          Load new counter
        </button>
      </div>
    );
  }
}

const styles = {
  app: {
    width: 320,
    padding: 16,
    margin: '0 auto',
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
    textAlign: 'center',
    border: 'solid 2px #333',
    borderRadius: 8,
    boxShadow: '6px 6px 0 rgba(0,0,0,.2)',
  },
  counter: {
    overflow: 'auto',
    width: 240,
    padding: 16,
    margin: '0 auto',
    textAlign: 'center',
    color: 'white',
    background: 'magenta',
    borderRadius: 8,
    boxShadow: '6px 6px 0 rgba(255,0,255,.2)',
  },
  header: {
    marginTop: 0,
    marginBottom: 16,
    fontSize: '4em',
    fontWeight: 500,
  },
  button: {
    padding: '8px 16px',
    margin: 0,
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
    background: 'white',
    border: 'solid 2px #333',
    borderRadius: 8,
    outline: 'none',
    cursor: 'pointer',
  },
};

export default App;
