const User = require("../models/user");
const Job = require("../models/job");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");
const Notification = require("../models/notification");
const auth = require("../middleware/auth");

exports.createJob = async (req, res) => {
  try {
    const { title, description, location } = await req.body;

    const user = await req.user;

    console.log(req);

    const job = new Job({
      title,
      description,
      location,
      recruiter: req.user.id,
      status: "Pending",
    });
    await job.save();

    // Step 2: Notify all Hiring Managers
    const hiringManagers = await User.find({ role: "Hiring_Manager" });

    if (!hiringManagers.length) {
      return res
        .status(400)
        .send("No Hiring Managers available for verification.");
    }

    const notifications = hiringManagers.map((manager) => ({
      user: manager._id,
      message: `New job "${job.title}" created by ${req.user.username} is pending your approval.`,
    }));

    await Notification.insertMany(notifications);

    res.status(201).send({
      message: "Job created successfully and sent for verification.",
      jobId: job._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllJobApplications = async (req, res) => {
  try {
    // Check user role to ensure only Recruiter or Admin can access this endpoint

    // Fetch all jobs with applications
    const jobs = await Job.find({})
      .select("title applications")
      .populate("applications.candidate", "username email") // Populate candidate details
      .sort({ createdAt: -1 });

    // if (!jobs.length) {
    //   return res.status(404).send("No applications found.");
    // }

    // Format response to include job and application details
    const allApplications = jobs.map((job) => ({
      jobId: job._id,
      jobTitle: job.title,
      applications: job.applications.map((app) => ({
        candidateId: app.candidate._id,
        candidateName: app.candidate.username,
        candidateEmail: app.candidate.email,
        applicationStatus: app.status,
        appliedAt: app.appliedAt,
      })),
    }));

    res.status(200).json({
      message: "All applications fetched successfully.",
      allApplications,
    });
  } catch (error) {
    console.error("Error fetching all applications:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.approveCandidateApplication = async (req, res) => {
  try {
    const recruiterId = req.user.id; // Populated by middleware
    const { jobId, candidateId } = req.params;

    // Validate the job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).send("Job not found.");
    }

    // Ensure the logged-in user is the recruiter for this job
    if (job.recruiter.toString() !== recruiterId) {
      return res
        .status(403)
        .send("You are not authorized to approve this application.");
    }

    // Find the candidate's application in the job's applications array
    const application = job.applications.find(
      (app) => app.candidate.toString() === candidateId
    );

    if (!application) {
      return res.status(404).send("Candidate application not found.");
    }

    if (application.status === "Approved") {
      return res
        .status(400)
        .send("This application has already been approved.");
    }

    // Update the application's status to "Approved"
    application.status = "Approved";

    await job.save();

    // Notify all Hiring Managers about the approved candidate
    const hiringManagers = await User.find({ role: "Hiring_Manager" });

    if (!hiringManagers.length) {
      return res
        .status(400)
        .send("No Hiring Managers available for further approval.");
    }

    const notifications = hiringManagers.map((manager) => ({
      user: manager._id,
      message: `Candidate ${application.candidateName} has been approved for the job "${job.title}" by recruiter ${req.user.username}. Please review and approve for hiring.`,
    }));

    await Notification.insertMany(notifications);

    res.status(200).send({
      message: `Candidate ${application.candidateName} has been approved and sent to Hiring Managers for further review.`,
    });
  } catch (error) {
    console.error("Error approving candidate application:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.rejectApplication = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;

    // Find the job by ID
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Check if the user making the request is the recruiter for this job
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        message:
          "You do not have permission to reject applications for this job.",
      });
    }

    // Find the application for the given candidate ID
    const application = job.applications.find(
      (app) => app.candidate.toString() === candidateId
    );

    if (!application) {
      return res
        .status(404)
        .json({ message: "Application for this candidate not found." });
    }

    // Check if the application is already rejected
    if (application.status === "Rejected") {
      return res
        .status(400)
        .json({ message: "This application is already rejected." });
    }

    // Update the application status to "Rejected"
    application.status = "Rejected";

    // Save the job document with updated application status
    await job.save();

    // Send a response
    res.status(200).json({
      message: "Application rejected successfully.",
      application,
    });
  } catch (error) {
    console.error("Error rejecting application:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
