const User = require("../models/user");
const Job = require("../models/job");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");
const Notification = require("../models/notification");
const auth = require("../middleware/auth");

exports.approveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Step 1: Find the job
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).send("Job not found");

    // Step 2: Update job status
    if (job.status === "Approved") {
      return res.status(400).send("Job is already approved.");
    }

    job.status = "Approved";
    await job.save();

    // Step 3: Notify the Recruiter
    const notification = new Notification({
      user: job.recruiter,
      message: `Your job "${job.title}" has been approved by the Hiring Manager.`,
    });
    await notification.save();

    res.send({
      message: "Job approved and is now live on the portal.",
      jobId: job._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.approveCandidateHiring = async (req, res) => {
  try {
    const hiringManagerId = req.user.id; // Populated by middleware
    const { jobId, candidateId } = req.params;

    // Validate the job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).send("Job not found.");
    }

    // Validate if the application exists
    const application = job.applications.find(
      (app) => app.candidate.toString() === candidateId
    );

    if (!application) {
      return res.status(404).send("Candidate application not found.");
    }

    if (application.status !== "Approved") {
      return res
        .status(400)
        .send("Candidate must be approved by recruiter first.");
    }

    if (application.status === "Hired") {
      return res.status(400).send("This candidate has already been hired.");
    }

    // Update the application's final status to "Hired"
    application.status = "Hired";

    await job.save();

    // Notify Admin to change candidate's role to Employee
    const admins = await User.find({ role: "Admin" });

    if (!admins.length) {
      return res
        .status(400)
        .send("No Admin available to change candidate role.");
    }

    const notifications = admins.map((admin) => ({
      user: admin._id,
      message: `Candidate ${application.candidateName} has been approved by Hiring Manager ${req.user.username} for the job "${job.title}". Please update their role to Employee.`,
    }));

    await Notification.insertMany(notifications);

    res.status(200).send({
      message: `Candidate ${application.candidateName} has been approved for hiring and notified Admin to update their role.`,
    });
  } catch (error) {
    console.error("Error approving candidate for hiring:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.pendingJobs = async (req, res) => {
  try {
    // Fetch jobs with a status of "Pending"
    const jobs = await Job.find({ status: "Pending" })
      .populate("recruiter", "username email") // Populate recruiter details (if needed)
      .sort({ createdAt: -1 }); // Sort by most recent

    // if (!jobs.length) {
    //   return res.status(404).send("No pending jobs found for approval.");
    // }

    res.status(200).json({
      message: "Pending jobs retrieved successfully.",
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error retrieving pending jobs:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.getApprovedApplications = async (req, res) => {
  try {
    // Check if the user has appropriate role
    // if (!["Hiring_Manager"].includes(req.user.role)) {
    //   return res
    //     .status(403)
    //     .send("You do not have permission to access this resource.");
    // }

    // Fetch all jobs with approved applications
    const jobs = await Job.find({ "applications.status": "Approved" })
      .select("title applications")
      .populate("applications.candidate", "username email") // Populate candidate details
      .sort({ createdAt: -1 });

    // Format response to include job and approved application details
    const approvedApplications = jobs.map((job) => ({
      jobId: job._id,
      jobTitle: job.title,
      approvedApplications: job.applications
        .filter((app) => app.status === "Approved")
        .map((app) => ({
          candidateId: app.candidate._id,
          candidateName: app.candidate.username,
          candidateEmail: app.candidate.email,
          // candidateStatus: app.,
          approvedAt: app.approvedAt || app.updatedAt, // Assuming there's a field to track approval date
        })),
    }));

    res.status(200).json({
      message: "Approved applications fetched successfully.",
      approvedApplications,
    });
  } catch (error) {
    console.error("Error fetching approved applications:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.rejectJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job by ID
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Check if the job is already rejected
    if (job.status === "Rejected") {
      return res
        .status(400)
        .json({ message: "This job has already been rejected." });
    }

    // Update the job status to "Rejected"
    job.status = "Rejected";

    // Save the job document with the updated status
    await job.save();

    res.status(200).json({
      message: "Job rejected successfully.",
      job,
    });
  } catch (error) {
    console.error("Error rejecting job:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.rejectHiring = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;

    // Fetch the job by ID
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Find the specific application for the candidate
    const application = job.applications.find(
      (app) => app.candidateId === candidateId
    );

    if (!application) {
      return res
        .status(404)
        .json({ message: "Application for this candidate not found." });
    }

    // Check if the application is already rejected
    if (application.status === "Rejected") {
      return res.status(400).json({
        message: "This application is already rejected.",
      });
    }

    // Update the application status to "Rejected"
    application.status = "Rejected";

    // Save the updated job document
    await job.save();

    res.status(200).json({
      message: "Application status updated to 'Rejected'.",
      jobId: job._id,
      jobTitle: job.jobTitle,
      candidateId: application.candidateId,
      candidateName: application.candidateName,
      updatedStatus: application.applicationStatus,
    });
  } catch (error) {
    console.error("Error rejecting application:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
