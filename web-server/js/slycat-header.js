(function()
{
  ko.components.register("slycat-header",
  {
    viewModel: function(params)
    {
      var server_root = document.querySelector("#slycat-server-root").getAttribute("href");
      var current_revision = null;
      var view_model = this;

      view_model.projects_url = server_root + "projects";
      view_model.logo_url = server_root + "css/slycat-small.png";
      view_model.user = {uid : ko.observable(""), name : ko.observable("")};

      view_model.show_about = function()
      {
        $("#about-slycat-dialog").dialog("open");
        $.ajax(
        {
          type : "GET",
          url : server_root + "configuration/version",
          success : function(version)
          {
            $("#about-slycat-version").html("Slycat version " + version.version + ", commit " + version.commit);
          }
        });
        $.ajax(
        {
          type : "GET",
          url : server_root + "configuration/support-email",
          success : function(email)
          {
            $("#about-slycat-help").html("Request help at <a href='mailto:" + email.address + "?subject=" + email.subject + "'>" + email.address + "</a>");
          }
        });
      }

      // Get information about the currently-logged-in user.
      $.ajax(
      {
        type : "GET",
        url : server_root + "users/-",
        success : function(user)
        {
          view_model.user.uid(user.uid);
          view_model.user.name(user.name);
        }
      });

      $('#about-slycat-dialog').dialog({
        modal: true,
        autoOpen: false,
        minWidth: 500,
        buttons: {
          'Close': function() {
            $(this).dialog('close');
          },
        },
      });

      $('#workers-close').click(function()
      {
        $('#workers-close').slideUp();
        $('#workers-container').switchClass("workersDetail","workersCompact");
        window.setTimeout( "$('#workers-container .worker').each(function() { $(this).qtip('enable'); })", 250 ); // Enable tooltips when collapsing status bar. Added dealy otherwise tooltips appear before slideUp is finished
      });

      // Expand status bar when any part of it is clicked
      $('#workers-container.workersCompact').click(function()
      {
        if($(this).hasClass('workersCompact'))
        {
          document.getSelection().removeAllRanges(); // Need to clear selection after click since for some reason clicking an icon selects the status text to the right of it
          // Hide and disable all tooltips when expanding status bar
          disable_tooltips($("#workers-container .worker"));
          $('#workers-close').slideDown();
          $('#workers-container').switchClass("workersCompact","workersDetail");
        }
      });

      function close_model(mid)
      {
        $.ajax(
        {
          type : "PUT",
          url : server_root + "models/" + mid,
          contentType : "application/json",
          data : $.toJSON({
            "state" : "closed"
          }),
          processData : false
        });
      }

      function disable_tooltips(selector)
      {
        selector.each(function() { $(this).qtip('hide').qtip('api').disable(true); });
      }

      function update()
      {
        $.ajax(
        {
          dataType : "text",
          type : "GET",
          cache : false, // Don't cache this request; otherwise, the browser will display the JSON if the user leaves this page then returns.
          url : server_root + "models" + (current_revision != null ? "?revision=" + current_revision : ""),
          success : function(text)
          {
            // https://github.com/jquery/jquery-migrate/blob/master/warnings.md#jqmigrate-jqueryparsejson-requires-a-valid-json-string
            var results = text? $.parseJSON(text) : null;
            if(results != null)
            {
              current_revision = results.revision;
              models = results.models;
              models.sort(function(a, b)
              {
                if(!a["finished"] && !b["finished"])
                {
                  if(a["started"] > b["started"])
                    return -1;
                  if(a["started"] == b["started"])
                    return 0;
                  return 1;
                };
                if(a["finished"] && b["finished"])
                {
                  if(a["finished"] > b["finished"])
                    return -1;
                  if(a["finished"] == b["finished"])
                    return 0;
                  return 1;
                }
                return a["finished"] ? 1 : -1;
              });

              function create_model_scaffolding(model)
              {
                return $("<div class='worker'>")
                  .attr('id', model["_id"])
                  .append($("<div>").addClass("message").click(function(e){window.location=server_root + "models/" + model["_id"];}))
                  .append($("<div>").addClass("name").click(function(e){window.location=server_root = "models/" + model["_id"];}))
                  .append($("<div>").addClass("close").append($("<button>").html("&times;").attr("title", "Close model.").click(
                    function(e){
                      close_model(model["_id"]);
                      e.stopPropagation();
                    }
                  )))
                  .qtip({
                    position: {
                      adjust: {
                        x: -14
                      }
                    },
                    content: {
                      text: ' ' // Need to initiate with some text otherwise tooltip is never created
                    },
                    hide: {
                      delay: 500,
                      fixed: true,
                    },
                    show: {
                      solo: true
                    },
                  });
              }

              $.each(models, function(index, model)
              {
                var model_id = model["_id"];
                var line = $("#" + model_id ,"#workers #workers-container");
                if(line.length == 0)
                  line = create_model_scaffolding(model).appendTo($("#workers #workers-container #workersWrapper"));

                line.toggleClass("finished", model["finished"] ? true : false)
                  .addClass(model["result"])
                  .addClass("updated") // Mark each model so we can remove the ones that no loner exist
                  .qtip(
                    'option',
                    'content.title.text',
                    (model["name"] || "")
                  );

                if(model["finished"]) {
                  line.click(function(e){
                    window.location=server_root + "models/" + model["_id"];
                    e.stopPropagation();
                  });
                }

                if( $('#workers-container').hasClass('workersDetail') ) {
                  disable_tooltips(line);
                }
                line.find(".message").text(model["message"] || "");
                line.find(".name").text(model["name"] || "");
                line.find(".close button").unbind('click').click(
                  function(e){
                    close_model(model_id);
                    e.stopPropagation();
                  }
                );

                // Set up progress indicator for workers with progress
                if(model.hasOwnProperty("progress")) {
                  // If the line doesn't have a progress class, add the class and add a progress indicator if it's not finished yet
                  if(!line.hasClass("progressDeterminate")) {
                    line.addClass("progressDeterminate");
                    if(!model["finished"]){
                      line.append($("<input>").addClass("pie").attr("value", model["progress"]).knob({
                        'min':0,
                        'max':1,
                        'readOnly':true,
                        'displayInput':false,
                        'fgColor':'#4D720C',
                        'bgColor':'#D7D7D6',
                        'width':15,
                        'height':15,
                        'thickness':0.4,
                        'step':0.01,
                      }));
                    }
                  }
                  // Otherwise check if it's not finished and update the progress indicator with current value
                  else if(!model["finished"]){
                    line.find(".pie").val(model["progress"]).trigger('change');
                  }
                  else {
                    line.find("input.pie").parent().remove();
                  }
                }

                if(true)
                {
                  line.qtip('option','content.text',
                    $('<div>').append($('<div>').text((model["message"] || ""))).append($('<a>').attr('href', server_root + "models/" + model['_id']).text('View'))
                  );

                }
                else
                {
                  line.qtip('option','content.text',
                    $('<div>').append($('<div>').text((model["message"] || ""))).append($('<a href="#">').text('Delete').click(close_model.bind(this, model_id)))
                  );
                }

              });

              $("#workers-container .worker").not(".updated").remove(); // Remove any non-existing workers
              $("#workers-container .worker").removeClass("updated"); // Clear the updated flag
            }

            // Restart the request immediately.
            window.setTimeout(update, 10);
          },
          error : function(request, status, reason_phrase)
          {
            // Rate-limit requests when there's an error.
            window.setTimeout(update, 5000);
          }
        });
      }

      update();
    },
    template:
      '<div id="workers"> \
        <div id="workers-close" style="display: none;">Close</div> \
        <div id="workers-container" class="workersCompact"> \
          <div id="workersWrapper"></div> \
        </div> \
      </div> \
      <div id="header"> \
        <div class="width-wrapper"> \
          <a data-bind="attr: {href:projects_url}" id="title-link"> \
            <img id="logo" data-bind="attr: {src:logo_url}" title="A very sly cat." /> \
            <h1 id="title">Slycat <span id="version"></span></h1> \
          </a> \
          <ul id="user-actions"> \
            <li id="login"><span id="login-status" class="session"><span data-bind="text: user.name"></span> (<span data-bind="text: user.uid"></span>)</span></li> \
            <li data-bind="click: show_about"> About Slycat </li> \
          </ul> \
        </div> \
        <div id="about-slycat-dialog" class="dialog" title="About Slycat" style="display: none;"> \
          <p><h3>Slycat</h3></p> \
          <p>Slycat is a web-based analysis and visualization platform created at Sandia National Laboratories.</p> \
          <p>The documentation is <a href="http://slycat.readthedocs.org/en/latest">here.</a></p> \
          <p id="about-slycat-help"></p> \
          <p id="about-slycat-version"></p> \
        </div> \
      </div>'
  });

}());
