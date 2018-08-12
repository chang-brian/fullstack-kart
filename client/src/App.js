import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';
import KartList from './KartList';
import Autosuggest from 'react-autosuggest';
import { Button } from 'reactstrap';


const items = require('./items.json');


const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : items.filter(item => {
    return item.toLowerCase().slice(0, inputLength) === inputValue;
  });
}

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
      kart: [],
    }
  }

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue });
  }

  onAdd = () => {
    var value = this.state.value;
    this.state.kart.contains
    this.setState({
      kart: this.state.kart.concat([value])
    });
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

  // componentDidMount() {
    // this.callApi()
    //   .then(res => {this.setState({ suggestions: res })});
  // }

  // callApi = async () => {
  //   const response = await fetch('/suggestions');
  //   const body = await response.json();

  //   if (response.status !== 200) throw Error(body.message);
  //   console.log(body);
  //   return body;
  // };


  render() {
    // const filteredSuggestions = this.state.suggestions.filter(suggestion => {
    //   return suggestion.toLowerCase().includes(this.state.value.toLowerCase());
    // })
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