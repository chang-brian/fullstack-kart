import React, { Component } from 'react';

import './App.css';
import KartList from './KartList';
import Autosuggest from 'react-autosuggest';
import { Button } from 'reactstrap';

// I noticed that this works as well. Would this be a better option
// if I am not changing the list of suggestions?
// const items = require('./items.json');

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

  // When the 'Add' button is clicked
  onAdd = async () => {
    let addedItem = await this.updateKart();
    let res = await this.callApiKartItem(addedItem);
    return res;
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

  // API call to post item in kart
  callApiKartItem = (KartItems) => {
    fetch('/kartItem', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
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

  // API call to get suggestions
  callApiGetSuggestions = async () => {
    const response = await fetch('/suggestions');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    const { value, suggestions, kart } = this.state;

    const inputProps = {
      placeholder: 'Type an item',
      value,
      onChange: this.onChange
    };

    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        <Button color="success" onClick={this.onAdd}>Add</Button>
        <KartList KartItems={kart} />
      </div>
    );
  }
}

export default App;