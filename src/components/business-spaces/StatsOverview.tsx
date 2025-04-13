"use client";

import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { Business, 
  // ShoppingBag, VerifiedUser, Warning 
} from "@mui/icons-material";
import { store } from "../store/store";
import { Provider, useSelector } from "react-redux";
import { RootState } from "../store/store";

export function StatsOverview() {
  return (
    <Provider store={store}>
      <StatsOverviews />
    </Provider>
  );
}

export function StatsOverviews() {
  const businessSpace = useSelector((state: RootState) => state.businessSpace);
  
  const stats = [
    {
      title: "Total Business Spaces",
      value: businessSpace.businessSpaces.length,
      icon: Business,
      description: "Active business spaces",
    }
    // ,
    // {
    //   title: "Total Products",
    //   value: "12.5K",
    //   icon: ShoppingBag,
    //   description: "Across all spaces",
    // },
    // {
    //   title: "Verified Spaces",
    //   value: "1,892",
    //   icon: VerifiedUser,
    //   description: "Fully verified",
    // },
    // {
    //   title: "Pending Verifications",
    //   value: "453",
    //   icon: Warning,
    //   description: "Awaiting verification",
    // },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }} display="none">
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.title}
                </Typography>
                <stat.icon sx={{ color: 'text.secondary' }} />
              </Box>
              <Typography variant="h4" component="div">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}