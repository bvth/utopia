import { Button } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import axios from 'axios';
import React, { useState, useEffect, MouseEvent } from 'react';
import './style.css';

interface Country {
  name: string;
  continent: string;
  [k: string]: any;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#e3127e',
    },
    secondary: {
      main: '#000',
    },
  },
});

export default function App() {
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [continentList, setContinentList] = useState<string[]>([]);
  const [selectedContinents, setSelectedContinent] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get('https://api.countries.code-test.utopiamusic.com/all')
      .then((res) => {
        setCountryList(res.data);
        let continentSet = new Set<string>(
          res.data.map((item: Country) => item.continent)
        );
        setContinentList([...continentSet]);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const toggleSelectedContinents = (
    event: MouseEvent<HTMLElement>,
    name: string
  ) => {
    event.preventDefault();
    if (selectedContinents.includes(name))
      setSelectedContinent(selectedContinents.filter((item) => item !== name));
    else setSelectedContinent([...selectedContinents, name]);
  };

  const toggleSelectedCountries = (
    event: MouseEvent<HTMLElement>,
    name: string
  ) => {
    event.preventDefault();
    if (selectedCountries.includes(name))
      setSelectedCountries(selectedCountries.filter((item) => item !== name));
    else setSelectedCountries([...selectedCountries, name]);
  };

  return (
    <ThemeProvider theme={theme}>
      <header>
        <h1>Utopia Country Highlighter</h1>
        <section className="logo">
          <div className="relative-container">
            <img src="https://utopiamusic.com/logo.png" alt="Utopia logo" />
            <div className="green-circle"></div>
          </div>
        </section>
      </header>
      <main>
        <h2>Select region and click on the countries you want to highlight</h2>
        <section className="continent">
          {continentList.length ? (
            continentList.map((item) => (
              <Button
                variant={
                  selectedContinents.includes(item) ? 'contained' : 'outlined'
                }
                color={
                  selectedContinents.includes(item) ? 'primary' : 'secondary'
                }
                key={item}
                onClick={(event: MouseEvent<HTMLElement>) =>
                  toggleSelectedContinents(event, item)
                }
              >
                {item}
              </Button>
            ))
          ) : (
            <h3>No continent was loaded</h3>
          )}
        </section>
        <section className="country">
          {selectedContinents.length ? (
            countryList
              .filter((item) => selectedContinents.includes(item.continent))
              .map((item) => (
                <Button
                  color={
                    selectedCountries.includes(item.name)
                      ? 'primary'
                      : 'secondary'
                  }
                  key={item.name}
                  onClick={(event: MouseEvent<HTMLElement>) =>
                    toggleSelectedCountries(event, item.name)
                  }
                >
                  {item.name}
                </Button>
              ))
          ) : (
            <p className="placeholder-text">
              <b>Please select at least one continent</b>
            </p>
          )}
        </section>
      </main>
    </ThemeProvider>
  );
}
