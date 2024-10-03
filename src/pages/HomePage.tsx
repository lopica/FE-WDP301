import React from "react";
import Footer from "../components/Footer";
import WEARIT from "../assets/WEARIT.svg";
import BannerImage from "../assets/vn-11134210-7r98o-ltza79e2ahwf46.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  Link,
  IconButton,
} from "@mui/material";

const HomePage = () => {
  const products = [
    { name: "T-shirt", price: "$20", image: "https://via.placeholder.com/150" },
    { name: "Jeans", price: "$40", image: "https://via.placeholder.com/150" },
    { name: "Jacket", price: "$60", image: "https://via.placeholder.com/150" },
    { name: "Jacket", price: "$60", image: "https://via.placeholder.com/150" },
  ];

  return (
    <div>
      <AppBar position="fixed" sx={{ backgroundColor: "#BEBEBE" }}>
        <Toolbar sx={{ minHeight: 20 }}>
          <img
            src={WEARIT}
            alt="Logo"
            style={{ marginRight: "16px", height: "80px" }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button sx={{ color: "black" }}>Đăng nhập</Button>
          <span style={{ color: "black" }}>|</span>
          <Button sx={{ color: "black" }}>Đăng kí</Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          py: 10,
          backgroundColor: "white",
          textAlign: "center",
          marginTop: "0px",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mx: 4, borderRight: { md: "2px solid", xs: "none" } }}>
              <Typography color="textSecondary">Download the app</Typography>
              <Typography fontWeight="bold">
                Get an exclusive $5 off code
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ mx: 4, borderRight: { md: "2px solid", xs: "none" } }}>
              <Typography color="textSecondary">
                Return when you're ready
              </Typography>
              <Typography fontWeight="bold">60 days of free returns</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ mx: 4 }}>
              <Typography color="textSecondary">
                Sign up for our newsletter
              </Typography>
              <Typography fontWeight="bold">
                15% off your first order
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: -6 }}>
        <Box
          sx={{
            position: "relative",
            height: "350px",
            width: "100%",
            backgroundImage: `url(${BannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "top center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              marginTop: "200px",
            }}
          >
            Shop Now
          </Button>
        </Box>
      </Box>
      <Container sx={{ marginTop: 3, position: "flex" }}>
        <Typography
          sx={{ marginTop: 3, fontWeight: "bold" }}
          variant="h4"
          component="h2"
          gutterBottom
        >
          Welcome to Hola Wear!
        </Typography>
        <Typography
          sx={{
            marginTop: 3,
            textAlign: "left",
            fontSize: "25px",
            fontWeight: "bold",
          }}
          gutterBottom
        >
          Sản phẩm hot
        </Typography>

        {/* Product Grid */}
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  alt={product.name}
                  height="180"
                  image={product.image}
                />
                <CardContent sx={{ textAlign: "left" }}>
                  <Typography variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Add to Cart</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography
          sx={{
            marginTop: 8,
            textAlign: "left",
            fontSize: "25px",
            fontWeight: "bold",
          }}
          gutterBottom
        >
          Sản phẩm mới về
        </Typography>

        {/* Product Grid */}
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  alt={product.name}
                  height="180"
                  image={product.image}
                />
                <CardContent sx={{ textAlign: "left" }}>
                  <Typography variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Add to Cart</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default HomePage;
