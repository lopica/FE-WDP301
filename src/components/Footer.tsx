import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "gray.800",
        color: "white",
        py: 4,
        mt: 5,
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              We are a leading online clothing store providing the latest trends
              and styles.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="#" color="inherit" underline="hover">
              Home
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Products
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              About
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Contact
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <IconButton color="inherit" aria-label="facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="instagram">
              <InstagramIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} WearIt. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
