var express = require('express');
var router = express.Router();
var sequelize = require('../app.js').configDatabase;
const entityName = "Delivers";
const { DataTypes } = require('sequelize');

const Delivers = sequelize.define(entityName, {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  adresse_recu: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vehicule_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  nb_notes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
}, {
    tableName: entityName
});

async function authentification()
{
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database');
  }
}

async function synchronisation()
{
  try {
    await Delivers.sync();
  } catch(error) {
    console.log(entityName + " could not synchronize");
  }
}

async function creation(body)
{
  try 
  {
    await Delivers.create({
      id_user: body.id_user,
      adresse_recu: body.adresse_recu,
      vehicule_type: body.vehicule_type,
      notes: body.notes,
      nb_notes: body.nb_notes,
    });
    return true;
  } catch(error) {
    return null;
  }
}

async function update(body, idDeliver)
{
  try 
  {
    await Delivers.update({
      id_user: body.id_user,
      adresse_recu: body.adresse_recu,
      vehicule_type: body.vehicule_type,
      notes: body.notes,
      nb_notes: body.nb_notes,
    }, {
      where: {
        id: idDeliver
      }
    });
    return true;
  } catch(error) {
    return null;
  }
}

async function deletion(idDeliver)
{
  try 
  {
    await Delivers.destroy({ 
      where: {
        id: idDeliver
    }});
    return true;
  } catch(error) {
    return null;
  }
}

async function getAll()
{
  try 
  {
      return await Delivers.findAll();
  } catch(error) {
    return null;
  }
}

async function getOne(idDeliver)
{
  try 
  {
      return await Delivers.findAll({ 
        where: {
          id: idDeliver
      }});
  } catch(error) {
    return null;
  }
}

async function startConnection()
{
  await authentification();
  await synchronisation();
}

startConnection();


/* GET commands listing. */
router.get('/', function(req, res, next) 
{
  const allDocs = getAll();

  if (allDocs !== null)
    res.status(200).json(allDocs);
  else 
    res.status(401).json({ message: "Could not get " + entityName });
});


/* GET commands listing by id. */
router.get('/:id', function(req, res, next) 
{
  const doc = getOne(req.params.id);

  if (doc !== null)
    res.status(200).json(doc);
  else 
    res.status(401).json({ message: "Could not get one " + entityName });
});


/* POST */
router.post('/', function(req, res, next) 
{
  if (creation(req.body) !== null)
    res.status(201).json({ message: entityName + " created" });
  else 
    res.status(401).json({ message: "Could not create " + entityName });
});


/* PUT */
router.put('/:id', function(req, res, next) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).json({ message: entityName + "updated" });
  else 
    res.status(401).json({ message: "Could not update " + entityName });
});


/* DELETE */
router.delete('/:id', function(req, res, next)
{
  if (deletion(req.params.id) !== null)
    res.status(203).json({ message: entityName + "deleted" });
  else 
    res.status(401).json({ message: "Could not delete " + entityName });
});

module.exports = router;