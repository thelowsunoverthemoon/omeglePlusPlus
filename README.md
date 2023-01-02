<h1 align="center"> omegle++ </h1>
<p align="center">match with similar users, chat by code that runs live on a canvas!</p>

## features

* chat by messaging/coding that runs on a canvas
* login screen that matches you with similar users
* parser/interpreter for custom Lisp-based language, returns error msgs to user
* language supports logic, nested expressions, and shapes/imgs/animations
* uses :
  - **express.js** for server
  - **react.js** for client
  - **socket.io** for server-client communication
  - **jest** for tests

## screen captures

<img src="https://i.imgur.com/GDsewxL.gif">
<img src="https://i.imgur.com/rwIwaTO.gif">


## language

The language is based on Lisp. To code, you must start it with ```\co``` and specify the amount of time you want on screen with ```(time)```, which ticks down incrementally. Then you can add expressions after as needed. There is a special variable ```t```; the value is the current time left. The type ```Col``` can be one of 
```"black", "white", "pink", "brown", "orange", "yellow", "blue", "red", "green"```. Numbers below refer to the parameter index.

| function  | description | parameters | return |
| ------------- | ------------- | ------------- | ------------- | 
| ```even``` | returns true if even | ```Int``` | ```Bool``` |
| ```odd``` | returns true if odd | ```Int``` | ```Bool``` |
| ```?``` | runs function if the 1 param evals to true | ```Bool, Void``` | ```Void``` |
| ```!``` | runs function if the 1 param evals to false | ```Bool, Void``` | ```Void``` |
| ```=``` | returns true if equal | ```Int, Int``` | ```Bool``` |
| ```*``` | returns 1 param * 2 param | ```Int, Int``` | ```Int``` |
| ```+``` | returns 1 param + 2 param | ```Int, Int``` | ```Int``` |
| ```-``` | returns 1 param - 2 param | ```Int, Int``` | ```Int``` |
| ```/``` | returns 1 param / 2 param | ```Int, Int``` | ```Int``` |
| ```rect``` | draws rect of at x 1 y 2, with size 3 x, 4 y, and col 5 | ```Int, Int, Int, Int, Col``` | ```Void``` |
| ```img``` | draws img with src 5, at x 1 y 2, with width 3, height 4 | ```Int, Int, Int, Int, Str``` | ```Void``` |
| ```circle``` | draws circle at x 1 y 2 with radius 3, start angle 4, end angle 5, and col 7. If 6 evals false, draw clockwise. | ```Int, Int, Int, Int, Int, Bool, Col``` | ```Void``` |
| ```line``` | draws line from point x 1 y 2, to x 3 y 4 | ```Int, Int, Int, Int, Col``` | ```Void``` |

For example,

```
\co (5) (? (even t) (rect (* t 20) 90 10 30 red)) (? (odd t) (rect (* t 20) 90 10 30 blue))
```

will draw a rectangle that lasts for 5 seconds that moves to the left, and alternates colours between red and blue. Another example

```
\co (10) (img 2 3 20 20 https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png)
```

will draw a heart (the url) at 2, 3 with proportions 20 20. The code in the screen capture above is

```
\co (5) (? (even t) (img 2 3 250 250 https://preview.redd.it/uk6i39crfju91.png?width=320&crop=smart&auto=webp&s=6cfaa99a7e00ff3399e4d6ad6a62d413d6fadc2d)) (? (odd t) (img 2 3 250 250 https://preview.redd.it/7pn4e9crfju91.png?width=512&format=png&auto=webp&s=e103518abb204f7433ec40534901c15e789a5863))
```

## test

Use

```Batch
npm test
```

in the test folder

## run

To run client side, use

```Batch
npm start
```

in the client folder. To start server, use

```Batch
npm start
```
in the server folder.
