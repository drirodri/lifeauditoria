import { Toolbar, AppBar, Typography } from "@mui/material";
import CalendarApp from "../../components/Calendar";

function Home() {
  return (
    <div style={{ display: "flex" }}>
      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: 24 }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap>
              Life, Vida na Sua Casa
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <CalendarApp />
      </div>
    </div>
  );
}

export default Home;
