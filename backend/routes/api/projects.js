const express = require('express')
const router  = express.Router()
const Project = require('../../models/Project')

// GET /api/projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.getProjectsForUser(req.user.id)  // your model fn
    res.json(
      projects.map((p) => ({
        id: p._id,
        title: p.title,
        description: p.description,
        ownerId: p.ownerId,
        // …etc
      }))
    );
      
  } catch (err) {
    next(err)
  }
})

// GET /api/projects/:id
router.get('/:id', async (req, res, next) => {
  try {
    const p = await Project.getProjectById(req.params.id)
    res.json({
      id: p._id,
      title: p.title,
      tasks: p.tasks,        // or fetch tasks separately
      members: p.memberIds,
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
