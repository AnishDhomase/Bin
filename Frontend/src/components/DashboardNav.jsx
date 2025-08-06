import Logo from "../components/Logo";
import Button from "@mui/material/Button";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Link, NavLink, useParams } from "react-router";
import { styled } from "@mui/material";

const StyledNavLink = styled(NavLink)({
  textDecoration: "none",
  "&.active button": {
    color: "#4294FF",
    backgroundColor: "rgba(0, 149, 255, 0.1)",
    borderRight: "5px solid #4294FF",
    borderRadius: "0px",
  },
  "& button": {
    color: "white",
  },
});

const DashboardNav = () => {
  const { username } = useParams();
  return (
    <nav className="sticky top-0 h-screen bg-gray-900 w-1/5 p-8 flex flex-col min-h-screen justify-between">
      <div>
        <NavLink to={`/dashboard/${username}`}>
          <header className="pb-5">
            <span
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Logo noMargin={true} size={40} />
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                Bin
              </span>
            </span>
          </header>
        </NavLink>
        <main className="border-t-2 border-gray-700">
          <h1 className="text-gray-400 pt-5 pb-1 text-md">File Manager</h1>
          <section className="flex flex-col pl-3">
            <StyledNavLink to="favourites">
              <Button
                fullWidth
                variant="text"
                startIcon={
                  <GradeOutlinedIcon
                    sx={{ fontSize: "25px !important" }}
                    color="inherit"
                  />
                }
                sx={{
                  textTransform: "capitalize",
                  display: "flex",
                  justifyContent: "start",
                  fontSize: "18px",
                  color: "white",
                }}
              >
                Favourites
              </Button>
            </StyledNavLink>
            <StyledNavLink to="trash">
              <Button
                fullWidth
                variant="text"
                startIcon={
                  <DeleteOutlinedIcon
                    sx={{ fontSize: "25px !important" }}
                    color="inherit"
                  />
                }
                sx={{
                  textTransform: "capitalize",
                  display: "flex",
                  justifyContent: "start",
                  fontSize: "18px",
                  color: "white",
                }}
              >
                Trash
              </Button>
            </StyledNavLink>
          </section>
        </main>
      </div>

      <footer className="text-white border-t-2 border-gray-700 pt-3">
        <Button
          fullWidth
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            color: "white",
            textTransform: "none",
            borderRadius: "12px", // Add Border Radius here
            backgroundColor: "#4b556356", // Optional: match footer bg for seamless look
            "&:hover": {
              backgroundColor: "#374151", // Darker on hover
            },
          }}
        >
          <span className="h-10 w-10 border-2 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </span>

          <SettingsOutlinedIcon sx={{ fontSize: "30px" }} />
        </Button>
      </footer>
    </nav>
  );
};

export default DashboardNav;
