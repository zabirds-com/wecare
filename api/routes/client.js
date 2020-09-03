const express = require("express");
const router = express.Router();
const Client = require("../db/models/Client");
const Policy = require("../db/models/Policy");
const Benefit = require("../db/models/Benefit");
const Card = require("../db/models/Card");
const authorize = require("../utils/authorize.js");
const upload = require("../multer/multer");

// convert callback `save` function to promise based
function save(doc) {
  return new Promise((resolve, reject) => {
    doc.save((err, saved) => {
      if (err) {
        reject(err);
      }
      // reject(err);
      resolve(saved);
    });
  });
}
async function saveAll(cards) {
  const promises = cards.map(card => save(card));
  const responses = await Promise.all(promises);

  return responses;
}
// function deletCards(items, clientID) {
//   if (items.length) {
//     let _Objectids = [];
//     items.map(item => _Objectids.push(item._id));
//     Client.findById(clientID, { $pullAll: { cards: _Objectids } })
//       .then(policy => {})
//       .catch(err => {
//         console.error("Failed to Delete Images.", err);
//       });
//   }
// }
router.get("/", authorize, (req, res) => {
  let key = '';
  if (req.query.key) {
    key = req.query.key;
  }

  Client.find({ $and: [{ createdBy: req.currentUser._id, del: false }, { "$or": [{ nricName: new RegExp(key, 'i') }, { preferredName: new RegExp(key, 'i') }] }] })
    .exec()
    .then(users => {
      return res.json(users);
    })
    .catch(err => {
      console.error("client.js: failed to lookup clients", err);
      return res.status(500).json({
        error: err
      });
    });
});

router.get("/:id", (req, res) => {
  Client.findById(req.params.id)
    .exec()
    .then(user => {
      return res.json(user);
    })
    .catch(err => {
      console.error("client.js: failed to lookup client by ID", err);
      return res.status(500).json({
        error: err
      });
    });
});

router.post("/", authorize, upload, async (req, res) => {
  let client = JSON.parse(req.body.client);
  let cards = [];
  if (req.files.length > 0) {
    req.files.map(file => {
      let card = new Card({
        name: file.filename,
        url: `/uploads/${file.filename}`
      });
      cards.push(card);
    });
  }
  let ids = [];
  const data = await saveAll(cards);
  data.map(item => ids.push(item._id));
  client.cards = ids;
  let newClient = new Client(client);
  newClient.createdBy = req.currentUser._id;
  newClient
    .save()
    .then(client => {
      return res.json(client);
    })
    .catch(err => {
      console.error("client.js: failed to create client", err);
      return res.status(500).json({
        error: err
      });
    });
});

router.put("/:id", authorize, upload, async (req, res) => {

  let cards = [];
  let client = JSON.parse(req.body.client);
  let undeleted = JSON.parse(req.body.undeleted);
  let clientID = req.params.id;
  console.error("client.js --------");

  req.files.map(file => {
    let card = new Card({
      name: file.filename,
      url: `/uploads/${file.filename}`
    });
    cards.push(card);
  });


  let ids = [];
  let data = "";
  if (cards.length > 0) { data = await saveAll(cards); data.map(item => ids.push(item._id)); client.cards = ids; }

  if (undeleted) { undeleted.map(item => ids.push(item._id)); }

  Client.findByIdAndUpdate(clientID, { $set: client })
    .then(policy => {
      return res.json(policy);
    })
    .catch(err => {
      console.error("Failed to update Client.", err);
      return res.status(500).json({ error: err });
    });
});

router.delete("/:id", authorize, async (req, res) => {

  const updateData = { del: true }
  Client.findByIdAndUpdate(req.params.id, {
    $set: updateData
  })
    .then((doc) => {
      return res.json(doc);
    })
    .catch(error => {
      console.log(
        "client.js: Unable to add policy to client",
        error
      );
      return res.status(500).json(error);
    });
});

router.post("/category", authorize, (req, res) => {
  const { category } = req.body

  if (category.length > 0) {
    Client.find({ createdBy: req.currentUser._id, category: { $in: category }, del: false })
      .then((users) => {
        return res.json(users);
      })
      .catch(error => {
        console.log(
          "client.js: Unable to get clients by category",
          error
        );
        return res.status(500).json(error);
      });
  } else {
    Client.find({ createdBy: req.currentUser._id, del: false })
      .then((users) => {
        return res.json(users);
      })
      .catch(error => {
        console.log(
          "client.js: Unable to get clients by category",
          error
        );
        return res.status(500).json(error);
      });
  }
});

router.post("/:id/add-policy", authorize, (req, res) => {
  const { id } = req.params;
  const benefit = req.body.benefit;
  let policy = req.body.policy;
  let newBenefit = new Benefit(benefit);
  newBenefit
    .save()
    .then(benefit => {
      let newPolicy = new Policy(policy);
      newPolicy.benefit = benefit._id;
      newPolicy
        .save()
        .then(policy => {
          Client.findById(id)
            .exec()
            .then(client => {
              client.policies.push(policy._id);
              client
                .save()
                .then(updated => {
                  return res.json(updated);
                })
                .catch(error => {
                  console.log(
                    "client.js: Unable to add policy to client",
                    error
                  );
                  return res.status(500).json(error);
                });
            })
            .catch(err => {
              console.error("client.js: failed to find client", err);
              return res.status(500).json({
                error: err
              });
            });
        })
        .catch(err => {
          console.error("client.js: failed to create policy", err);
          return res.status(500).json({
            error: err
          });
        });
    })
    .catch(error => {
      console.error("client.js: failed to create benefit", error);
      return res.status(500).json({
        error
      });
    });
});

router.delete("/:id/removepolicy", authorize, (req, res) => {
  Policy.findByIdAndRemove(req.params.id).then(() => {
    Policy.find()
      .exec()
      .then(policy => {
        return res.json();
      })
      .catch(err => {
        console.error("user.js: failed to lookup users", err);
        return res.status(500).json({
          error: err
        });
      });
  }).catch(err => {
    console.error("Failed to remove user:", err);
    return res.status(500).json({ error: err });
  })
})

router.get("/:id/policy", (req, res) => {
  Policy.findById(req.params.id)
    .exec()
    .then(policy => {
      return res.json(policy);
    })
    .catch(err => {
      console.error("client.js: failed to lookup policy by ID", err);
      return res.status(500).json({
        error: err
      });
    });
});

router.put("/:id/policy", authorize, (req, res) => {
  Policy.findByIdAndUpdate(req.params.id, { $set: req.body.policy })
    .then(policy => {
      Benefit.findByIdAndUpdate(req.body.benefit._id, {
        $set: req.body.benefit
      }).then(() => {
        return res.json(policy);
      }).catch(err => {
        console.error("Failed to update policy.", err);
        return res.status(500).json({ error: err });
      });
    })
    .catch(err => {
      console.error("Failed to update policy.", err);
      return res.status(500).json({ error: err });
    });
});

module.exports = router;
