/*
Copyright 2013, Sandia Corporation. Under the terms of Contract
DE-AC04-94AL85000 with Sandia Corporation, the U.S. Government retains certain
rights in this software.
*/

$(document).ready(function()
{
  var server_root = document.querySelector("#slycat-server-root").getAttribute("href");

  var model = {}
  model.server_root = server_root;
  model.project = ko.mapping.fromJS({name:"", description:"",created:"",creator:"",acl:{administrators:[],writers:[],readers:[]}});
  model.models = ko.mapping.fromJS([]);

  // Load information about the project.
  $.ajax(
  {
    dataType : "json",
    type : "GET",
    url : location.href,
    success : function(project)
    {
      ko.mapping.fromJS(project, model.project);
    },
  });

  // Load the project models.
  $.ajax(
  {
    dataType : "json",
    type : "GET",
    url : location.href + "/models",
    success : function(models)
    {
      ko.mapping.fromJS(models, model.models);
    },
  });

  // Size the page content to consume available space
  function size_content()
  {
    $(".slycat-content").css("min-height", $(window).height() - $("slycat-navbar > div").height());
  }
  $(window).resize(size_content);
  window.setTimeout(function() { $(window).resize(); }, 10);

  ko.applyBindings({}, document.querySelector("slycat-navbar"));
  ko.applyBindings(model, document.getElementById("slycat-project"));
});
