diff --git a/express-app/app/models/search.js b/express-app/app/models/search.js
index fbfefc0..5a8d02b 100644
--- a/express-app/app/models/search.js
+++ b/express-app/app/models/search.js
@@ -17,7 +17,6 @@ function getResults(searchTerms, req, res) {
 				elementParsed = element.split(" ");
 				var oneResult = new Result(elementParsed[0], elementParsed[1], elementParsed[2]);
 				results.push(oneResult);
-				//oneResult.someFunction(); // TODO: Remove
 			}
 		});
 		res.render('search-results', {
diff --git a/express-app/app/views/search-results.jade b/express-app/app/views/search-results.jade
index 940e647..0ac6a9a 100644
--- a/express-app/app/views/search-results.jade
+++ b/express-app/app/views/search-results.jade
@@ -10,5 +10,8 @@ block content
       .result.clearfix(class="#{iter % 2 === 0 ? '' : 'odd'}")
         h2 ##{iter + 1}
         p [#{result.filename}]
-        audio(src="/sounds/#{result.filename}", controls)
-          p Your browser doesn't support HTML5 audio
+        .audio-file
+          audio(src="/sounds/#{result.filename}", controls)
+            p Your browser doesn't support HTML5 audio
+          p
+            a(href="/sounds/#{result.filename}") #{result.filename}
diff --git a/express-app/public/stylesheets/search-results.css b/express-app/public/stylesheets/search-results.css
index 03c059f..4e793f3 100644
--- a/express-app/public/stylesheets/search-results.css
+++ b/express-app/public/stylesheets/search-results.css
@@ -1,7 +1,10 @@
-audio {
+.audio-file {
     width: 50%;
     float: right;
 }
+audio {
+    width: 100%;
+}
 #results-wrap {
     padding: 10px 0 0;
 }
