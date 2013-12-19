# Copyright 2013, Sandia Corporation. Under the terms of Contract
# DE-AC04-94AL85000 with Sandia Corporation, the U.S. Government retains certain
# rights in this software.

import cherrypy
import h5py
import os
import threading
import types

def make_path(array, path):
  return os.path.join(path, array[0:2], array[2:4], array[4:6], array + ".hdf5")

def path(array):
  """Convert an array identifier to a data store filesystem path."""
  if path.root is None:
    path.root = cherrypy.tree.apps[""].config["slycat"]["data-store"]
  return make_path(array, path.root)
path.root = None

def create(array):
  "Create a new array in the data store, ready for writing."""
  array_path = path(array)
  cherrypy.log.error("Creating file {}".format(array_path))
  os.makedirs(os.path.dirname(array_path))
  return h5py.File(array_path, mode="w")

def open(array, mode="r"):
  """Open an array from the data store for reading."""
  array_path = path(array)
  cherrypy.log.error("Opening file {}".format(array_path))
  return h5py.File(array_path, mode=mode)

def delete(array):
  """Remove an array from the data store."""
  array_path = path(array)
  if os.path.exists(array_path):
    cherrypy.log.error("Deleting file {}".format(array_path))
    os.remove(array_path)

class null_lock(object):
  """Do-nothing replacement for a thread lock, useful for debugging threading problems with h5py."""
  def __enter__(self):
    pass
  def __exit__(self, exc_type, exc_value, traceback):
    pass

#lock = null_lock()
lock = threading.Lock()
