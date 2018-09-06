const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load profile validation
const validateProfileInput = require('../../Validation/profile');

// Load experience validation
const validateExperienceInput = require('../../Validation/experience');

// Load education validation
const validateEducationInput = require('../../Validation/education');

// Load Profile model
const Profile = require('../../models/Profile');
// Load User Profile
const User = require('../../models/User');

//@route   GET api/profile/test
//@desc    Tests Profiles route
//@access  Public
router.get('/test', (req, res) => res.json({ message: 'Profile Work' }));

//@route   GET api/profile
//@desc    Get current user profile
//@access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = `${
            req.user.name
          }, There is no profile for this user`;
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route   Get api/profile/all
//@desc    Get all profiles
//@access  Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There is no profiles';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err =>
      res
        .status(404)
        .json({ noprofile: 'There is no profile for this user 1909' })
    );
});

//@route   Get api/profile/handle/:handle
//@desc    Get Profile by handle
//@access  Public

router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//@route   Get api/profile/user/:user_id
//@desc    Get Profile by user ID
//@access  Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res
        .status(404)
        .json({ noprofile: 'There is no profile for this user 1909' })
    );
});

//@route   Post api/profile
//@desc    Create and Update user profile
//@access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Validate Profile fields
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle.toLowerCase(); // findMe lower Case
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      } else {
        // Create
        // Check handle
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'This handle already exists';
          }
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

//@route   Post api/profile/experience
//@desc    Add experience to profile
//@access  Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // check experience validation
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      // Add to exp array
      profile.experience.unshift(newExp);

      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

//@route   Post api/profile/education
//@desc    Add education to profile
//@access  Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // check education validation
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

//@route   DELETE api/profile/experience/:exp_id
//@desc    Delete experience from profile
//@access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        if (removeIndex !== -1) {
          // Splice out of array
          profile.experience.splice(removeIndex, 1);

          // Save
          profile.save().then(profile => res.json(profile));
        } else {
          // indexOf has returned -1
          return res.json({
            experience: 'unable to delete, data does not exist'
          });
        }
      })
      .catch(err => res.json(err));
  }
);

//@route   DELETE api/profile/education/:edu_id
//@desc    Delete education from profile
//@access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        if (removeIndex !== -1) {
          // Splice out of array
          profile.education.splice(removeIndex, 1);

          // Save
          profile.save().then(profile => res.json(profile));
        } else {
          // indexOf has returned -1
          return res.json({
            education: 'unable to delete, data does not exist'
          });
        }
      })
      .catch(err => res.json(err));
  }
);

//@route   DELETE api/profile
//@desc    Delete profile and user
//@access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;