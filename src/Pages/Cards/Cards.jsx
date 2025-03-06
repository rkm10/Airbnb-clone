import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Reset loading state when category changes
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, [selectedCategory]);

  const filteredLocations =
    selectedCategory === 'All'
      ? locations
      : locations.filter((location) => location.category === selectedCategory);

  const [currentIndices, setCurrentIndices] = useState(() =>
    filteredLocations.map(() => 0)
  );

  useEffect(() => {
    // Reset carousel indices when category changes
    setCurrentIndices(filteredLocations.map(() => 0));
  }, [filteredLocations]);

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

  return (
    <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
      <Grid container spacing={2} sx={{ padding: 2, paddingX: 5 }}>
        {filteredLocations.map((location, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <ImageCarousel
              location={location}
              currentIndex={currentIndices[index]}
              onPrevious={() => handlePrevious(index)}
              onNext={() => handleNext(index)}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Cards;
