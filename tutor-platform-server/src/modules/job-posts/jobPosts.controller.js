const { query } = require("../../db/query");
const HttpError = require("../../utils/httpError");
const {
  createJobPostSchema,
  applyToJobSchema,
} = require("./jobPosts.validators");

async function createJobPost(req, res, next) {
  try {
    const data = createJobPostSchema.parse(req.body);
    const familyId = req.user.id;

    const result = await query(
      `INSERT INTO tutor_job_posts
      (family_id, title, description, student_name, grade, curriculum, subject, location_note, session_type, days_per_week, hours_per_day, budget, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      [
        familyId,
        data.title,
        data.description || null,
        data.student_name,
        data.grade,
        data.curriculum,
        data.subject || null,
        data.location_note || null,
        data.session_type,
        data.days_per_week,
        data.hours_per_day,
        data.budget ?? null,
      ],
    );

    res.status(201).json({
      success: true,
      jobPostId: result.insertId,
      status: "OPEN",
      message: "Job post created successfully",
    });
  } catch (e) {
    if (e?.name === "ZodError") {
      return next(new HttpError(400, "Validation error", e.issues || e.errors));
    }
    next(e);
  }
}

async function listMyJobPosts(req, res, next) {
  try {
    const familyId = req.user.id;

    const rows = await query(
      `SELECT *
       FROM tutor_job_posts
       WHERE family_id = ?
       ORDER BY id DESC`,
      [familyId],
    );

    res.json({
      success: true,
      count: rows.length,
      job_posts: rows,
    });
  } catch (e) {
    next(e);
  }
}

async function listOpenJobPostsForTutors(req, res, next) {
  try {
    const rows = await query(
      `SELECT
         jp.id,
         jp.title,
         jp.description,
         jp.student_name,
         jp.grade,
         jp.curriculum,
         jp.subject,
         jp.location_note,
         jp.session_type,
         jp.days_per_week,
         jp.hours_per_day,
         jp.budget,
         jp.status,
         jp.created_at
       FROM tutor_job_posts jp
       INNER JOIN users f ON f.id = jp.family_id
       WHERE jp.status = 'OPEN'
       ORDER BY jp.id DESC`,
    );

    res.json({
      success: true,
      count: rows.length,
      job_posts: rows,
    });
  } catch (e) {
    next(e);
  }
}

async function applyToJobPost(req, res, next) {
  try {
    const tutorId = req.user.id;
    const jobPostId = Number(req.params.id);

    if (!Number.isInteger(jobPostId) || jobPostId <= 0) {
      throw new HttpError(400, "Invalid job post id");
    }

    const data = applyToJobSchema.parse(req.body);

    // 1. Check tutor profile exists, approved, available
    const tutorRows = await query(
      `SELECT tutor_id, status, is_available
       FROM tutor_profiles
       WHERE tutor_id = ?`,
      [tutorId],
    );

    if (tutorRows.length === 0) {
      throw new HttpError(404, "Tutor profile not found");
    }

    const tutor = tutorRows[0];

    if (tutor.status !== "APPROVED") {
      throw new HttpError(403, "Only approved tutors can apply to jobs");
    }

    if (!tutor.is_available) {
      throw new HttpError(403, "Inactive tutors cannot apply to jobs");
    }

    // 2. Check job exists and is open
    const jobRows = await query(
      `SELECT id, status
       FROM tutor_job_posts
       WHERE id = ?`,
      [jobPostId],
    );

    if (jobRows.length === 0) {
      throw new HttpError(404, "Job post not found");
    }

    if (jobRows[0].status !== "OPEN") {
      throw new HttpError(400, "This job is not open for applications");
    }

    // 3. Check duplicate application
    const existing = await query(
      `SELECT id
       FROM tutor_job_applications
       WHERE job_post_id = ? AND tutor_id = ?`,
      [jobPostId, tutorId],
    );

    if (existing.length > 0) {
      throw new HttpError(409, "You already applied to this job");
    }

    // 4. Create application
    const result = await query(
      `INSERT INTO tutor_job_applications
      (job_post_id, tutor_id, message, proposed_rate, status)
      VALUES (?, ?, ?, ?, 'APPLIED')`,
      [jobPostId, tutorId, data.message || null, data.proposed_rate ?? null],
    );

    res.status(201).json({
      success: true,
      applicationId: result.insertId,
      status: "APPLIED",
      message: "Applied to job successfully",
    });
  } catch (e) {
    if (e?.name === "ZodError") {
      return next(new HttpError(400, "Validation error", e.issues || e.errors));
    }
    next(e);
  }
}

async function listApplicationsForMyJob(req, res, next) {
  try {
    const familyId = req.user.id;
    const jobPostId = Number(req.params.id);

    if (!Number.isInteger(jobPostId) || jobPostId <= 0) {
      throw new HttpError(400, "Invalid job post id");
    }

    // confirm family owns this job
    const jobRows = await query(
      `SELECT id
       FROM tutor_job_posts
       WHERE id = ? AND family_id = ?`,
      [jobPostId, familyId],
    );

    if (jobRows.length === 0) {
      throw new HttpError(404, "Job post not found");
    }

    const rows = await query(
      `SELECT
         a.id,
         a.job_post_id,
         a.tutor_id,
         a.message,
         a.proposed_rate,
         a.status,
         a.created_at,
         u.full_name,
         u.email,
         u.phone,
         tp.bio,
         tp.location_city,
         tp.location_area,
         tp.education,
         tp.experience_years,
         tp.hourly_rate,
         tp.is_available
       FROM tutor_job_applications a
       INNER JOIN users u ON u.id = a.tutor_id
       INNER JOIN tutor_profiles tp ON tp.tutor_id = a.tutor_id
       WHERE a.job_post_id = ?
       ORDER BY a.id DESC`,
      [jobPostId],
    );

    res.json({
      success: true,
      count: rows.length,
      applications: rows,
    });
  } catch (e) {
    next(e);
  }
}

async function selectTutorApplication(req, res, next) {
  try {
    const familyId = req.user.id;
    const jobId = Number(req.params.jobId);
    const applicationId = Number(req.params.applicationId);

    if (!Number.isInteger(jobId) || jobId <= 0) {
      throw new HttpError(400, "Invalid job id");
    }

    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      throw new HttpError(400, "Invalid application id");
    }

    const jobRows = await query(
      `SELECT id, status
       FROM tutor_job_posts
       WHERE id = ? AND family_id = ?`,
      [jobId, familyId],
    );

    if (jobRows.length === 0) {
      throw new HttpError(404, "Job post not found");
    }

    if (jobRows[0].status !== "OPEN") {
      throw new HttpError(400, "Only open jobs can select a tutor");
    }

    const appRows = await query(
      `SELECT id, tutor_id, job_post_id
       FROM tutor_job_applications
       WHERE id = ? AND job_post_id = ?`,
      [applicationId, jobId],
    );

    if (appRows.length === 0) {
      throw new HttpError(404, "Application not found");
    }

    const selectedTutorId = appRows[0].tutor_id;

    // mark selected app accepted
    await query(
      `UPDATE tutor_job_applications
       SET status = 'ACCEPTED'
       WHERE id = ?`,
      [applicationId],
    );

    // reject others
    await query(
      `UPDATE tutor_job_applications
       SET status = 'REJECTED'
       WHERE job_post_id = ? AND id <> ?`,
      [jobId, applicationId],
    );

    // update job post
    await query(
      `UPDATE tutor_job_posts
       SET status = 'FULFILLED',
           selected_tutor_id = ?
       WHERE id = ?`,
      [selectedTutorId, jobId],
    );

    res.json({
      success: true,
      message: "Tutor selected successfully",
      selected_tutor_id: selectedTutorId,
      job_status: "FULFILLED",
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createJobPost,
  listMyJobPosts,
  listOpenJobPostsForTutors,
  applyToJobPost,
  listApplicationsForMyJob,
  selectTutorApplication,
};
