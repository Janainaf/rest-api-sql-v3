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

// A /api/users GET route that will return all properties and values
//for the currently authenticated User along with a 200 HTTP status code.

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json({
      users,
    });
    res.status(200).end();
  })
);

//     A /api/users POST route that will create a new user,
// set the Location header to "/", and return a 201 HTTP status code and no content.

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    let user;
    try {
      user = await User.create(req.body);
      res.status(200);
      res.redirect("/");
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);

//// **** Course Routes ****** /////
// A /api/courses GET route returns all courses including  User associated
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [{ model: User }],
    });
    res.json(courses.map((course) => course.get({ plain: true })));
    res.status(200).end();
  })
);

//   A /api/courses/:id GET route returns corresponding course including  User associated
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id, {
        include: [{ model: User }],
      });
      if (course) {
        res.json({
          course,
        });
        res.status(200).end();
      } else {
        res.json(404 + " Not Found");
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);
//  Creates a new course, set the Location header to the URI for the newly created course,
//  and return a 201 HTTP status code and no content.
router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    let course;
    try {
      course = await Course.create(req.body);
      res.status(201);
      res.redirect("/courses/" + course.id);
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);
// Updates the corresponding course and return a 204 HTTP status code and no content.

router.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    let course;
    try {
      course = await Course.findByPk(req.params.id);
      if (course) {
        await course.update(req.body);
        res.status(204);
        res.redirect("/courses");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);

//     A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
router.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (course) {
        await course.destroy();
        res.redirect("/courses");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);
module.exports = router;
