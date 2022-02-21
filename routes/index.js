const express = require("express");
const router = express.Router();
const models = require("../models");
const { User, Course } = models;
var bcrypt = require("bcryptjs");

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
    const users = await User.findAll({
      include: [{ model: Course }],
    });
    res.json({
      users,
    });
    res.status(200).end();
  })
);

// Creates a new user, set the Location header to "/", and return a 201 HTTP status code and no content.

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const errors = [];

    try {
      const user = await User.build(req.body);

      if (!user.firstName) {
        errors.push('Please provide a value for "firstName"');
      }
      if (!user.lastName) {
        errors.push('Please provide a value for "lastName"');
      }
      if (!user.emailAddress) {
        errors.push('Please provide a value for "emailAddress"');
      }
      if (!user.password) {
        errors.push('Please provide a value for "password"');
      }
      if (errors.length > 0) {
        res.status(400).json({ errors });
      } else {
        if (user.password) {
          user.password = bcrypt.hashSync(user.password, 10);
        }
        await user.save();
        res.status(201).location("/").end();
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);

//// **** Course Routes ****** /////
// Returns all courses including  User associated
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

//  Returns corresponding course including  User associated
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
//  Creates a new course
router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    let course;
    const errors = [];

    try {
      course = await Course.build(req.body);

      if (!course.title) {
        errors.push('Please provide a value for "title"');
      }
      if (!course.description) {
        errors.push('Please provide a value for "description"');
      }

      if (errors.length > 0) {
        res.status(400).json({ errors });
      } else {
        if (course) {
          await course.save();
          res
            .status(201)
            .location("/courses/" + course.id)
            .end();
        }
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);
// Updates the corresponding course and return a 204 HTTP status code and no content.
// When an existing course is updated using the /api/courses PUT route the application should include validation to ensure that the following required values are properly submitted in the request body:

//     title
//     description
// If any of these required values are not properly submitted, the application should respond by sending a 400 HTTP status code and validation errors.

router.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    let course;
    const errors = [];

    try {
      course = await Course.findByPk(req.params.id);
      if (!course.title) {
        errors.push('Please provide a value for "title"');
      }
      if (!course.description) {
        errors.push('Please provide a value for "description"');
      }

      if (errors.length > 0) {
        res.status(400).json({ errors });
      } else {
        if (course) {
          await course.update(req.body);
          res.status(204).location("/courses/").end();
        }
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
        res.status(204).location("/courses/").end();
      } else {
        res.status(404).json("Course Not Found");
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);
module.exports = router;
