# WebApps Fall 2023

This is the repo containing my classwork for my Fall 2023 Web Applications course, taught by Dr. Mark Lewis. The course split up work into mini-projects, aka tasks. Tasks 1-2, 3, 4, and 10 are usable [here](https://cs.trinity.edu/~charger/WebApps/). The rest were deployed on school computers, so you'll just have to look at the code for those.

## Task Descriptions:
_All routing is done through [./server/conf/routes](./server/conf/routes)_

### Task 1-2 (HTML, CSS):
Wrote and styled the index page for all tasks as well as an About Me page.

_Code viewable in browser_

### Task 3 (HTML, CSS, JavaScript):
Imported NBA team statistics and wrote JavaScript to help visualize and sort the data.

_Code viewable in browser_

### Task 4 (HTML, CSS, JavaScript):
Wrote a basic game using JavaScript.

_Code viewable in browser_

### Task 5 (Scala Play):
Wrote a public and private message board that works locally with multiple users. 

[./server/app/controllers/Application.scala](./server/app/controllers/Application.scala)

[./server/app/models/UserDataModel.scala](./server/app/models/UserDataModel.scala)

[./server/app/views/](./server/app/views/)

### Task 6 (Scala Play):
Wrote a series of JUnit tests for task 5.

[../server/test](../server/test)

### Task 7 (Scala Play):
Wrote a simple lobby for players to move around in, supporting multiple concurrent non-local users

[./server/app/actors/](./server/app/actors/)

[./server/app/controllers/Lobby.scala](./server/app/controllers/Lobby.scala)

[./server/app/views/lobby.scala.html](./server/app/views/lobby.scala.html)

### Task 8 (Scala Play, React.js):
Rewrote the task 5 message board using React.js

[./server/app/controllers/ReactMessage.scala](./server/app/controllers/ReactMessage.scala)

[./server/public/javascript/](./server/public/javascript/)

### Task 9 (Scala Play, React.js, PostgreSQL):
Rewrote the task 8 message board backend using PostgreSQL

[./server/app/controllers/DbMessage.scala](./server/app/controllers/DbMessage.scala)

[./server/app/models/UserDataDBModel.scala](./server/app/models/UserDataDBModel.scala)

### Task 10 (Scala.js):
Rewrote the task 4 game using Scala.js

[./scalajs-only/src/main/](./scalajs-only/src/main/)

### Task 11 (Scala Play, Scala.js):
Wrote a basic drawing program supporting multiple concurrent non-local users

[./server/app/actors/](./server/app/actors/)

[./client/src/main/scala/playscala/Task11.scala](./client/src/main/scala/playscala/Task11.scala)