const User = require("../models/user");

exports.getAllUsersByRoles = async (req, res) => {
  try {
    // Fetch users excluding Admin
    const users = await User.find({ role: { $nin: ["Admin"] } })
      .select("username email role createdAt")
      .sort({ role: 1, createdAt: -1 });

    if (!users.length) {
      return res.status(404).send("No users found.");
    }

    // Group users by role
    const groupedUsers = users.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push({
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      });
      return acc;
    }, {});

    res.status(200).json({
      message: "Users fetched successfully.",
      users: groupedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    console.log(req.body);

    // Validate the new role
    const validRoles = ["Employee", "Recruiter", "Hiring_Manager", "Candidate"];
    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .send(
          "Invalid role. Allowed roles are: Employee, Recruiter, Hiring_Manager, Candidate."
        );
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Prevent changing the role of another admin
    if (user.role === "Admin") {
      return res.status(400).send("Cannot change the role of an admin.");
    }

    // Update the user's role
    user.role = role;
    await user.save();

    res.status(200).send({
      message: `User role updated successfully to ${role}.`,
      userId: user._id,
      username: user.username,
      updatedRole: user.role,
    });
  } catch (error) {
    console.error("Error changing user role:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
