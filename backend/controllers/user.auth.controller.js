const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");
const Job = require("../models/job");
const Notification = require("../models/notification");

// exports.register = async (req, res) => {
//   const { username, password, email } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = new User({
//     username,
//     password: hashedPassword,
//     email,
//   });

//   await user.save();
//   res.status(201).send("User registered successfully!");
// };

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "Candidate",
    });

    await newUser.save();

    // Generate a token

    const payload = {
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      },
    };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(201)
      .json({ token, newUser, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// exports.login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });

//     if (!user) {
//       res.status(400).json({ error: "User does not exist" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.status(400).json({ error: " Invalid credentials" });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//         username: user.username,
//         role: user.role,
//       },
//     };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     console.log(payload);

//     res.status(200).json({
//       token,
//       user,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: error.message,
//     });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
    // Generate a token
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token, user, message: "Login successful" });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.showNotifications = async (req, res) => {
  try {
    const recruiterId = req.user.id; // `req.user` is populated by the middleware

    // Find notifications for the recruiter
    const notifications = await Notification.find({ user: recruiterId })
      .sort({ createdAt: -1 }) // Sort by latest notifications
      .select("message isRead createdAt"); // Only return necessary fields

    res.status(200).send({
      message: "Notifications fetched successfully.",
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.applyJob = async (req, res) => {
  try {
    const candidateId = req.user.id; // Populated by middleware
    const candidateName = req.user.username; // Populated by middleware
    const { jobId } = req.params;

    console.log(candidateId, candidateName, jobId);

    // Validate the job ID
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).send("Job not found.");
    }

    // Check if the candidate has already applied
    const alreadyApplied = job.applications.some(
      (app) => app.candidate.toString() === candidateId
    );

    if (alreadyApplied) {
      return res.status(400).send("You have already applied for this job.");
    }

    // Add the candidate's application to the job
    job.applications.push({
      candidate: candidateId,
      candidateName,
      appliedAt: new Date(),
    });

    await job.save();

    // Step 2: Notify the recruiter about the new application
    const recruiter = await User.findById(job.recruiter);

    if (!recruiter) {
      return res.status(404).send("Recruiter not found.");
    }

    // Create the notification for the recruiter
    const notification = new Notification({
      user: recruiter._id,
      message: `New application received for job: ${job.title} from candidate ${candidateName}.`,
    });

    await notification.save();

    // Respond with a success message
    res.status(200).send({
      message: `Successfully applied for the job: ${job.title}. The recruiter has been notified.`,
      jobId: job._id,
    });
  } catch (error) {
    console.error("Error applying for job:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const { status, recruiter } = req.query;

    // Build query object based on optional filters
    const query = {};
    if (status) query.status = status;
    if (recruiter) query.recruiter = recruiter;

    // Fetch jobs from the database
    const jobs = await Job.find(query)
      .populate("recruiter", "username email") // Populate recruiter details (if needed)
      .select("-applications") // Exclude applications array for brevity
      .sort({ createdAt: -1 }); // Sort jobs by creation date, most recent first

    if (!jobs.length) {
      return res.status(404).send("No jobs found.");
    }

    res.status(200).json({
      message: "Jobs retrieved successfully.",
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error retrieving jobs:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.getApplicationStatus = async (req, res) => {
  try {
    const candidateId = req.user.id; // Populated by middleware

    // Fetch jobs where the current user has applied
    const jobs = await Job.find({ "applications.candidate": candidateId })
      .select("title status applications")
      .sort({ createdAt: -1 });

    if (!jobs.length) {
      return res.status(404).send("No applications found for this user.");
    }

    // Filter applications for the current user
    const userApplications = jobs.map((job) => {
      const application = job.applications.find(
        (app) => app.candidate.toString() === candidateId
      );

      return {
        jobId: job._id,
        jobTitle: job.title,
        jobStatus: job.status,
        applicationStatus: application ? application.status : "Unknown",
        appliedAt: application ? application.appliedAt : null,
      };
    });

    res.status(200).json({
      message: "Application status retrieved successfully.",
      applications: userApplications,
    });
  } catch (error) {
    console.error("Error retrieving application status:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
