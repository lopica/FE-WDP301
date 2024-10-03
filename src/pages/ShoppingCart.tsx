import { Start } from "@mui/icons-material";
import {
  Container,
  Typography,
  Grid,
  Checkbox,
  Button,
  Input,
  Box,
} from "@mui/material";

const ShoppingCart = () => {
  const shippingRate = 35000;
  const subtotal = "10,000,000";
  const total = "10,035,000";

  const products = [
    {
      productId: "123",
      thumbnail: "https://via.placeholder.com/150",
      productTitle: "Product 1",
      color: "#FF0000",
      size: "L",
      price: 1000000,
      quantity: 2,
    },
    {
      productId: "456",
      thumbnail: "https://via.placeholder.com/150",
      productTitle: "Product 2",
      color: "#0000FF",
      size: "M",
      price: 500000,
      quantity: 1,
    },
  ];

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" fontWeight="bold" paddingRight="930px">
        Shopping Cart
      </Typography>

      <Box sx={{ mt: 6 }}>
        <Grid
          container
          spacing={2}
          sx={{ mb: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.2)", pb: 2 }} // Sử dụng màu sắc nhạt cho đường kẻ
        >
          <Grid item xs={1}>
            Select
          </Grid>
          <Grid item xs={2}>
            Image
          </Grid>
          <Grid item xs={2}>
            Product
          </Grid>
          <Grid item xs={1}>
            Color
          </Grid>
          <Grid item xs={1}>
            Size
          </Grid>
          <Grid item xs={2}>
            Price
          </Grid>
          <Grid item xs={1}>
            Quantity
          </Grid>
          <Grid item xs={1}>
            Remove
          </Grid>
          <Grid item xs={1} textAlign="right">
            Total
          </Grid>
        </Grid>

        {products.map((product) => (
          <Grid
            container
            spacing={1}
            sx={{ mb: 4, borderBottom: "1px solid rgba(0, 0, 0, 0.2)", pb: 2 }}
            key={`${product.productId}-${product.size}`}
          >
            <Grid item xs={1}>
              <Checkbox />
            </Grid>
            <Grid item xs={2}>
              <img
                src={product.thumbnail}
                alt={product.productTitle}
                width="25%"
              />
            </Grid>
            <Grid item xs={2}>
              <Typography fontWeight="bold">
                {product.productTitle || "Product Title"}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: product.color,
                }}
              />
            </Grid>
            <Grid item xs={1}>
              {product.size}
            </Grid>
            <Grid item xs={2}>
              {product.price.toLocaleString("en-US")}
            </Grid>
            <Grid item xs={1}>
              <Input
                type="number"
                value={product.quantity}
                min="1"
                sx={{ width: 60 }}
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="outlined"
                style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  marginTop: "4px",
                  color: "black",
                }}
              >
                Remove
              </Button>
            </Grid>

            <Grid item xs={1} textAlign="right">
              {(product.price * product.quantity).toLocaleString("en-US")}
            </Grid>
          </Grid>
        ))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 6,
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "400px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid rgba(0, 0, 0, 0.2)",
                pt: 2,
              }}
            >
              <Typography>Subtotal</Typography>
              <Typography>{subtotal}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography>Shipping</Typography>
              <Typography>{shippingRate.toLocaleString("en-US")}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                borderTop: "1px solid rgba(0, 0, 0, 0.2)",
                pt: 4,
              }}
            >
              <Typography>Grand Total</Typography>
              <Typography>{total}</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 4, backgroundColor: "black" }}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ShoppingCart;
