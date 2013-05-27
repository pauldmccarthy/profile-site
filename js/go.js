/*
 * this is a complete hack. I am not responsible for any of it.
 *
 * Author: Paul McCarthy <pauld.mccarthy@gmail.com>
 */
var atom_jsonp;
$(document).ready(function() {

var drawGraph;
var showImages;
var showText;
var nodeFont;
var nodeTextAlign;
var nodeTextBaseline;
var nodeCursor;
var onClick;
var nodeRadius;
var nodeColor;
var removeChildren;
var addChildren;

var windowx = 800;
var windowy = 600;

var graphdata = {
  nodes:[
    { nodeName    : "paul"
    , childnodes  : []
    , childlinks  : []
    , color       : "#cc9999"
    , altColor    : "#996666"
    , click       : function(d,layout) {
        addChildren(d,layout, [

          { nodeName    : "small adventures"
          , childnodes  : []
          , childlinks  : []
          , click       : function(d,layout) {
              addChildren(d, layout, [
                { nodeName  : "http://pauldmccarthy.github.com/"
                , link      : "http://pauldmccarthy.github.com/"
                , desc      : "A blog where I write about tramps, rides, and other things."
                }
              ]);

              var url = "http://pauldmccarthy.github.com/atom.js";
              atom_jsonp = function(posts) {
                posts.map(function(post) {
                  addChildren(d,layout, [
                  { nodeName : post.title
                  , link     : post.link
                  , desc     : $('<div/>').html(post.content).text()
                  }]);
                });
              };

              $.getScript(url);
            }
          }

        , { nodeName    : "github"
          , childnodes  : []
          , childlinks  : []
          , click       : function(d,layout) {
              addChildren(d,layout,[
              { nodeName : "http://www.github.com/pauldmccarthy"
              , link     : "http://www.github.com/pauldmccarthy"
              , desc     : "Source repository containing code I've written."
              }
              ]);

              var url = "https://api.github.com/users/pauldmccarthy/repos?callback=?";

              $.getJSON(url, function(repos) {

                repos.data.map(function(r) {
                  addChildren(d,layout,[
                  { nodeName : r.full_name
                  , link     : r.html_url
                  , desc     : r.description
                  }
                  ]);
                });
              });
            }
          }

        , { nodeName    : "twitter"
          , childnodes  : []
          , childlinks  : []
          , click       : function(d,layout) {

              var screenName = "pauldmccarthy";
              var url = "http://api.twitter.com/1/statuses/user_timeline.json?"
                + "screen_name=pauldmccarthy&count=5&callback=?";

              addChildren(d,layout,[
              { nodeName : "http://www.twitter.com/pauldmccarthy"
              , link     : "http://www.twitter.com/pauldmccarthy"
              , desc     : "Boring things I say on twitter."
              }
              ]);

              $.getJSON(url, function(stats) {

                var childnodes = [];

                childnodes = stats.map(function(s) {
                  return {nodeName : s.created_at.substring(0,10) + ": " + s.text};
                });
                addChildren(d,layout,childnodes);
              });
            }
          }
        , { nodeName    : "about"
          , childnodes  : []
          , childlinks  : []
          , click       : function(d,layout) {

              var nodes = [
                { nodeName : "pauldmccarthy@gmail.com" }
              , { nodeName : "pmccarthy@cs.otago.ac.nz" }
              , { nodeName : "hobbies" 
                , childnodes : []
                , childlinks : []
                , click    : function(nd,nlayout) {
                    $.getJSON("hobbies.json", function(json) {
                      var nodes = json.hobbies.map(function(h) {
                        return {
                          nodeName : h.name
                        , click    : function() {showImages(h.images);}
                        }
                      });
                      addChildren(nd,nlayout,nodes);
                    });
                  }
                }
              , { nodeName : "cv"
                , childnodes : []
                , childlinks : []
                , click      : function(nd, nlayout) {
                    $.getJSON("cv.json", function(json) {
                      var entries = json.cv;
                      var nodes = entries.map(function(e) {
                        return {
                          nodeName : e.date + ": " + e.title
                        , click    : function() {showText(e.date + ": " + e.title, null, e.desc);}
                        };
                      });

                      addChildren(nd,nlayout,nodes);
                    });
                  }
                }
              ];

              addChildren(d,layout,nodes);
            }
          }
        , { nodeName : "work" 
          , childnodes : []
          , childlinks : []
          , click    : function(nd,nlayout) {
              $.getJSON("work.json", function(json) {
                var nodes = json.work.map(function(w) {
                  return {
                    nodeName:w.title
                  , click: function() {
                      var text = w.desc + "<br/>";
                      if (w.resources.length > 0) {
                        text = text + "<br/><div class=\"text_subtitle\">Resources</div><br/>";
                        for (var i = 0; i < w.resources.length; i++) {
                          text = text + "<a href=\"" 
                            + w.resources[i].href + "\">" 
                            + w.resources[i].title + "</a><br/>";
                        }
                      }
                      if (w.links.length > 0) {
                        text = text + "<br/><div class=\"text_subtitle\">Links</div><br/>";
                        for (var i = 0; i < w.links.length; i++) {
                          text = text + "<a href=\"" 
                            + w.links[i].href + "\">" 
                            + w.links[i].title + "</a><br/>";
                        }
                      }
                      showText(w.title,null,text);
                    }
                  }
                });
                addChildren(nd,nlayout,nodes);
              });
            }
          }
        ]);
      }
    }
  ],
};

showImages = function(images) {

  if (images.length > 0)  {$.fancybox(images);}
  else {showText("Sorry",null,"No images to display");}
}

showText = function(title, link, text) {

  var html = "";
  if (link && title) {
    html = html + "<div id=\"text_title\">" 
      + "<a href=\"" + link + "\">" + title + "</a></div><br/>";
  }
  else if (title) {
    html = html + "<div id=\"text_title\">"  + title  + "</div><br/>";
  }
  else if (link) {
    html = html + "<div id=\"text_title\">" 
      + "<a href=\"" + link + "\">" + link + "</a></div><br/>";
  }

  if (text)  html = html + "<div id=\"text_text\">"  + text  + "</div><br/>";

  $("#text").html(html);
  $.fancybox($("#text"), {
    onClosed : function() { $("#text").html("");}
  });
}

drawGraph = function() {

  graphdata.nodes[0].x = windowx/2;
  graphdata.nodes[0].y = windowy/2;

  var vis = new pv.Panel()
    .canvas("graph")
    .width(windowx)
    .height(windowy)
    .lineWidth(2)
    .strokeStyle("#aaaacc")
    .fillStyle("#ddddff")
    .event("mousedown",  pv.Behavior.pan());

  var stat = vis.add(pv.Label)
    .left(windowx/2)
    .top(40)
    .textAlign("center");

  var layout = vis.add(pv.Layout.Force)
    .nodes(graphdata.nodes)
    .links([])
    .springLength(100)
    .chargeConstant(-20)
    .bound(true);

  layout.link.add(pv.Line)
    .lineWidth(5);
  
  layout.node.add(pv.Dot)
    .def("i", -1)
    .lineWidth(1)
    .fillStyle(nodeColor)
    .radius(   nodeRadius)
    .title(             function(d) {return d.nodeName;})
    .event("mouseover", function()  {this.i(this.index);})
    .event("mouseout",  function()  {this.i(-1);})
    .event("mousedown", pv.Behavior.drag())
    .event("dblclick",     function(d) {onClick(d,layout);})
    .cursor(            nodeCursor)
    .add(pv.Label)
      .text(         function(d) {return d.nodeName;})
      .textAlign(    nodeTextAlign)
      .textBaseline( nodeTextBaseline)
      .textMargin(   nodeRadius);

  vis.render();
}

nodeFont = function(dot) {

  if (this.i() == this.index) return "bold 10px sans-serif";
  else return "10px sans-serif";

  if (dot.click) return "bold 10px sans-serif";
  return "10px sans-serif";
}

nodeTextAlign = function(dot) {

  var delta;

  if (!dot.parent) delta = dot.x - (windowx/2);
  else             delta = dot.x - dot.parent.x;

  if      (delta >  20) return "left";
  else if (delta < -20) return "right";
  else                  return "center";
}

nodeTextBaseline = function(dot) {

  var delta;

  if (!dot.parent) delta = dot.y - (windowy/2);
  else             delta = dot.y - dot.parent.y;

  if      (delta >  20) return "top";
  else if (delta < -20) return "bottom";
  else                  return "center";
}

nodeCursor = function(dot) {
  if (dot.link || dot.childnodes) return "pointer";
  else                            return "default";
}

nodeRadius = function(dot) {
  if      (dot.radius)            return dot.radius;
  else if (dot.click || dot.link) return 15;
  else                            return 12;
}

nodeColor = function(dot) {

  if (dot.color) {
    if (dot.altColor && 
        this.i() == this.index) return dot.altColor;
    else                        return dot.color;
  }
  if (dot.click) { 
    if (this.i() == this.index) return "#ffaaaa";
    else                        return "#ffdddd";
  }
  if (dot.link) {
    if (this.i() == this.index) return "#aaaaff";
    else                        return "#aaddff";
  }
  
  return "#ffffff";
}

onClick = function(d,layout) {

  if (d.link) {

    showText(d.nodeName,d.link,d.desc);
    return;
  }

  if (!d.childnodes) {
    if (d.click) d.click(d,layout);
    return;
  }

  if (d.childnodes.length > 0) removeChildren(d,layout);
  else                         d.click(       d,layout);
}

removeChildren = function(d, layout) {

  if (!d.childnodes) return;

  d.childnodes.map(function(c) {removeChildren(c,layout);});

  var nodes = layout.nodes();
  var links = layout.links();

  for (var i = 0; i < d.childnodes.length; i++)  
    nodes.splice(nodes.indexOf(d.childnodes[i]), 1);

  for (var i = 0; i < d.childlinks.length; i++) 
    links.splice(links.indexOf(d.childlinks[i]), 1);

  d.childnodes.map(function(c) {c.deleted = true;});
  d.parent     = null;
  d.childnodes = [];
  d.childlinks = [];

  layout
    .nodes(nodes)
    .links(links)
    .reset()
    .render();
}

addChildren = function(parent, layout, childnodes) {

  if (!parent.childnodes) return;
  if (!childnodes.length) return;
  if (parent.deleted)     return;

  var nodes = layout.nodes();
  var links = layout.links();

  var childlinks = Array();
  var startnidx  = nodes.length;
  var startlidx  = links.length;

  for (var i = 0; i < childnodes.length; i++) {

    var px, py, ppx, ppy;
    px  = parent.x;
    py  = parent.y;
    ppx = parent.parent ? parent.parent.x : windowx /2;
    ppy = parent.parent ? parent.parent.y : windowy/2;

    childnodes[i].parent = parent;
    childnodes[i].x = px - (ppx - px) + (Math.random()*10 - 5);
    childnodes[i].y = py - (ppy - py) + (Math.random()*10 - 5);
    childlinks.push({
        source:parent.index
      , target:i+startnidx
    });
  }

  nodes = nodes.concat(childnodes);
  links = links.concat(childlinks);

  parent.childnodes = parent.childnodes.concat(childnodes);
  parent.childlinks = parent.childlinks.concat(childlinks);

  layout
    .nodes(nodes)
    .links(links)
    .reset()
    .render();
}

drawGraph();
});
