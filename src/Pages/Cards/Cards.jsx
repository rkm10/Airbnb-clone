import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Skeleton,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';
import { locations } from '../../data/mockdata';
import { useNavigate } from 'react-router-dom';

const ImageCarousel = ({ location, currentIndex, onPrevious, onNext, loading }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleView = () => {
    navigate('/viewdetails', { state: { location } });
  };

  return (
    <Card elevation={2}>
      <CardActionArea disableRipple>
        {loading ? (
          <Skeleton variant="rectangular" height={260} />
        ) : (
          <CardMedia
            component="img"
            height="260px"
            image={location.locationImages[currentIndex]?.url}
            alt={location.location}
            onClick={handleView}
          />
        )}
        <FavoriteBorderIcon
          sx={{
            position: 'absolute',
            top: theme.spacing(1),
            right: theme.spacing(1),
            color: theme.palette.error.main,
          }}
        />
        <KeyboardArrowLeftIcon
          sx={{ position: 'absolute', bottom: '60%', left: theme.spacing(1), cursor: 'pointer' }}
          onClick={onPrevious}
        />
        <KeyboardArrowRightIcon
          sx={{ position: 'absolute', bottom: '60%', right: theme.spacing(1), cursor: 'pointer' }}
          onClick={onNext}
        />
        <CardContent>
          {loading ? (
            <>
              <Skeleton width="80%" />
              <Skeleton width="60%" />
              <Skeleton width="40%" />
            </>
          ) : (
            <>
              <Typography variant="body1">{location.location}</Typography>
              <Typography variant="body1" color="text.secondary">{location.days}</Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {location.price}
              </Typography>
              <Typography variant="body1">{location.rating}*</Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const Cards = ({ selectedCategory }) => {
  // State to track if we're loading the data initially
  const [initialLoading, setInitialLoading] = useState(true);
  // State to track if we're just changing categories
  const [categoryChanging, setCategoryChanging] = useState(false);
  // Cache for the loaded data
  const [cachedLocations, setCachedLocations] = useState(null);

  // Simulate initial data loading - this would be an API call in a real app
  useEffect(() => {
    if (!cachedLocations) {
      const loadData = setTimeout(() => {
        setCachedLocations(locations);
        setInitialLoading(false);
      }, 2000);
      
      return () => clearTimeout(loadData);
    }
  }, [cachedLocations]);

  // Handle category changes with minimal loading state
  useEffect(() => {
    if (cachedLocations) {
      setCategoryChanging(true);
      const categoryChangeTimeout = setTimeout(() => {
        setCategoryChanging(false);
      }, 300); // Much shorter loading time for filtering cached data
      
      return () => clearTimeout(categoryChangeTimeout);
    }
  }, [selectedCategory, cachedLocations]);

  // Use memoized filtering to avoid unnecessary re-computation
  const filteredLocations = useMemo(() => {
    if (!cachedLocations) return [];
    
    return selectedCategory === 'All'
      ? cachedLocations
      : cachedLocations.filter((location) => location.category === selectedCategory);
  }, [selectedCategory, cachedLocations]);

  // Track carousel indices
  const [currentIndices, setCurrentIndices] = useState([]);

  // Reset carousel indices when filtered locations change
  useEffect(() => {
    if (filteredLocations.length > 0) {
      setCurrentIndices(new Array(filteredLocations.length).fill(0));
    }
  }, [filteredLocations.length]);

  const handlePrevious = (index) => {
    setCurrentIndices((prevIndices) => {
      const newIndices = [...prevIndices];
      const totalImages = filteredLocations[index]?.locationImages.length || 1;
      newIndices[index] = (newIndices[index] - 1 + totalImages) % totalImages;
      return newIndices;
    });
  };

  const handleNext = (index) => {
    setCurrentIndices((prevIndices) => {
      const newIndices = [...prevIndices];
      const totalImages = filteredLocations[index]?.locationImages.length || 1;
      newIndices[index] = (newIndices[index] + 1) % totalImages;
      return newIndices;
    });
  };

  // Determine if we should show loading state
  const isLoading = initialLoading || categoryChanging;

  return (
    <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
      <Grid container spacing={2} sx={{ padding: 2, paddingX: 5 }}>
        {filteredLocations.map((location, index) => (
          <Grid item key={location.id || index} xs={12} sm={6} md={4} lg={3}>
            <ImageCarousel
              location={location}
              currentIndex={currentIndices[index] || 0}
              onPrevious={() => handlePrevious(index)}
              onNext={() => handleNext(index)}
              loading={isLoading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Cards;