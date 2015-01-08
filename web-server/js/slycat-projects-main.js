/*
Copyright 2013, Sandia Corporation. Under the terms of Contract
DE-AC04-94AL85000 with Sandia Corporation, the U.S. Government retains certain
rights in this software.
*/

define("slycat-projects-main", ["slycat-server-root", "slycat-projects"], function(server_root, projects)
{
  var module = {};
  module.start = function()
  {
    var page = {}
    page.server_root = server_root;
    page.projects = projects.watch();
    ko.applyBindings(page);
  }

  return module;
});
