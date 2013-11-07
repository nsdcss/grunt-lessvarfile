# grunt-lessvarfile

> Create a LESS variables-file that collects variables defined in other LESS-files (modules/components).

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-lessvarfile --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-lessvarfile');
```

## The "lessvarfile" task

### Overview
In your project's Gruntfile, add a section named `lessvarfile` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  lessvarfile: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.alignAt
Type: `Int`
Default value: `40`

#### options.sectionsmap
Type: `Object`
Default value: 
```js
{
  'c': 'Colors',
  's': 'Spacing',
  't': 'Typo'
}
```

#### options.sectionDelimiter
Type: `String`
Default value: `--`


### Usage Examples

#### Default Options

```js
grunt.initConfig({
  lessvarfile: {
    options: {},
    files: {
      'your-framework/variables.less': 'your-framework/modules/**/*.less'
    }
  },
})
```

#### Custom Options

```js
grunt.initConfig({
  lessvarfile: {
    options: {
      sectionDelimiter: '__',
      alignAt: 1,
      sectionsmap: {
        'c': 'My Crazy Colors',
        's': 'My Spacing',
        't': 'My Typo'
      }
    },
    files: {
      'your-framework/variables.less': 'your-framework/modules/**/*.less'
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

### 0.1.0

+ Initial Release

### 0.1.1

+ Removed "walk" dependency
+ Added delimiter option

### 0.1.2

+ Renamed Git repository
