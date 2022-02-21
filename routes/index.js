const express = require("express");
const router = express.Router();
const models = require("../models");
const { User, Course } = models;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/* GET courses listing. */
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
    console.log(courses.map((course) => course.get({ plain: true })));

    // const courses = await Course.findAll();
    // res.json({
    //   courses,
    // });
  })
);

/* GET courses listing. */
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json({
      users,
    });
  })
);

// Create the following routes:

//     A /api/users GET route that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.
//     A /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.

// Create the following routes:

//     A /api/courses GET route that will return all courses including the User associated with each course and a 200 HTTP status code.
//     A /api/courses/:id GET route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
//     A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
//     A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
//     A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.

module.exports = router;
