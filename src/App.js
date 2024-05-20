import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Slider from '@mui/material/Slider';

const App = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [minPlayers, setMinPlayers] = useState(1);
  const [playingTime, setPlayingTime] = useState([0, 120]);
  const [rating, setRating] = useState(0);
  const [filteredGameNames, setFilteredGameNames] = useState([]);

  useEffect(() => {
    // Fetch game data from static JSON file
    fetch('/games.json')
      .then(response => response.json())
      .then(data => {
        setGames(data);
        setFilteredGames(data);
        setFilteredGameNames(data.map(game => ({ id: game._id, name: game.objectname }))); // Store initial game IDs and names
      })
      .catch(error => {
        console.error('Error fetching games:', error);
      });
  }, []);

  useEffect(() => {
    // Update filtered game names when filteredGames changes
    setFilteredGameNames(filteredGames.map(game => ({ id: game._id, name: game.objectname })));
  }, [filteredGames]);

  useEffect(() => {
    // Filter games when any filter parameter changes
    filterGames(minPlayers, playingTime, rating);
  }, [minPlayers, playingTime, rating]);

  const filterGames = (minPlayers, playingTime, rating) => {
    const filtered = games.filter(game => {
      return game.minplayers >= minPlayers &&
             game.playingtime >= playingTime[0] &&
             game.playingtime <= playingTime[1] &&
             game.rating >= rating;
    });
    setFilteredGames(filtered);
  };

  const handleMinPlayersChange = (event, value) => {
    setMinPlayers(value);
  };

  const handlePlayingTimeChange = (event, value) => {
    setPlayingTime(value);
  };

  const handleRatingChange = (event, value) => {
    setRating(value);
  };

  const columns = [
    { field: 'objectname', headerName: 'Name', width: 200 },
    { field: 'rating', headerName: 'Rating', width: 150 },
    { field: 'minplayers', headerName: 'Min Players', width: 150 },
    { field: 'playingtime', headerName: 'Playing Time', width: 200 },
    { field: 'Themes', headerName: 'Themes', width: 250, sortable: false, renderCell: (params) => (
      <ul style={{ padding: 0, margin: 0 }}>
        {params.value ? params.value.map((theme, index) => (
          <li key={index}>{theme}</li>
        )) : null}
      </ul>
    ) },
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="minPlayersSlider">Min Players:</label>
        <Slider
          id="minPlayersSlider"
          value={minPlayers}
          min={1}
          max={6}
          step={1}
          onChange={handleMinPlayersChange}
          aria-labelledby="min-players-slider"
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="playingTimeSlider">Playing Time:</label>
        <Slider
          id="playingTimeSlider"
          value={playingTime}
          min={0}
          max={120}
          step={5}
          onChange={handlePlayingTimeChange}
          aria-labelledby="playing-time-slider"
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} min`}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="ratingSlider">Rating:</label>
        <Slider
          id="ratingSlider"
          value={rating}
          min={0}
          max={5}
          step={0.1}
          onChange={handleRatingChange}
          aria-labelledby="rating-slider"
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}`}
        />
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredGames}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      <div style={{ marginBottom: '16px', marginTop: '16px' }}>
        <label htmlFor="filteredGamesTextArea">Filtered Game Names:</label>
        <textarea id="filteredGamesTextArea" rows={5} value={filteredGameNames.map(game => game.name).join('\n')} readOnly />
      </div>
    </div>
  );
};

export default App;
