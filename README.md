# Node file upload example

#### Environment:

- Node.js 4.2
- Mongo DB
- browserify

#### Backend:

- Express
- Mongo DB

#### Frontend:

- React
- jQuery

#### Install:

Install babel

``` shell
$ npm install -g babel-cli babel-preset-react
```

Install dependencies:

``` shell
$ npm install
```

Build bundle.js for front-end

``` shell
$ npm run-script ui
```

or use

``` shell
$ browserify ui/files.js -o public/javascripts/bundle.js -t [ babelify --presets [ es2015 react ] ]
```



#### Start server:

``` shell
$ npm start
```