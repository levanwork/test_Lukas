import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Stack,
  TextField,
} from '@mui/material';

import { searchSpaces } from './service/search';
import Loader from './loader';
import useDebounce from './hook/useDebounce';

import type { Space } from './service/search';
import './app.css';

const CustomSearch = () => {

  const [search, setSearch] = useState('');
  const [data, setData] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedValue = useDebounce<string>(search, 1500);
  let map = new WeakMap();
  let index = 0;

  const weakKey = (data: Space) => {
    var key = map.get(data);
    if (!key) {
      key = 'weak-key-' + index++;
      map.set(data, key);  
    }
    return key;
  }
  
  useEffect(() => {
    searchSpaces(debouncedValue)
      .then((data) => {
        setError('');
        setTimeout(() => {
          setData(data);
          setLoading(false);
        }, 500)
      })
      .catch(e => setError(e.message));
  }, [debouncedValue]);

  return (
    <div className="wrapper-challenge">
      <Grid container spacing={0} className="container-challenge" display="flex" justifyContent="center">
        <Grid item xs={4} sm={4}>
          <Stack
            direction="row"
            sx={{
              width: 250,
              margin: 1,
              backgroundColor: '#ffffff',
              borderRadius: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 1,
            }}
          >
            <TextField
              label="SEARCH"
              variant="outlined"
              size='small'
              style={{
                backgroundColor: '#ffffff',
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setLoading(true);
              }}
              InputProps={{
                type: 'search',
                style: {
                  color: '#1876d2',
                },
              }}
            />
          </Stack>
        </Grid>
        <Grid item xs={2} sm={2}>
          {error && (
            <Box>`{error} something went wrong`</Box>
          )}
        </Grid>
      </Grid>
      <Grid container spacing={0} className="container-list" display="flex" justifyContent="center">
        <Grid item xs={12} sm={12}>
          {loading ? (
            <Loader/>
          ) : data.map((item) => (
            <Box key={weakKey(item)} m={1}>
              {item.name}
            </Box>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

export default CustomSearch;
