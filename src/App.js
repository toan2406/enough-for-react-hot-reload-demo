import React, { Component } from 'react';
import './App.css';

const createProxy = InitialComponent => {
  let CurrentComponent = null;
  let ProxyComponent = null;

  const instantiate = (Component, context, params) => {
    const instance = new Component(...params);
    Object.keys(instance).forEach(key => {
      context[key] = instance[key];
    });
  };

  const update = NextComponent => {
    let nextPrototype = NextComponent.prototype;
    // let proxyPrototype = Object.create(NextComponent.prototype);

    // CurrentComponent = NextComponent;
    ProxyComponent = function(...args) {
      instantiate(NextComponent, this, args);
    };

    // Object.getOwnPropertyNames(nextPrototype).forEach(key => {
    // proxyPrototype[key] = function(...args) {
    // return CurrentComponent.prototype[key].apply(this, args);
    // };
    // });

    ProxyComponent.prototype = Object.create(NextComponent.prototype);
    window.ProxyComponent = ProxyComponent;
    // ProxyComponent.prototype.constructor = NextComponent;
  };

  const get = () => ProxyComponent;

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
    console.log('Counter1');
    this.setState(({ count }) => ({
      count: ++count,
    }));
  }

  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.handleClick.bind(this)}>Increare 1</button>
      </div>
    );
  }
}

class Counter3 extends Component {
  state = {
    count: 0,
  };

  handleClick() {
    console.log('Counter3');
    this.setState(({ count }) => ({
      count: count + 3,
    }));
  }

  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.handleClick.bind(this)}>Increare 3</button>
      </div>
    );
  }
}

const counterProxy = createProxy(Counter1);
const Counter = counterProxy.get();

class App extends Component {
  componentDidMount() {
    console.log('===');
    console.log(window.instance);
    console.log(Counter1.prototype);
    console.log(Counter.prototype);
    const counterInstance = new Counter1();
    console.log(counterInstance);
  }

  handleClick = () => {
    // counterProxy.update(Counter3);
    Counter.prototype.handleClick = () => {
      console.log('lol');
    };
  };

  render() {
    return (
      <div className="App">
        <Counter ref={node => (window.instance = node)} />
        <button onClick={this.handleClick}>Load new counter</button>
      </div>
    );
  }
}

export default App;
