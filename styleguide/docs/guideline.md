# Guideline for FESK Styleguides

### Introduction

Fesk (Front End Starter Kit) is meant to be used as a living styleguide, documentation generator, and Starter files. Use `fesk` command to generate styleguide

### Enhanced - KSS

Fesk Styleguide is based on KSS (Knyle Style Sheets). KSS a documentation syntax for stylesheets is an awesome tool but lacked some features that a living styleguide needs. Fesk takes the format that KSS started and expands on it. It includes "browser compatibility", "notes", "preproccessor mixin, function and variable references", "color chips" and "fonts". Furthermore Fesk has implemented a change log, and simple stylesheet statistics dashboard, and versioning.

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


## Overview page

You can create an Overview page for your styleguide using Markdown,
check docs for more info.

# Guideline for FESK Stylesheets and naming conventions

##Class naming conventions

    .[utility]

        utility- single word utility name

        Example:
        .list
        .right


    .[namespace][-block][_component]*[-modifier]*
                                     [@breakPoint]*

        namespace - 1-4 letters
        block - single word element name
        component - single word element child (only one level deep)
        modifier - single word modifier

        Example:
        .jvs-navigaiton_item--first
        .env-tab_wrap
        .ui-btn

##javascript class state

    .[subject-verb agreement][-state]

        Example:
        .is-active
        .has-focus
        .not-selected


##JS

    $[var] = element wrapped in jQery
    _[var] = standard javascript


##Terms

    layout
        grid - container where item flow horizontally and wrap vertically
        column - container
        row
        block/wrap
        item



    placement
        abs
        textr
        textl
        textc
        floatr
        floatl
        padr
        padl
        padt
        padb

    style
        unstyled
        pane

    action
        trans
        fade
