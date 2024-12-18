// ..pages/AdminUserPage.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";
import AdminNavbar from "../components/AdminNavbar";
import { toast } from "react-toastify";

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "user",
    likedEvents: [],
    registeredEvents: [],
  });

  const { theme } = useTheme();

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.post("http://localhost:3000/users");
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  // Open Dialog for Create/Update
  const handleOpen = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        password: "", // Leave password blank for security when updating
        email: user.email,
        role: user.role,
        likedEvents: user.likedEvents,
        registeredEvents: user.registeredEvents,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        username: "",
        password: "",
        email: "",
        role: "user",
        likedEvents: [],
        registeredEvents: [],
      });
    }
    setOpen(true);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  // Handle Create/Update User
  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        // Prepare data for the update
        const updateData = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          likedEvents: formData.likedEvents,
          registeredEvents: formData.registeredEvents,
        };

        // Make PUT request using `username` as the identifier
        await axios.put(
          `http://localhost:3000/users/${selectedUser.username}`, // Use `username` here since it's used in the original version
          updateData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("User updated successfully!");
      } else {
        // Create new user
        await axios.post(
          "http://localhost:3000/users/create",
          {
            username: formData.username,
            password: formData.password, // Include password only for new user creation
            email: formData.email,
            role: formData.role,
            likedEvents: formData.likedEvents,
            registeredEvents: formData.registeredEvents,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("User created successfully!");
      }
      handleClose();
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error(err);
      toast.error("Operation failed. Please try again.");
    }
  };

  // Handle Delete User
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("User deleted successfully!");
        fetchUsers();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete user");
      }
    }
  };

  // Pagination controls
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" ? true : user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" ? true : user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#121212" : "#F5F5F5",
        color: theme === "dark" ? "#FFFFFF" : "#000000",
        minHeight: "100vh",
      }}
    >
      <AdminNavbar />
      <Container sx={{ py: 4 }}>
        <Paper
          sx={{
            p: 3,
            mb: 2,
            backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          <Typography variant="h5" gutterBottom>
            User Management
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme === "dark" ? "#B0B0B0" : "#6C6C6C",
            }}
          >
            Manage users in the system. You can create, update, and delete users, as well as view their roles and email addresses.
          </Typography>
        </Paper>

        <Button
          variant="outlined"
          onClick={() => handleOpen()}
          sx={{
            marginBottom: "20px",
            textTransform: "none",
            fontWeight: 500,
            color: theme === "dark" ? "#FFFFFF" : "#000000",
            borderColor: theme === "dark" ? "#FFFFFF" : "#000000",
            "&:hover": {
              backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0",
            },
          }}
        >
          Create New User
        </Button>

          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <TextField
              label="Search Users"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
              <InputLabel>Role Filter</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role Filter"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </div>

        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0",
                }}
              >
                <TableCell sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}>Username</TableCell>
                <TableCell sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}>Email</TableCell>
                <TableCell sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}>Role</TableCell>
                <TableCell sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      backgroundColor:
                        theme === "dark" ? "#222222" : "#FFFFFF",
                      "&:hover": {
                        backgroundColor:
                          theme === "dark" ? "#333333" : "#F9F9F9",
                      },
                    }}
                  >
                    <TableCell sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}>{user.username}</TableCell>
                    <TableCell sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}>{user.email}</TableCell>
                    <TableCell sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}>{user.role}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpen(user)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            color: theme === "dark" ? "#FFFFFF" : "#000000",
                            borderColor: theme === "dark" ? "#FFFFFF" : "#000000",
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleDelete(user._id)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            color: theme === "dark" ? "#FF6B6B" : "#D32F2F",
                            borderColor: theme === "dark" ? "#FF6B6B" : "#D32F2F",
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0",
              color: theme === "dark" ? "#FFFFFF" : "#000000",
            }}
          />
        </TableContainer>
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedUser ? "Update User" : "Create New User"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            margin="normal"
            disabled={selectedUser ? true : false}
            helperText={
              selectedUser
                ? "Password cannot be changed when updating user"
                : ""
            }
          />
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedUser ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminUserPage;