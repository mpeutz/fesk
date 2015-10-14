# fesk

Fesk (**F**ront **E**nd **S**tarter **K**it) focusing on an integrated styleguide. The styleguide is based on KSS ([Knyle Style Sheets](http://warpspire.com/kss/)). KSS a documentation syntax for stylesheets is an awesome tool but lacked some features that a living styleguide needs. Fesk takes the format that KSS started and expands on it. It includes "browser compatibility", "notes", "preproccessor mixin, function and variable documentation", "color chips" and ~~"animations"~~. Furthermore Fesk has implemented a change log, stylesheet statistics dashboard, and ~~versioning~~.


This plugin currently lacks tests.

# How to use

Full documentation to come

##Fesk npm CLI commands

- **fesk -i**, **fesk -initailize**  Follow prompts to initialize fesk
- **fesk -u**, **fesk -update**   Follow prompts to update styleguide version
- **fesk -g**, **fesk -guide**  Parses styleguide
- **fesk -t**, **fesk -theme**  Follow prompts to update styleguide theme (is also run during fesk -i)
- **fesk**  generate styleguide ( alias for fesk -g)
- **fesk -?**, **fesk -help**  help

##Fesk styleguide comment blocks

### How it works
Each section in the guide is a defined by a block comment within the css file. The comment consists of key/value pairs with are used to generate the living styleguide. The styleguide is powered by angularjs parsing the key/value pairs.

### Syntax
#### Guide Metadata
This is heading documentation for the guide and will be included as a comment in the stylesheet. Must start with "Guide:"

```HTML
/*
Guide:          Stylesheet title (*required)
Client:         Branding for styleguide
Description:    Description of stylesheet
Version:        Stylesheet version
Date:           Date stylesheet was published
Author:         Author's name
Email:          Contact email
Url:            Website link
*/

```

#### Chapters
Define chapters of the stylesheet. These chapters are used to organize the styleguide. Must start with "Chapter:"

```HTML
/*
Chapter:        Chapter number (*required)
Title:          Chapter title
Description:    Chapter description (can contain HTML)
*/
```

#### Section
Define section of the style sheet as chapters. These chapters are used to organize the styleguide. These chapters will also  be used to generate a TOC (table of Content) that will be included as a comment at the top of the stylesheet. Must start with "Section:"

```HTML
/*
Section:        Number as chapter . section (e.g 1.2, 3.12, 11.3, etc.)
                used to set the order of section appearance. (*required)
Compatibility:  Browser compatiblity list. Comma delimited string with six items
                (ie, firefox, chrome, , opera, ios, & andriod)
Title:          Section name
Type:           HTML - Type of section used to set template in styleguide.
                This can be HTML, CSS, SCSS, LESS, or Color. (defaults to HTML)
Tags:           Tags for organizing section. Comma delimited list.
Description:    Section description.
Modifiers:      Use to set modifier classes on section.
                (e.g. :hover - shows hover state,
                .red - changes button to red color)
Note:           Any notes related to section.
Code:           HTML/markup to show styles.
*/
```

#### Preprocessor
Define colors within your styleguide. Must start with "process:".

```
/*
Process:        Number as chapter . section (e.g 1.2, 3.12, 11.3, etc.)
                used to set the order of section appearance. (*required)
Title:          Name of color section
Description:    Description of color section
Lang:           Preprocessor language
Note:           Add notes aboutr mixin/function
Var:            List of variables: $vaiable, and use.
                This list is separated by three tildes ~~~
                $main-color
                Uses the main color
                ~~~
                $margin-top
                Sets the top margin space
logic:          Show some or all of the mixin/function
*/
```

#### Colors
Define colors within your styleguide. Must start with "Colors:".

```
/*
Colors:         Number as chapter . section (e.g 1.2, 3.12, 11.3, etc.)
                used to set the order of section appearance. (*required)
Title:          Name of color section
Description:    Description of color section
Color:          List of colors: color, name of color, and use.
                This list is separated by three tildes ~~~
                (e.g
                blue
                #ff0
                 main color
                ~~~
                red
                rgb(255, 10,20)
                secondary color
                ~~~
                green
                limegreen
                whatever
                )
*/
```

# Install

Currently this package is not in npm. I'm still working out some of the details before it is submitted. However, if you want to play with it you can install directly from this repository.

```
npm install git://github.com/mpeutz/fesk.git
```

# Gulp

There will be a [gulp plugin for fesk](https://github.com/mpeutz/gulp-fesk).


Made in Oregon.
