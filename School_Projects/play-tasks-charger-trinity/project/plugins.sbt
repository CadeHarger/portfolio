// Comment to get more information during initialization
logLevel := Level.Warn

ThisBuild / libraryDependencySchemes ++= Seq(
  "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always
)

// Resolvers
resolvers += "Typesafe repository" at "https://repo.typesafe.com/typesafe/releases/"

// Sbt plugins
addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.8.1")

addSbtPlugin("com.vmunier"               % "sbt-web-scalajs"           % "1.2.0")
addSbtPlugin("org.scala-js"              % "sbt-scalajs"               % "1.13.2")

addSbtPlugin("com.typesafe.play"         % "sbt-plugin"                % "2.8.20")
addSbtPlugin("org.portable-scala"        % "sbt-scalajs-crossproject"  % "1.3.2")
addSbtPlugin("com.typesafe.sbt"          % "sbt-gzip"                  % "1.0.2")
addSbtPlugin("com.typesafe.sbt"          % "sbt-digest"                % "1.1.4")

