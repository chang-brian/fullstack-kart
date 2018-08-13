import React, { Component } from 'react';

import './App.css';
import KartList from './KartList';
import Autosuggest from 'react-autosuggest';
import { Button } from 'reactstrap';
import theme from './theme.js';

let items = [];

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : items.filter(item => {
    return item.toLowerCase().slice(0, inputLength) === inputValue;
  });
};

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      suggestions: [],
      value: '',
      kart: {}
    };
  }

  componentDidMount() {
    this.callApiGetSuggestions()
      .then(res => {
        items = res;
      });
    this.callApiGetKart()
      .then(data => this.setState({ kart: data }));
  }

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // Update dictionary and localStorage
  updateKart = () => {
    let kart = this.state.kart;
    let value = this.state.value;
    if (!value) {
      alert('Please enter an item.');
      return;
    }

    if (kart.hasOwnProperty(value)) {
      kart[value] = kart[value] + 1;
      this.setState({
        kart: kart
      });
    } else {
      kart[value] = 1;
      this.setState({
        kart: kart
      });
    }
    localStorage.setItem('kart', JSON.stringify(kart));

    return { [value]: 1 };
  };

  // API call to get suggestions
  callApiGetSuggestions = async () => {
    const res = await fetch('/suggestions');
    const body = await res.json();

    return body;
  };

  // API call to post item in kart
  callApiKartItem = async (KartItems) => {
    fetch('/kartItem', {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(KartItems)
    });
  };

  // Retrieve localStorage to maintain persistence
  // API call to get items in kart
  callApiGetKart = async () => {
    let data = (localStorage.getItem('kart') ? localStorage.getItem('kart') : '{}');
    data = JSON.parse(data);
    // const res = await fetch('/kart');
    // const body = await res.json();
    return data;
  };

  // When the 'Add' button is clicked
  onAdd = async () => {
    let item = await this.updateKart();
    let res = await this.callApiKartItem(item);
    return res;
  };

  // When the 'Submit' button is clicked
  onSubmit = () => {
    let kart = this.state.kart;

    let request = require('request');

    let options = {
      url: 'https://kart.example.com/submit',
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(kart)
    };

    request(options, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        console.log(body);
      } else {
        console.log(err);
      }
    });
  };

  render() {
    const { value, suggestions, kart } = this.state;

    const inputProps = {
      placeholder: 'Enter an item',
      value,
      onChange: this.onChange
    };

    return (
      <div>
        <header className="bg-success p-3">
          <div className="text-white text-center h3">
            FullStack Kart
          </div>
        </header>
        <div className="row mb-5">
          <div className="col-md-2 bg-secondary">
            <div className="text-white h4 pl-4 pt-4">
              Home
            </div>
          </div>
          <div className="col-md-10 bg-light">
            <div className="row mb-5 text-center">
              <div className="col-md-12 my-5">
                <div className="d-inline-block text-left">
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    theme={theme}
                  />
                </div>
                <div className="d-inline-block">
                  <Button className="d-inline-block" color="success" size="lg" onClick={this.onAdd}>Add</Button>
                </div>
              </div>
              <div className="col-md-12">
                <div className="h5 mx-5 mt-5 text-left">
                  MY KART
                </div>
                <div className="list-group mx-5 mb-5 text-left">
                  <KartList KartItems={kart} />
                </div>
                <div className="text-center">
                  <Button color="success" onClick={this.onSubmit}>Submit</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;